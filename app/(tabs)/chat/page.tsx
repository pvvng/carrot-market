import ChatsList from "@/components/chats-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export type ChatsType = Prisma.PromiseReturnType<typeof getChats>;

export interface ProductType {
  id: number;
  userId: number;
  title: string;
  price: number;
  photo: string;
  sold_out: boolean;
  buyerId: number | null;
}

async function getChats(userId: number) {
  const chats = await db.chatRoom.findMany({
    where: { users: { some: { id: userId } } },
    select: {
      id: true,
      users: {
        select: { avatar: true, username: true, id: true },
      },
      messages: {
        select: {
          id: true,
          payload: true,
          created_at: true,
          userId: true,
          read: { select: { userId: true } },
        },
      },
    },
    orderBy: {
      created_at: "desc", // 최근 메시지를 받은 채팅방이 먼저 오도록 정렬
    },
  });

  return chats;
}

export default async function Chat() {
  const session = await getSession();
  const initialChats = await getChats(session.id!);

  return (
    <div className="p-5 flex flex-col pb-24">
      <ChatsList initialChats={initialChats} userId={session.id!} />
    </div>
  );
}
