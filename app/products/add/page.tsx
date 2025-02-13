"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function AddProduct() {
  const [preview, setPreview] = useState([]);
  const onImageChange = () => {};

  return (
    <div>
      <form className="flex flex-col gap-5 p-5">
        <label
          htmlFor="photo"
          className="border-2 border-neutral-300 rounded-md border-dashed aspect-square 
          flex flex-col items-center justify-center text-neutral-300 cursor-pointer"
        >
          <PhotoIcon className="w-20" />
          <div className="text-neural-400 text-sm">사진을 추가해주세요.</div>
        </label>
        <input
          type="file"
          id="photo"
          name="photo"
          className="hidden"
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
