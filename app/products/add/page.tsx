"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useActionState, useEffect, useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormType, productSchema } from "./schema";

const MAX_FILE_SIZE_MB = 1;

export default function AddProduct() {
  const [uploadUrl, setUploadUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [imageFile, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProductFormType>({
    // 프론트엔드에서 Zod를 이용하여 validation하기
    resolver: zodResolver(productSchema),
  });

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length == 0) {
      // 취소버튼 클릭하면 초기화 시켜야함
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
    // 파일 상태(state)에 저장
    setFile(file);

    const { success, result } = await getUploadUrl();

    if (!success) {
      alert("이미지 업로드에 실패했습니다.");
      return;
    }

    const { id, uploadURL } = result;
    setUploadUrl(uploadURL);

    // replace photo in formdata
    const photoUrl = `https://imagedelivery.net/MR01-6_39Z4fkK0Q1BsXww/${id}`;

    // image input은 RHF에 register 하지 않았기 때문에 setValue로 등록해줘야함
    // 또한 정상적으로 zod valid 되기위해 String 타입의 photoUrl 등록하기
    setValue("photo", photoUrl);
  };

  // handleSubmit은 내부 함수가 정상적으로 동작할때만 실행
  const onSubmit = handleSubmit(async (data: ProductFormType) => {
    // state 확인
    if (!imageFile) {
      alert("이미지를 확인하지 못했습니다.");
      return;
    }

    // CF 이미지 업로드
    const cloudflareForm = new FormData();
    cloudflareForm.append("file", imageFile);

    const response = await fetch(uploadUrl, {
      method: "post",
      body: cloudflareForm,
    });

    if (response.status !== 200) {
      alert("이미지 업로드에 실패했습니다.");
      return;
    }

    // Actions에 보낼 formData 생성하기
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", data.price + "");
    formData.append("description", data.description);
    formData.append("photo", data.photo);
    formData.append("title", data.title);

    // call uploadProduct Action
    // await이 아닌 return 사용하기
    const errors = await uploadProduct(formData);

    if (errors) {
      // actions에서 받은 에러 처리
      // setError("")
    }
  });

  const onValid = async () => {
    await onSubmit();
  };

  console.log(errors);

  return (
    <div>
      <form action={onValid} className="flex flex-col gap-5 p-5">
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
                {errors ? errors?.photo?.message : "사진을 추가해주세요."}
              </div>
            </>
          )}
        </label>
        <input
          type="file"
          id="photo"
          className="hidden"
          // 이미지만 받기
          accept="image/*"
          onChange={onImageChange}
        />
        <Input
          required
          placeholder="제목"
          type="text"
          {...register("title")}
          errors={[errors?.title?.message ?? ""]}
        />
        <Input
          required
          placeholder="가격"
          type="number"
          {...register("price")}
          errors={[errors?.price?.message ?? ""]}
        />
        <Input
          required
          placeholder="자세한 설명"
          type="text"
          {...register("description")}
          errors={[errors?.description?.message ?? ""]}
        />
        <Button text="작성완료" />
      </form>
    </div>
  );
}
