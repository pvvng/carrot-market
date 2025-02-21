import ChatsList from "@/components/chats-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";

async function getChats(userId: number) {
  const chats = await db.chatRoom.findMany({
    where: { users: { some: { id: userId } } },
    include: {
      users: { select: { avatar: true, username: true, id: true } },
      messages: true,
    },
  });

  return chats;
}

export type ChatsType = Prisma.PromiseReturnType<typeof getChats>;

export default async function Chat() {
  const session = await getSession();
  const initialChats = await getChats(session.id!);

  return (
    <div className="p-5">
      <ChatsList initialChats={initialChats} userId={session.id!} />
    </div>
  );
}
