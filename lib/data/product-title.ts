import { unstable_cache as nextCache } from "next/cache";
import db from "../db";

export async function getProductTitle(id: number) {
  const product = await db.product.findUnique({
    where: { id },
    select: { title: true },
  });

  return product;
}

export const getCachedProductTitle = nextCache(
  getProductTitle,
  ["product-title"],
  {
    tags: ["product-title", "#product"],
  }
);
