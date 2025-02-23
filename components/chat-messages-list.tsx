"use client";

import { ProductType } from "@/app/(tabs)/chat/page";
import { changeProductState, saveMessage } from "@/app/chat/[id]/actions";
import { InitialChatMessages } from "@/lib/data/messages";
import { UserType } from "@/lib/data/user";
import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import {
  ArrowUpCircleIcon,
  MinusCircleIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ChatMessageListProps {
  product: ProductType;
  roomUser: {
    id: number;
  }[];
  initialMessages: InitialChatMessages;
  userId: number;
  user: UserType;
  chatRoomId: string;
}

export default function ChatMessagesList({
  product,
  initialMessages,
  userId,
  user,
  chatRoomId,
  roomUser,
}: ChatMessageListProps) {
  // 메시지 state
  const [messages, setMessages] = useState(initialMessages);
  const [modal, setModal] = useState(false);
  // 메시지 Input ref
  const messageRef = useRef<HTMLInputElement>(null);
  // 온라인인 유저 저장하는 ref
  const onlineUser = useRef([String(userId)]);
  // 채널 ref
  const channel = useRef<RealtimeChannel>(undefined);

  const scrollToMessageInput = () => {
    messageRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const openModal = () => {
    setModal((pre) => !pre);
  };

  const onPurchase = async () => {
    const purchase = confirm(`${product.title} 제품을 구매하시겠습니까?`);

    if (!purchase) {
      return;
    }

    changeProductState(product.id, userId!, true);

    await sendMessage(
      `${user.username}님께서 ${product.title} 을 구매하였습니다.`
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const message = messageRef.current?.value;

    if (!message) {
      alert("메시지 확인 실패");
      return;
    }

    if (messageRef.current) {
      messageRef.current.value = "";
    }

    await sendMessage(message);
  };

  const sendMessage = async (message: string) => {
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
      <div className="flex flex-col gap-5">
        <div className="aspect-square relative rounded-md overflow-hidden">
          {product.sold_out && (
            <div className="absolute inset-0 flex justify-center items-center font-semibold text-xl">
              판매 완료된 상품입니다.
            </div>
          )}
          <Image
            src={`${product.photo}/public`}
            alt={product.title}
            fill
            priority
            className={`object-cover ${product.sold_out && "opacity-50"}`}
          />
        </div>
        <div className="flex gap-2 justify-around items-center *:font-semibold pb-5 border-b-2 border-neutral-600">
          <span>{product.title}</span>
          <span>{formatToWon(product.price)} 원</span>
          <span className="text-orange-500">
            {product.sold_out ? "판매 완료" : "판매 중"}
          </span>
        </div>
      </div>
      {messages.length === 0 && (
        <div className="py-8 text-center">채팅을 시작해보세요!</div>
      )}
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
              {msg.userId === userId &&
                msg.read.filter((v) => v.userId !== userId).length === 0 && (
                  <span className="text-orange-500 font-semibold">
                    읽지 않음
                  </span>
                )}
              <span>{formatToTimeAgo(msg.created_at.toString())}</span>
            </div>
          </div>
        </div>
      ))}
      <form className="flex relative items-center gap-2" onSubmit={onSubmit}>
        <span
          className="cursor-pointer hover:text-neutral-400 transition-colors"
          onClick={openModal}
        >
          {modal ? (
            <MinusCircleIcon className="size-10" />
          ) : (
            <PlusCircleIcon className="size-10" />
          )}
        </span>
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
      {modal && (
        <div className="relative rounded-md p-3 flex flex-col gap-2 bg-neutral-200">
          {product.buyerId &&
            roomUser.find(({ id }) => id === product.buyerId) && (
              <form>
                <button className="bg-orange-500 hover:bg-orange-300 transition-colors rounded-md font-semibold px-2 p-1">
                  리뷰 작성하기
                </button>
              </form>
            )}
          {userId !== product.userId && !product.sold_out && (
            <form action={onPurchase}>
              <button className="bg-orange-500 hover:bg-orange-300 transition-colors rounded-md font-semibold px-2 p-1">
                구매하기
              </button>
            </form>
          )}
          <form>
            <button className="bg-red-500 hover:bg-red-300 transition-colors rounded-md font-semibold px-2 p-1">
              상대방 차단하기
            </button>
          </form>
          <div className="absolute left-3 bottom-full w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-neutral-200" />
        </div>
      )}
    </div>
  );
}
