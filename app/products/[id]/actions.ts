"use server";

import db from "@/lib/db";

// 상품 삭제하는 함수
export async function deleteProduct(id: number) {
  await db.product.delete({
    where: { id },
  });
}
