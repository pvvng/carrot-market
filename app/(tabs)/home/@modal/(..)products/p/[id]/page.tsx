import CloseButton from "@/components/close-button";
import ModalBackground from "@/components/modal-background";
import ModalScrollBreak from "@/components/product-modal";
import { getCachedProduct } from "@/lib/data/product";
import db from "@/lib/db";
import getSession from "@/lib/session";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import { getCachedHeartStatus } from "@/lib/data/product-heart-status";
import HeartButton from "@/components/heart-button";
import { cacheCreateRecent } from "@/lib/data/recent-product";

interface ProductDetailModalProps {
  params: Promise<{ id: string }>;
}

export default async function Modal({ params }: ProductDetailModalProps) {
  const id = (await params).id;

  if (isNaN(Number(id))) {
    return notFound();
  }

  const product = await getCachedProduct(Number(id));

  // 잘못된 제품 id 검색시
  if (!product) {
    return notFound();
  }

  const session = await getSession();
  const { isLiked, likeCount } = await getCachedHeartStatus(
    product.id,
    session.id!
  );
  await cacheCreateRecent(product.id, session.id!);

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
    <div className="fixed w-full h-full left-0 top-0 z-50 flex justify-center items-center overflow-hidden">
      <ModalScrollBreak />
      <ModalBackground />
      <CloseButton />
      <div className="bg-neutral-900 aspect-square w-full max-w-screen-sm rounded-md overflow-auto p-5 *:text-white">
        <div className="aspect-square relative overflow-hidden">
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
        <div className="w-full flex flex-col gap-2 text-center">
          <div className="p-5 flex justify-between items-center border-b border-neutral-700">
            <div className="flex items-center gap-3">
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
              <h3>{product.user.username}</h3>
            </div>
            {session.id === product.userId ? (
              <div className="flex gap-2">
                <Link href={`/products/p/${id}/edit`}>편집하기</Link>
                <Link
                  className="text-red-500"
                  href={`/products/p/${id}/delete`}
                >
                  삭제하기
                </Link>
              </div>
            ) : (
              <form action={createChatRoom}>
                <button className="text-orange-500">채팅하기</button>
              </form>
            )}
          </div>
        </div>
        <div className="p-5">
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <p className="mb-2">{product.description}</p>
          <HeartButton
            isLiked={isLiked}
            likeCount={likeCount}
            productId={product.id}
          />
        </div>
      </div>
    </div>
  );
}
