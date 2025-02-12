import ListProduct from "@/components/list-product";
import db from "@/lib/db";

async function getProducts() {
  // await new Promise((res) => setTimeout(res, 3000));
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
  });

  return products;
}

export default async function Products() {
  const products = await getProducts();

  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
    </div>
  );
}
