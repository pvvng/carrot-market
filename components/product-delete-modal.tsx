"use client";

import { deleteProduct } from "@/app/products/[id]/actions";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductModal({
  title,
  id,
}: {
  title: string;
  id: number;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onCloseClick = () => {
    router.back();
  };

  const onDeleteClick = async () => {
    setIsLoading(true);
    await deleteProduct(id);
    setIsLoading(false);
    alert(`${title} 제품을 삭제했습니다.`);
    redirect("/home");
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="text-center bg-white rounded-md p-5 *:text-black">
      <div className="flex flex-col gap-1">
        <p className="text-xl font-semibold">
          삭제한 제품은 복구할 수 없습니다.
        </p>
        <p>
          <span className="font-semibold">{title}</span> 제품을
          삭제하시겠습니까?
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-5">
        {/* product-delete-button */}
        <button
          onClick={onDeleteClick}
          disabled={isLoading}
          className="bg-red-500 p-3 rounded-md text-white font-semibold mt-2 disabled:bg-neutral-700"
        >
          예
        </button>
        <span
          onClick={onCloseClick}
          className="bg-black p-3 rounded-md text-white font-semibold mt-2 cursor-pointer"
        >
          아니요
        </span>
      </div>
    </div>
  );
}
