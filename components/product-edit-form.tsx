"use client";

import { getUploadUrl } from "@/app/products/add/actions";
import { editProduct } from "@/app/products/p/[id]/edit/actions";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useActionState, useEffect, useState } from "react";
import Input from "./input";
import Button from "./button";
import { Product } from "@/lib/data/product";

const MAX_FILE_SIZE_MB = 1;

export default function ProductEditForm(product: Product) {
  const [preview, setPreview] = useState<string | null>(
    `${product.photo}/public`
  );
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);

  const interceptAction = async (_: any, formData: FormData) => {
    // 이미지에 변화가 없을때
    if (preview?.endsWith("public")) {
      formData.set("photo", preview.replace(/\/public$/, ""));

      return editProduct(_, formData);
    }

    // upload image
    const file = formData.get("photo");

    if (!file || !uploadUrl) {
      alert("이미지를 확인하지 못했습니다.");
      return;
    }

    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);

    const response = await fetch(uploadUrl, {
      method: "post",
      body: cloudflareForm,
    });

    if (response.status !== 200) {
      alert("이미지 업로드에 실패했습니다. 새로고침 후 다시 시도해주세요.");
      return;
    }

    // replace photo in formdata
    const photoUrl = `https://imagedelivery.net/MR01-6_39Z4fkK0Q1BsXww/${imageId}`;
    formData.set("photo", photoUrl);

    // call uploadProduct Action
    // await이 아닌 return 사용하기
    return editProduct(_, formData);
  };

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length == 0) {
      // 취소버튼 클릭하면 초기화 시켜야함
      setPreview(null);
      setImageId(null);
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

    const url = URL.createObjectURL(file);
    setPreview(url);

    const { success, result } = await getUploadUrl();

    if (!success) {
      alert("이미지 업로드에 실패했습니다.");
      return;
    }

    const { id, uploadURL } = result;
    setUploadUrl(uploadURL);
    setImageId(id);
  };

  const [state, action] = useActionState(interceptAction, null);

  return (
    <form action={action} className="flex flex-col gap-5 p-5">
      <label
        htmlFor="photo"
        className="border-2 border-neutral-300 rounded-md border-dashed aspect-square 
        flex flex-col items-center justify-center text-neutral-300 cursor-pointer bg-center bg-cover"
        style={{ backgroundImage: `url(${preview})` }}
      >
        {!preview && (
          <>
            <PhotoIcon className="w-20" />
            <div className="text-neural-400 text-sm"></div>
          </>
        )}
      </label>
      <input
        name="photo"
        type="file"
        id="photo"
        className="hidden"
        // 이미지만 받기
        accept="image/*"
        onChange={onImageChange}
      />
      <input name="id" defaultValue={product.id} className="hidden" />
      <Input
        name="title"
        required
        placeholder="제목"
        type="text"
        defaultValue={product.title}
        errors={state?.fieldErrors.title}
      />
      <Input
        name="price"
        required
        placeholder="가격"
        type="number"
        defaultValue={product.price}
        errors={state?.fieldErrors.price}
      />
      <Input
        name="description"
        required
        placeholder="자세한 설명"
        defaultValue={product.description}
        type="text"
        errors={state?.fieldErrors.description}
      />
      <div className="flex gap-3 items-center justify-center *:w-full *:p-3 *:text-center *:rounded-md *:font-semibold">
        <label className="ring-2 ring-white has-[:checked]:ring-orange-500 has-[:checked]:text-orange-500">
          <input
            type="radio"
            name="sold_out"
            value="0"
            className="hidden"
            defaultChecked={!product.sold_out}
            required
          />
          판매 중
        </label>
        <label className="ring-2 ring-white has-[:checked]:ring-orange-500 has-[:checked]:text-orange-500">
          <input
            type="radio"
            name="sold_out"
            value="1"
            className="hidden"
            defaultChecked={product.sold_out}
            required
          />
          판매 완료
        </label>
      </div>
      <Button text="저장하기" />
    </form>
  );
}
