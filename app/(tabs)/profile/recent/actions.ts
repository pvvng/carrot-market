"use server";

import { PAGE_DATA_COUNT } from "@/lib/constants";
import db from "@/lib/db";
import getSession from "@/lib/session";

export async function getMoreRecentProducts(page: number) {
  const session = await getSession();

  const recents = await db.recent.findMany({
    where: { userId: session.id! },
    include: {
      product: {
        select: {
          title: true,
          price: true,
          created_at: true,
          photo: true,
          id: true,
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
    orderBy: [{ updated_at: "desc" }],
  });

  return recents;
}
