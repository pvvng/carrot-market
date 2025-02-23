"use client";

import { ChatsType } from "@/app/(tabs)/chat/page";
import { formatToTimeAgo } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ChatsListProps {
  initialChats: ChatsType;
  userId: number;
}

export default function ChatsList({ initialChats, userId }: ChatsListProps) {
  const [chats, setChats] = useState<ChatsType>(initialChats);

  useEffect(() => {
    // supabase 클라이언트 생성하기
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_API_KEY!
    );

    // 모든 채팅방 구독
    const channels = chats.map((room) => client.channel(`room-${room.id}`));

    channels.forEach((channel) =>
      channel
        .on("broadcast", { event: "message" }, (payload) => {
          const { user, chatRoomId, ...newMessage } = payload.payload;
          // 채팅방에 새 메시지 집어넣기
          setChats((prevChats) =>
            prevChats.map((room) =>
              room.id === payload.payload.chatRoomId
                ? { ...room, messages: [...room.messages, newMessage] }
                : room
            )
          );
        })
        .subscribe()
    );

    // 구독 해제
    return () => {
      channels.forEach((channel) => channel.unsubscribe());
    };
  }, []);

  return chats.map((room) => {
    // 대화중인 사용자
    const talkingUser = room.users.filter((user) => user.id !== userId)[0];
    // 마지막 메시지
    const lastMsg = room.messages[room.messages.length - 1];
    const messages = room.messages;
    const unReadMessages = messages.filter(
      (msg) => !msg.read.some((user) => user.userId === userId)
    );

    return (
      <a key={room.id} href={`/chat/${room.id}`} className="*:text-white">
        <div className="border-b p-5 border-neutral-500 flex justify-between items-center gap-5">
          <div className="flex gap-2 items-center">
            <div className="*:bg-white">
              {talkingUser.avatar ? (
                <Image
                  src={talkingUser.avatar}
                  alt={talkingUser.username}
                  width={32}
                  height={32}
                  className="size-8 rounded-full"
                />
              ) : (
                <UserIcon className="text-black size-8 rounded-full" />
              )}
            </div>
          </div>
          <div className="w-3/4 flex flex-col gap-2">
            <div className="flex items-center gap-1 *:text-neutral-200 *:text-sm">
              <p>{talkingUser.username}</p>
              <p>·</p>
              <p>{formatToTimeAgo(lastMsg.created_at.toString())}</p>
            </div>
            <p className="truncate">{lastMsg.payload}</p>
          </div>
          {unReadMessages.length > 0 ? (
            <div className="size-5 bg-red-500 rounded-full flex justify-center items-center text-sm font-semibold">
              {unReadMessages.length}
            </div>
          ) : (
            <div className="size-5" />
          )}
        </div>
      </a>
    );
  });
}
