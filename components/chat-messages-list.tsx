"use client";

import {
  markAsReadOneMessage,
  MessageType,
  saveMessage,
} from "@/app/chats/[id]/actions";
import { InitialChatMessages } from "@/lib/data/messages";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon, UserIcon } from "@heroicons/react/24/solid";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import Image from "next/image";
import {
  startTransition,
  useEffect,
  useOptimistic,
  useRef,
  useState,
} from "react";

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
  const channel = useRef<RealtimeChannel>(undefined);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // message db에 "먼저" 저장하기
    const newMessage: MessageType = await saveMessage(message, chatRoomId);

    // **새로운 메시지를 즉시 상태에 반영**
    setMessages((prev) => [...prev, newMessage]);

    // channel에 실제 메시지 보내기 (상태 업데이트 후)
    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: { ...newMessage, chatRoomId },
    });

    setMessage("");
  };

  useEffect(() => {
    // supabase 클라이언트 생성하기
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_API_KEY!
    );

    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: "message" }, async (payload) => {
        // 메시지 이벤트 수신 (송신자가 메시지 입력시 수신자 단에서 실행)

        // 받은 메시지 ui에 추가하기
        setMessages((prev) => [...prev, payload.payload]);

        // channel에 읽음 이벤트 보내기
        channel.current?.send({
          type: "broadcast",
          event: "read",
          payload: { messageId: payload.payload.id, userId },
        });
      })
      .on("broadcast", { event: "read" }, async (payload) => {
        // 읽음 이벤트 수신 (수신자에게 메시지 도착할때 송신자에게서 실행)
        // 여기서 실행되어야 하는건 읽음 -> 안읽음으로 변경하는거
        const { messageId, userId } = payload.payload;

        const updateReadStatus = (attempt = 0) => {
          setMessages((prevMessages) => {
            const nowMsg = prevMessages.find((msg) => msg.id === messageId);

            // Q. 왜 이지랄 하는가?
            // setState가 비동기적으로 동작해서 onSubmit에서 newMsg 추가하는것보다 read 이벤트가 도착하는게 더 빨라서 read 객체 추가가 안된다
            // 그래서 기다림
            if (!nowMsg && attempt < 5) {
              // 메시지가 아직 추가되지 않았다면 100ms 후 다시 시도 (최대 5번)
              setTimeout(() => updateReadStatus(attempt + 1), 100);
              return prevMessages;
            }

            // 메시지가 존재하면 read 업데이트
            return prevMessages.map((msg) =>
              msg.id === messageId
                ? { ...msg, read: [...msg.read, { userId }] }
                : msg
            );
          });
        };

        updateReadStatus();

        // db 변경하기
        await markAsReadOneMessage(messageId, userId);
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
