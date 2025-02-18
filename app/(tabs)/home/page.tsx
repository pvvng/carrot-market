import ProductList from "@/components/product-list";
import { PAGE_DATA_COUNT } from "@/lib/constants";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";
import Link from "next/link";

// Code challenge
// 1. 캐싱 전략을 짜고 상품 업로드, 수정, 삭제할 때마다 revalidate하기
// 2. 상품 수정 페이지 만들기

export const dynamic = "force-dynamic";

export const metadata = {
  title: "home",
};

const getCachedProducts = nextCache(getInitialProducts, ["home-products"], {
  tags: ["#home", "#products"],
});

async function getInitialProducts() {
  console.log("home hit");
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    // 가져올 페이지/상품 개수
    take: PAGE_DATA_COUNT,
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
  const initialProducts = await getCachedProducts();
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <Link
        href="/products/add"
        className="bg-orange-500 text-white flex items-center justify-center rounded-full size-16 
        fixed bottom-24 right-8 transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
