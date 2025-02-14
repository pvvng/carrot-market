"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useActionState, useEffect, useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";

const MAX_FILE_SIZE_MB = 1;

export default function AddProduct() {
  const [uploadUrl, setUploadUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [imageId, setImageId] = useState("");

  const interceptAction = async (_: any, formData: FormData) => {
    // upload image
    const file = formData.get("photo");

    if (!file) {
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
      alert("이미지 업로드에 실패했습니다.");
      return;
    }

    // replace photo in formdata
    const photoUrl = `https://imagedelivery.net/MR01-6_39Z4fkK0Q1BsXww/${imageId}`;
    formData.set("photo", photoUrl);

    // call uploadProduct Action
    // await이 아닌 return 사용하기
    return uploadProduct(_, formData);
  };

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length == 0) {
      // 취소버튼 클릭하면 초기화 시켜야함
      setPreview("");
      setImageId("");
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
    <div>
      <form action={action} className="flex flex-col gap-5 p-5">
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
                {state ? state?.fieldErrors.photo : "사진을 추가해주세요."}
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
        <Input
          name="title"
          required
          placeholder="제목"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          required
          placeholder="가격"
          type="number"
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          required
          placeholder="자세한 설명"
          type="text"
          errors={state?.fieldErrors.description}
        />
        <Button text="작성완료" />
      </form>
    </div>
  );
}
