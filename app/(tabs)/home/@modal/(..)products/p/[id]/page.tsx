import CloseButton from "@/components/close-button";
import ModalBackground from "@/components/modal-background";
import ModalScrollBreak from "@/components/product-modal";
import { getCachedProduct } from "@/lib/data/product";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { PhotoIcon } from "@heroicons/react/16/solid";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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

  return (
    <div className="fixed w-full h-full left-0 top-0 z-50 flex justify-center items-center overflow-hidden">
      <ModalScrollBreak />
      <ModalBackground />
      <CloseButton />
      <div className="bg-neutral-900 aspect-square w-full max-w-screen-sm rounded-md overflow-auto p-5 *:text-white">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={`${product.photo}/public`}
            alt={product.title}
            fill
            className="object-cover rounded-md"
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
              <Link href={``}>채팅하기</Link>
            )}
          </div>
        </div>
        <div className="p-5">
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}
