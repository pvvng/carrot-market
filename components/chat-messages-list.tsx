"use client";

import { saveMessage } from "@/app/chats/[id]/actions";
import { InitialChatMessages } from "@/app/chats/[id]/page";
import { UserType } from "@/lib/data/user";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon, UserIcon } from "@heroicons/react/24/solid";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ChatMessageListProps {
  initialMessages: InitialChatMessages;
  userId: number;
  user: UserType;
  chatRoomId: string;
}

export default function ChatMessagesList({
  initialMessages,
  userId,
  user,
  chatRoomId,
}: ChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const channel = useRef<RealtimeChannel>(undefined);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 가짜 메시지 추가하기
    const newMessage = {
      id: Date.now(),
      payload: message,
      created_at: new Date(),
      userId,
      read: false,
      user: {
        username: user.username,
        avatar: user.avatar,
      },
    };

    setMessages((prev) => [...prev, newMessage]);

    // channel에 실제 메시지 보내기
    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: { ...newMessage, chatRoomId },
    });

    // message db에 저장하기
    await saveMessage(message, chatRoomId);

    setMessage("");
  };

  useEffect(() => {
    // supabase 클라이언트 생성하기
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_API_KEY!
    );

    // supabase channel(room) 생성하기
    // 채널 생성 시 고유한 아이디 필요 -> prisma chatRoom model id
    channel.current = client.channel(`room-${chatRoomId}`);
    // 이벤트 이름으로 필터링
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prev) => [...prev, payload.payload]);
      })
      .subscribe();

    // clean up
    return () => {
      channel.current?.unsubscribe();
    };
  }, []);

  return (
    <div className="p-5 flex flex-col gap-5 min-h-screen justify-end">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-2 items-start ${
            msg.userId === userId && "justify-end"
          }`}
        >
          {msg.userId === userId ? null : msg.user.avatar ? (
            <Image
              src={msg.user.avatar}
              alt={msg.user.username}
              width={32}
              height={32}
              className="rounded-full size-8 bg-white"
            />
          ) : (
            <UserIcon className="size-8 rounded-full bg-white text-black" />
          )}
          <div
            className={`flex flex-col gap-1 ${
              msg.userId === userId ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`${
                msg.userId === userId ? "bg-neutral-500" : "bg-orange-500"
              } p-2.5 max-w-72 rounded-md break-words inline-block`}
            >
              {msg.payload}
            </div>
            <div className="flex justify-between gap-2 items-center">
              <span className="text-sm">
                {formatToTimeAgo(msg.created_at.toString())}
              </span>
              <span className="text-sm">{!msg.read ? "안 " : ""}읽음</span>
            </div>
          </div>
        </div>
      ))}
      <form className="flex relative" onSubmit={onSubmit}>
        <input
          required
          className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 
          ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
          type="text"
          name="message"
          value={message}
          onChange={onChange}
          placeholder="Write a message..."
          autoComplete="off"
        />
        <button className="absolute right-0">
          <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
        </button>
      </form>
    </div>
  );
}
