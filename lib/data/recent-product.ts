import { unstable_cache as nextCache } from "next/cache";
import db from "../db";

export async function createRecent(productId: number, userId: number) {
  await db.recent.upsert({
    where: { id: { productId, userId } },
    update: { updated_at: new Date() }, // 기존 데이터가 있으면 updatedAt 갱신
    create: { productId, userId }, // 없으면 새로 생성
  });
}

// 60초 revalidate
export function cacheCreateRecent(productId: number, userId: number) {
  const cachedOperation = nextCache(
    createRecent,
    [`product-recent-${productId}`],
    {
      tags: [`#product-recent-${productId}`],
      revalidate: 60,
    }
  );

  return cachedOperation(productId, userId);
}
