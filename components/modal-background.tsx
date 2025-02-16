"use client";

import { useRouter } from "next/navigation";

export default function ModalBackground() {
  const router = useRouter();
  const onCloseClick = () => {
    router.back();
  };

  return (
    <div
      className="absolute w-full h-full bg-black/60 left-0 top-0 -z-10"
      onClick={onCloseClick}
    />
  );
}
