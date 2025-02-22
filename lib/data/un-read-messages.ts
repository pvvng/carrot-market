import { Prisma } from "@prisma/client";
import db from "../db";

/** 특정 chat room에서 사용자가 읽지 않은 메시지 반환 */
export async function getUnReadMessage(chatRoomId: string, userId: number) {
  const unReadMessages = await db.message.findMany({
    where: {
      chatRoomId,
      // userId가 없는 read 데이터만 필터링
      read: { none: { userId } },
    },
    select: {
      id: true,
      chatRoomId: true,
      read: { select: { userId: true } },
    },
  });

  return unReadMessages;
}

/** getUnReadMessage 반환 데이터 타입 */
export type unReadMessagesType = Prisma.PromiseReturnType<
  typeof getUnReadMessage
>;
