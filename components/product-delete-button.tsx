"use client";

import { useEffect, useState } from "react";
import ProductModal from "./product-delete-modal";

export default function ProductDeleteButton({
  title,
  id,
}: {
  title: string;
  id: number;
}) {
  const [modalTrigger, setModalTrigger] = useState(false);

  const showModal = () => setModalTrigger(true);
  const closeModal = () => setModalTrigger(false);

  // 모달 나타나면 스크롤 금지
  useEffect(() => {
    if (modalTrigger) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // cleanup 함수로 모달 닫힐 때 원래 상태로 복원
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalTrigger]);

  return (
    <>
      {modalTrigger && (
        <ProductModal title={title} id={id} closeModal={closeModal} />
      )}
      <span
        onClick={showModal}
        className="bg-red-500 p-5 rounded-md text-white font-semibold cursor-pointer"
      >
        삭제하기
      </span>
    </>
  );
}
