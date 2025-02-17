import ProductList from "@/components/product-list";
import { PAGE_DATA_COUNT } from "@/lib/constants";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";

/** 강제로 Dynamic-Rendering(사용자가 방문할 때마다 새롭게 html generate) 시키기
 *
 * static -> dynamic page로 변경
 */
// export const dynamic = "force-dynamic";

/** Cache의 revalidate와 유사한 기능
 *
 * 이전 요청으로부터 60초가 지난 다음에 페이지를 새롭게 리렌더링한다
 */
export const revalidate = 60;

export const metadata = {
  title: "home",
};

const getCachedProducts = nextCache(getInitialProducts, ["home-products"]);

async function getInitialProducts() {
  console.log("hit");
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    // 가져올 페이지/상품 개수
    // take: PAGE_DATA_COUNT,
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
  const revalidate = async () => {
    "use server";
    revalidatePath("/home");
  };

  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <form action={revalidate}>
        <button>revalidate</button>
      </form>
      <a
        href="/products/add"
        className="bg-orange-500 text-white flex items-center justify-center rounded-full size-16 
        fixed bottom-24 right-8 transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </a>
    </div>
  );
}
