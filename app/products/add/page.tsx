"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { uploadProduct } from "./actions";

const MAX_FILE_SIZE_MB = 1;

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length == 0) {
      // 이미지 선택을 안한 경우엔 preview 초기화하기
      setPreview("");
      return;
    }

    const file = files[0];

    if (!file.type.startsWith("image")) {
      alert("이미지 파일만 업로드 할 수 있습니다.");
      return;
    }

    if (MAX_FILE_SIZE_MB < file.size / (1024 * 1024)) {
      alert(`최대 ${MAX_FILE_SIZE_MB}MB의 이미지만 업로드 할 수 있습니다.`);
      return;
    }

    // 내 브라우저에서만 사용가능한 url 생성하기
    // 브라우저 메모리에 파일 임시저장되는거 사용하는거임
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  return (
    <div>
      <form action={uploadProduct} className="flex flex-col gap-5 p-5">
        <label
          htmlFor="photo"
          className="border-2 border-neutral-300 rounded-md border-dashed aspect-square 
          flex flex-col items-center justify-center text-neutral-300 cursor-pointer bg-center bg-cover"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === "" && (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neural-400 text-sm">
                사진을 추가해주세요.
              </div>
            </>
          )}
        </label>
        <input
          type="file"
          id="photo"
          name="photo"
          className="hidden"
          // 이미지만 받기
          accept="image/*"
          onChange={onImageChange}
        />
        <Input name="title" required placeholder="제목" type="text" />
        <Input name="price" required placeholder="가격" type="number" />
        <Input
          name="description"
          required
          placeholder="자세한 설명"
          type="text"
        />
        <Button text="작성완료" />
      </form>
    </div>
  );
}
