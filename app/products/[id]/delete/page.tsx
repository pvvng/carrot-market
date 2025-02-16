interface ProductDeleteProps {
  params: Promise<{ id: string }>;
}

export default async function DeleteProduct({ params }: ProductDeleteProps) {
  const id = (await params).id;
  console.log(id);
  return <div>delete</div>;
}
