"use client";

import { useEffect } from "react";

/** 모달 배경 스크롤 정지하도록 하는 컴포넌트/커스텀훅 */
export default function ModalScrollBreak() {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return null;
}
