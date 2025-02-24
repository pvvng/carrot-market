"use server";

import { unReadMessagesType } from "@/lib/data/un-read-messages";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";

/** 메시지 db에 저장하기 */
export async function saveMessage(payload: string, chatRoomId: string) {
  const session = await getSession();
  const message = await db.message.create({
    data: {
      payload,
      chatRoomId,
      userId: session.id!,
      // 메시지를 보낸 사용자는 메시지 읽음 처리하기
      read: { create: { userId: session.id! } },
    },
    select: { id: true },
  });

  return message;
}

export type MessageType = Prisma.PromiseReturnType<typeof saveMessage>;

/** 읽지 않은 메시지 인자로 받아서 읽은 상태 추가 */
export async function markAsReadMessages(
  unReadMessages: unReadMessagesType,
  userId: number
) {
  // 읽음 상태 추가
  await db.messageRead.createMany({
    data: unReadMessages.map((msg) => ({
      messageId: msg.id,
      userId: userId,
    })),
  });
}

/** 단일 메시지 읽음 상태로 변경 */
export async function markAsReadOneMessage(messageId: number, userId: number) {
  await db.messageRead.create({
    data: { messageId, userId },
  });
}

/** 상품 판매 상태 변경 */
export async function changeProductState(
  productId: number,
  buyerId: number,
  sold_out: boolean
) {
  if (typeof sold_out !== "boolean") {
    return;
  }

  await db.product.update({
    where: { id: productId },
    data: { sold_out, buyerId },
  });

  revalidateTag("#home");
  revalidateTag("#selling-products");
  revalidatePath(`/products/p/${productId}`);
}
