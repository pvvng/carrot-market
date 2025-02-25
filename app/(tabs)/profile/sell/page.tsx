import SellingProductList from "@/components/selling-product-list";
import { PAGE_DATA_COUNT } from "@/lib/constants";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache } from "next/cache";

const getCachedSellingProducts = nextCache(
  getSellingProducts,
  ["selling-products"],
  {
    tags: ["#selling-products"],
  }
);

async function getSellingProducts(userId: number) {
  const sellingProducts = await db.product.findMany({
    where: { userId },
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
    // 가져올 페이지/상품 개수
    take: PAGE_DATA_COUNT,
    // 최신순 정렬(내림차순)
    orderBy: [
      { sold_out: "asc" }, // false(0) → true(1) 순서로 정렬
      { created_at: "desc" }, // 최신순 정렬
    ],
  });

  return sellingProducts;
}

export type sellingInitialProducts = Prisma.PromiseReturnType<
  typeof getSellingProducts
>;

export default async function Sell() {
  const session = await getSession();
  const initialProducts = await getCachedSellingProducts(session.id!);

  return <SellingProductList initialProducts={initialProducts} />;
}
