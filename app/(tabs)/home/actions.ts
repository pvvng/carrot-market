"use server";

import { PAGE_DATA_COUNT } from "@/lib/constants";
import db from "@/lib/db";

export async function getMoreProducts(page: number) {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
      sold_out: true,
    },
    // 현재 페이지 * 스킵할 개수 => 이전 페이지까지 받은 상품 데이터의 개수
    skip: page * PAGE_DATA_COUNT,
    // 이번에 가져올 데이터 개수
    take: PAGE_DATA_COUNT,
    orderBy: [
      { sold_out: "asc" }, // false(0) → true(1) 순서로 정렬
      { created_at: "desc" }, // 최신순 정렬
    ],
  });

  return products;
}
