"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export const likePost = async (postId: number) => {
  const userId = (await getSession()).id!;

  try {
    await db.like.create({
      data: { postId, userId },
    });

    revalidateTag(`#post-like-status-${postId}`);
  } catch (e) {}
};

export const dislikePost = async (postId: number) => {
  const userId = (await getSession()).id!;

  try {
    await db.like.delete({
      where: {
        id: { postId, userId },
      },
    });

    revalidateTag(`#post-like-status-${postId}`);
  } catch (e) {}
};

const payloadSchema = z
  .string()
  .trim()
  .min(0, "댓글 내용을 확인하지 못했습니다.")
  .max(100, "댓글은 최대 100자까지 입력 가능합니다.");
const postIdSchema = z.coerce
  .number()
  .int("존재하지 않는 게시물입니다.")
  .positive("존재하지 않는 게시물입니다.");

export const addComment = async (postId: number, payload: string) => {
  await new Promise((res) => setTimeout(res, 3000));

  const userId = (await getSession()).id!;

  const payloadResult = payloadSchema.safeParse(payload);
  const postIdResult = postIdSchema.safeParse(postId);

  if (!payloadResult.success) {
    return payloadResult.error.flatten().formErrors;
  }

  if (!postIdResult.success) {
    return postIdResult.error.flatten().formErrors;
  }

  const postExist = await db.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });

  if (!Boolean(postExist)) {
    return ["존재하지 않는 게시물입니다."];
  }

  await db.comment.create({
    data: {
      payload: payloadResult.data,
      postId: postIdResult.data,
      userId,
    },
  });

  revalidateTag(`#post-comments-${postId}`);
};
