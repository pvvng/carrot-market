import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  unstable_cache as nextCache,
  revalidatePath,
  revalidateTag,
} from "next/cache";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getIsOwner(userId: number) {
  const session = await getSession();

  if (session.id) {
    return session.id == userId;
  }

  return false;
}

async function getProduct(id: number) {
  console.log("product");
  const product = await db.product.findUnique({
    where: { id },
    // 제품 등록한 사용자 정보 일부도 가져오기
    include: { user: { select: { username: true, avatar: true } } },
  });

  return product;
}

const getCachedProduct = nextCache(
  getProduct,
  // unique key
  ["product-detail"],
  {
    // 굳이 unique하지 않아도 됨
    tags: ["product-detail", "#product"],
  }
);

async function getProductTitle(id: number) {
  console.log("title");
  const product = await db.product.findUnique({
    where: { id },
    select: { title: true },
  });

  return product;
}

const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
  tags: ["product-title", "#product"],
});

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const id = Number((await params).id);
  const product = await getCachedProductTitle(id);
  return {
    title: product?.title,
  };
}

export default async function ProductDetail({
  params,
}: ProductDetailPageProps) {
  // 올바르지 않은 상품 번호(문자열 등) 거르기 위해 Number 사용
  // Number는 문자형태 숫자는 숫자로 바꾸지만 그냥 문자열은 NaN 반환함
  const id = Number((await params).id);

  if (isNaN(id)) {
    return notFound();
  }

  const product = await getCachedProduct(id);

  // 잘못된 제품 id 검색시
  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);

  const revalidate = async () => {
    "use server";
    revalidateTag("#product");
  };

  return (
    <div>
      <div className="relative aspect-square">
        <Image src={`${product.photo}/public`} alt={product.title} fill />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 rounded-full overflow-hidden bg-white">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              alt={product.user.username}
              width={40}
              height={40}
              sizes="640"
              priority
              className="object-cover"
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5 h-80">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
        <form action={revalidate}>
          <button>revalidate</button>
        </form>
      </div>
      <div
        className="w-full max-w-screen-sm fixed bottom-0 p-5 bg-neutral-800 
      flex justify-between items-center
      rounded-tl-md rounded-tr-md"
      >
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}원
        </span>
        <div className="flex justify-center items-center gap-2">
          {isOwner && (
            <Link
              href={`/products/p/${id}/delete`}
              className="bg-red-500 p-5 rounded-md text-white font-semibold cursor-pointer"
            >
              삭제하기
            </Link>
          )}
          <Link
            className="bg-orange-500 p-5 rounded-md text-white font-semibold"
            href={``}
          >
            채팅하기
          </Link>
        </div>
      </div>
    </div>
  );
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await db.product.findMany({ select: { id: true } });
  return products.map((product) => ({
    id: product.id + "",
  }));
}
