import { unstable_cache as nextCache } from "next/cache";
import db from "../db";

export function getCachedHeartStatus(productId: number, userId: number) {
  const cachedOperation = nextCache(
    getHeartStatus,
    [`#product-heart-status-${productId}`],
    {
      tags: [`#product-heart-status-${productId}`],
    }
  );

  return cachedOperation(productId, userId);
}

export async function getHeartStatus(productId: number, userId: number) {
  const isLiked = await db.heart.findUnique({
    where: { id: { userId, productId } },
  });

  const likeCount = await db.heart.count({ where: { productId } });

  return { isLiked: Boolean(isLiked), likeCount };
}
