import ChatMessagesList from "@/components/chat-messages-list";
import { getUnReadMessage } from "@/lib/data/un-read-messages";
import { getCachedUser } from "@/lib/data/user";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";
import { markAsReadMessages } from "./actions";
import { getMessages } from "@/lib/data/messages";

interface ChatRoomProps {
  params: Promise<{ id: string }>;
}

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: { id },
    include: {
      users: { select: { id: true } },
      product: {
        select: {
          id: true,
          photo: true,
          title: true,
          price: true,
          sold_out: true,
          userId: true,
        },
      },
    },
  });

  return room;
}

export default async function ChatRoom({ params }: ChatRoomProps) {
  const id = (await params).id;
  const room = await getRoom(id);

  if (!room) {
    return notFound();
  }

  const session = await getSession();
  const isRoomUser = room.users.find((user) => user.id === session.id);

  if (!isRoomUser) {
    return notFound();
  }

  const user = await getCachedUser(session.id!);

  if (!user) {
    return notFound();
  }

  // 안읽은 메시지 불러오기
  const unReadMessages = await getUnReadMessage(id, session.id!);
  // 안읽은 메시지 읽음 처리
  if (unReadMessages.length > 0) {
    await markAsReadMessages(unReadMessages, session.id!);
  }

  // 메시지 초깃값 불러오기
  const initialMessages = await getMessages(id);

  const product = room.product;

  return (
    <ChatMessagesList
      product={product}
      initialMessages={initialMessages}
      userId={session.id!}
      user={user}
      chatRoomId={id}
    />
  );
}
