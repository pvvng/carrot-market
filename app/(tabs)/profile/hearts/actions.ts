"use server";

import { PAGE_DATA_COUNT } from "@/lib/constants";
import db from "@/lib/db";
import getSession from "@/lib/session";

export async function getMoreHeartedProducts(page: number) {
  const session = await getSession();

  const hearts = await db.heart.findMany({
    where: { userId: session.id! },
    include: {
      product: {
        select: {
          id: true,
          photo: true,
          price: true,
          title: true,
          created_at: true,
          sold_out: true,
          _count: {
            select: { heart: true },
          },
        },
      },
    },
    // 현재 페이지 * 스킵할 개수 => 이전 페이지까지 받은 상품 데이터의 개수
    skip: page * PAGE_DATA_COUNT,
    // 이번에 가져올 데이터 개수
    take: PAGE_DATA_COUNT,
    orderBy: [{ created_at: "desc" }],
  });

  return hearts;
}
