import ChatMessagesList from "@/components/chat-messages-list";
import { getCachedUser } from "@/lib/data/user";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

interface ChatRoomProps {
  params: Promise<{ id: string }>;
}

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: { id },
    include: {
      users: {
        select: { id: true },
      },
    },
  });

  return room;
}

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

async function getMessages(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: { chatRoomId },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      read: true,
      user: { select: { avatar: true, username: true } },
    },
  });

  return messages;
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

  const initialMessages = await getMessages(id);

  return (
    <ChatMessagesList
      initialMessages={initialMessages}
      userId={session.id!}
      user={user}
      chatRoomId={id}
    />
  );
}
