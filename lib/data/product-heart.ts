"use server";

import { revalidateTag } from "next/cache";
import db from "../db";
import getSession from "../session";

export const likeProduct = async (productId: number) => {
  const userId = (await getSession()).id!;

  try {
    await db.heart.create({
      data: { productId, userId },
    });

    revalidateTag(`#product-heart-status-${productId}`);
  } catch (e) {}
};

export const dislikeProduct = async (productId: number) => {
  const userId = (await getSession()).id!;

  try {
    await db.heart.delete({
      where: {
        id: { productId, userId },
      },
    });

    revalidateTag(`#product-heart-status-${productId}`);
  } catch (e) {}
};
