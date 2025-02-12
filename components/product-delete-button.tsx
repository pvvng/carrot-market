"use client";

import { useState } from "react";
import ProductModal from "./product-delete-modal";

export default function ProductDeleteButton({ title }: { title: string }) {
  const [modalTrigger, setModalTrigger] = useState(false);

  const showModal = () => {
    setModalTrigger(true);
  };

  const closeModal = () => {
    setModalTrigger(false);
  };

  return (
    <>
      {modalTrigger && <ProductModal title={title} closeModal={closeModal} />}
      <span
        onClick={showModal}
        className="bg-red-500 p-5 rounded-md text-white font-semibold cursor-pointer"
      >
        삭제하기
      </span>
    </>
  );
}
