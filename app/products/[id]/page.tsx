import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function getProduct(id: number) {
  // await new Promise((res) => setTimeout(res, 10000));
  const product = await db.product.findUnique({
    where: { id },
    // 제품 등록한 사용자 정보 일부도 가져오기
    include: { user: { select: { username: true, avatar: true } } },
  });

  return product;
}

async function getIsOwner(userId: number) {
  const session = await getSession();

  if (session.id) {
    return session.id == userId;
  }

  return false;
}

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
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

  const product = await getProduct(id);

  // 잘못된 제품 id 검색시
  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);

  // 상품 삭제하는 함수
  const deleteProduct = async () => {
    "use server";
    await db.product.delete({
      where: { id },
    });

    redirect("/products");
  };

  return (
    <div>
      <div className="relative aspect-square">
        <Image src={product.photo} alt={product.title} fill />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              alt={product.user.username}
              width={40}
              height={40}
              sizes="640"
              priority
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
      </div>
      <div
        className="w-full max-w-screen-sm fixed bottom-0 p-5 bg-neutral-800 
      flex justify-between items-center
      rounded-tl-md rounded-tr-md"
      >
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}원
        </span>
        {isOwner && (
          <form action={deleteProduct}>
            <button className="bg-red-500 p-5 rounded-md text-white font-semibold">
              삭제하기
            </button>
          </form>
        )}
        <Link
          className="bg-orange-500 p-5 rounded-md text-white font-semibold"
          href={``}
        >
          채팅하기
        </Link>
      </div>
    </div>
  );
}
