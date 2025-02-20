"use client";

import { InitialChatMessages } from "@/app/chats/[id]/page";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon, UserIcon } from "@heroicons/react/24/solid";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ChatMessageListProps {
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
}

export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
}: ChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMessage = {
      id: Date.now(),
      payload: message,
      created_at: new Date(),
      userId,
      user: {
        username: "string",
        avatar: "string",
      },
    };
    setMessages((prev) => [...prev, newMessage]);
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
    const channel = client.channel(`room-${chatRoomId}`);

    channel.on("broadcast", { event: "messgae" }, (payload) => {
      console.log(payload);
    });
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
              msg.userId === userId && "items-end"
            }`}
          >
            <span
              className={`${
                msg.userId === userId ? "bg-neutral-500" : "bg-orange-500"
              } p-2.5 rounded-md`}
            >
              {msg.payload}
            </span>
            <span className="text-sm">
              {formatToTimeAgo(msg.created_at.toString())}
            </span>
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
        />
        <button className="absolute right-0">
          <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
        </button>
      </form>
    </div>
  );
}
