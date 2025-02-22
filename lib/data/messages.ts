import { Prisma } from "@prisma/client";
import db from "../db";

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

/** chat room msg 불러오기 */
export async function getMessages(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: { chatRoomId },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      read: {
        select: { userId: true },
      },
      user: {
        select: { avatar: true, username: true },
      },
    },
  });

  return messages;
}
