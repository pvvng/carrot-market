import CloseButton from "@/components/close-button";
import ModalBackground from "@/components/modal-background";
import ProductModal from "@/components/product-delete-modal";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";

interface ProductDeleteProps {
  params: Promise<{ id: string }>;
}

export default async function DeleteProduct({ params }: ProductDeleteProps) {
  const id = (await params).id;
  const userId = (await getSession()).id;

  if (isNaN(Number(id))) {
    return notFound();
  }

  const product = await db.product.findUnique({
    where: { id: Number(id) },
    select: { title: true, id: true, userId: true },
  });

  if (!product) {
    return notFound();
  }

  if (!userId || userId !== product.userId) {
    return notFound();
  }

  return (
    <div className="fixed w-full h-full left-0 top-0 z-50 flex justify-center items-center">
      <CloseButton />
      <ModalBackground />
      <ProductModal title={product.title} id={product.id} />
    </div>
  );
}
