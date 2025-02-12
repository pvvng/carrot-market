import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    // 가져올 페이지/상품 개수
    take: 1,
    // 최신순 정렬(내림차순)
    orderBy: {
      created_at: "desc",
    },
  });

  return products;
}

// db 데이터 타입
export type initialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

// 페이지 실행시에는 최초 제품 페이지만 불러오기
export default async function Products() {
  const initialProducts = await getInitialProducts();

  return (
    <div>
      <ProductList initialProducts={initialProducts} />
    </div>
  );
}
