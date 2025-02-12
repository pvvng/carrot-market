"use client";

export default function ProductModal({
  title,
  closeModal,
}: {
  title: string;
  closeModal: () => void;
}) {
  return (
    <div className="w-full h-screen mx-auto fixed inset-0 flex flex-col gap-2 justify-center items-center">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={closeModal}
      />
      <div className="relative z-10 text-center bg-white rounded-md p-5 *:text-black">
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
          <button className="bg-red-500 p-3 rounded-md text-white font-semibold mt-2">
            예
          </button>
          <span
            onClick={closeModal}
            className="bg-black p-3 rounded-md text-white font-semibold mt-2 cursor-pointer"
          >
            아니요
          </span>
        </div>
      </div>
    </div>
  );
}
