import ChatsList from "@/components/chats-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache } from "next/cache";

export const dynamic = "force-dynamic";

const getCachedChats = nextCache(getChats, ["chat-room-list"], {
  tags: ["chat-room-list"],
  revalidate: 60,
});

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
  });

  return chats;
}

export type ChatsType = Prisma.PromiseReturnType<typeof getChats>;

export default async function Chat() {
  const session = await getSession();
  const initialChats = await getCachedChats(session.id!);

  return (
    <div className="p-5 flex flex-col">
      <ChatsList initialChats={initialChats} userId={session.id!} />
    </div>
  );
}
