import db from "@/lib/db";
import getSession from "@/lib/session";
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

  if (room) {
    const session = await getSession();
    const isRoomUser = room.users.find((user) => user.id === session.id);

    if (!isRoomUser) {
      return null;
    }
  }

  return room;
}

export default async function ChatRoom({ params }: ChatRoomProps) {
  const id = (await params).id;
  const room = await getRoom(id);

  if (!room) {
    return notFound();
  }

  console.log(room);

  return <div>{id}</div>;
}
