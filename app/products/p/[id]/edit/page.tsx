import ProductEditForm from "@/components/product-edit-form";
import { getCachedProduct, Product } from "@/lib/data/product";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";

interface ProductEditProps {
  params: Promise<{ id: string }>;
}

export default async function EditProduct({ params }: ProductEditProps) {
  const id = Number((await params).id);
  const userId = (await getSession()).id;

  if (isNaN(id)) {
    return notFound();
  }

  const product: Product | null = await getCachedProduct(Number(id));

  if (!product) {
    return notFound();
  }

  if (!userId || userId !== product.userId) {
    return notFound();
  }

  return <ProductEditForm {...product} />;
}
