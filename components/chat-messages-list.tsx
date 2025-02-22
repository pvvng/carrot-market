"use client";

import { saveMessage } from "@/app/chats/[id]/actions";
import { InitialChatMessages } from "@/lib/data/messages";
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
  // 메시지 Input ref
  const messageRef = useRef<HTMLInputElement>(null);
  // 온라인인 유저 저장하는 ref
  const onlineUser = useRef([String(userId)]);
  // 채널 ref
  const channel = useRef<RealtimeChannel>(undefined);

  const scrollToMessageInput = () => {
    messageRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const message = messageRef.current?.value;

    if (!message) {
      alert("메시지 확인 실패");
      return;
    }

    // ui 표시용 가짜 메시지
    const tempMessage = {
      id: Date.now(),
      payload: message,
      created_at: new Date(),
      userId,
      user: {
        avatar: user.avatar,
        username: user.username,
      },
      // 현재 보내는 메시지를 읽는 중인 사용자 추가하기
      read: onlineUser.current.map((id) => ({ userId: Number(id) })),
    };

    // 새로운 메시지를 즉시 UI에 반영
    setMessages((prev) => [...prev, tempMessage]);

    // channel에 실제 메시지 보내기 (상태 업데이트 후)
    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: { ...tempMessage, chatRoomId },
    });

    if (messageRef.current) {
      messageRef.current.value = "";
    }

    // db에 저장
    await saveMessage(message, chatRoomId);
  };

  useEffect(() => {
    // input 위치까지 스크롤
    scrollToMessageInput();

    // supabase 클라이언트 생성하기
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_API_KEY!
    );

    channel.current = client.channel(`room-${chatRoomId}`, {
      // presense key를 userId로 설정하기
      config: {
        presence: {
          key: String(userId),
        },
      },
    });

    // 유저 상태
    const userStatus = {
      user: userId,
      online_at: new Date().toISOString(),
    };

    channel.current
      .on("presence", { event: "sync" }, () => {
        // online인 사용자의 정보 (userStatus) 담는 객체
        const newState = channel.current?.presenceState();
        const nowOnlineUser = Object.keys(newState!);
        // 접속중인 user의 Id 배열 ref에 저장하기
        onlineUser.current = nowOnlineUser;
        if (nowOnlineUser.length > 1) {
          // 이전 메시지들 접속중인 유저에 대해 읽음 처리
          setMessages((prev) =>
            prev.map((msg) => {
              const { read, ...rest } = msg;
              read.push(
                ...nowOnlineUser.map((user) => ({ userId: Number(user) }))
              );

              return { ...rest, read };
            })
          );
        }
      })
      .on("broadcast", { event: "message" }, async (payload) => {
        // 메시지 이벤트 수신 (송신자가 메시지 입력시 수신자 단에서 실행)
        // 받은 메시지 ui에 추가하기
        setMessages((prev) => [...prev, payload.payload]);
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") {
          return;
        }
        // 사용자 상태 정보 (userStatus) 모든 접속중인 사용자에게 뿌리기
        await channel.current?.track(userStatus);
      });

    // clean up
    return () => {
      channel.current?.unsubscribe();
    };
  }, []);

  // 메시지 변경될때마다 input까지 스크롤
  useEffect(() => {
    scrollToMessageInput();
  }, [messages]);

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
            <div className="flex justify-between gap-2 items-center *:text-sm">
              {msg.userId === userId && (
                <span>
                  {msg.read.filter((v) => v.userId !== userId).length === 0
                    ? "안 "
                    : ""}
                  읽음
                </span>
              )}
              <span>{formatToTimeAgo(msg.created_at.toString())}</span>
            </div>
          </div>
        </div>
      ))}
      <form className="flex relative" onSubmit={onSubmit}>
        <input
          ref={messageRef}
          required
          className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 
          ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
          type="text"
          name="message"
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
