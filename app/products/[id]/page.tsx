async function getProduct() {
  await new Promise((res) => setTimeout(res, 1000000));
}

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetail({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  const product = await getProduct();

  return <span>product detail {id}</span>;
}
