import { getCachedProduct } from "@/lib/data/product";
import { getCachedProductTitle } from "@/lib/data/product-title";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

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

  const createChatRoom = async () => {
    "use server";
    const session = await getSession();
    const room = await db.chatRoom.create({
      data: {
        users: {
          connect: [
            // seller id
            { id: product.userId },
            // buyer id
            { id: session.id! },
          ],
        },
        productId: Number(id),
      },
      select: { id: true },
    });

    redirect(`/chat/${room.id}`);
  };

  return (
    <div>
      <div className="relative aspect-square">
        {product.sold_out && (
          <div className="absolute inset-0 flex justify-center items-center font-semibold text-2xl text-white">
            판매 완료
          </div>
        )}
        <Image
          src={`${product.photo}/public`}
          alt={product.title}
          fill
          className={`object-cover rounded-md ${
            product.sold_out && "opacity-50"
          }`}
        />
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
          {isOwner ? (
            <>
              <Link
                className="bg-orange-500 p-5 rounded-md text-white font-semibold"
                href={`/products/p/${id}/edit`}
              >
                편집하기
              </Link>
              <Link
                href={`/products/p/${id}/delete`}
                scroll={false}
                className="bg-red-500 p-5 rounded-md text-white font-semibold cursor-pointer"
              >
                삭제하기
              </Link>
            </>
          ) : (
            <form action={createChatRoom}>
              <button className="bg-orange-500 p-5 rounded-md text-white font-semibold">
                채팅하기
              </button>
            </form>
          )}
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
