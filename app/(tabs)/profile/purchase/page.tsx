import PurchasedProductList from "@/components/purchased-product-list";
import { PAGE_DATA_COUNT } from "@/lib/constants";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache } from "next/cache";

const getCachedPurchasedProducts = nextCache(
  purchasedProducts,
  ["purchased-products"],
  {
    tags: ["#purchased-products"],
  }
);

async function purchasedProducts(userId: number) {
  const purchasedProducts = await db.product.findMany({
    where: { buyerId: userId },
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

  return purchasedProducts;
}

export type purchasedInitialProducts = Prisma.PromiseReturnType<
  typeof purchasedProducts
>;

export default async function Purchase() {
  const session = await getSession();
  const initialProducts = await getCachedPurchasedProducts(session.id!);

  return <PurchasedProductList initialProducts={initialProducts} />;
}
