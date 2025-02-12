"use server";

import db from "@/lib/db";

export async function getMoreProducts(page: number) {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    // 스킵할 개수
    skip: 1,
    // 가져올 개수
    take: 1,
    orderBy: { created_at: "desc" },
  });

  return products;
}
