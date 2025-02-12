"use client";

import { initialProducts } from "@/app/(tabs)/products/page";
import ListProduct from "./list-product";
import { useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/products/actions";

interface ProductListProps {
  initialProducts: initialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);

  const onLoadMoreClick = async () => {
    setIsLoading(true);
    const newProducts = await getMoreProducts(1);
    await new Promise((res) => setTimeout(res, 3000));
    setProducts((prevProducts) => [...prevProducts, ...newProducts]);
    setIsLoading(false);
  };

  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      <button
        className="text-sm font-semibold bg-orange-500 rounded-md text-white px-3 py-2 mx-auto
      hover:opacity-90 active:scale-95 disabled:bg-neutral-600"
        onClick={onLoadMoreClick}
        disabled={isLoading}
      >
        {isLoading ? "로딩 중" : "더 불러오기"}
      </button>
    </div>
  );
}
