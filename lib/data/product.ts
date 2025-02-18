import { unstable_cache as nextCache } from "next/cache";
import db from "../db";
import { Prisma } from "@prisma/client";

export async function getProduct(id: number) {
  console.log(id + " product");
  const product = await db.product.findUnique({
    where: { id },
    // 제품 등록한 사용자 정보 일부도 가져오기
    include: { user: { select: { username: true, avatar: true } } },
  });

  return product;
}

export const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["#product-detail", "#product"],
});

export type Product = Prisma.ProductGetPayload<{
  include: { user: { select: { username: true; avatar: true } } };
}>;
