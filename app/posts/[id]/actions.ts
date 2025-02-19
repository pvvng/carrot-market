"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";

export const likePost = async (postId: number) => {
  await new Promise((res) => setTimeout(res, 3000));

  const userId = (await getSession()).id!;

  try {
    await db.like.create({
      data: { postId, userId },
    });

    revalidateTag(`#post-like-status-${postId}`);
  } catch (e) {}
};

export const dislikePost = async (postId: number) => {
  await new Promise((res) => setTimeout(res, 3000));

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
