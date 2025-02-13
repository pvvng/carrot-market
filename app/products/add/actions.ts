"use server";

import { z } from "zod";
import fs from "fs/promises";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

// 1MB
const MAX_FILE_SIZE = 1 * 1024 * 1024;

const productSchema = z.object({
  photo: z
    .string({
      required_error: "사진 항목은 필수입니다.",
      invalid_type_error: "잘못된 타입입니다.",
    })
    .refine(
      (photo) => !(photo === undefined || photo == "undefined"),
      "이미지 확인에 실패했습니다."
    ),
  title: z.string({
    required_error: "제목 항목은 필수입니다.",
    invalid_type_error: "잘못된 타입입니다.",
  }),
  description: z.string({
    required_error: "설명 항목은 필수입니다.",
    invalid_type_error: "잘못된 타입입니다.",
  }),
  price: z.coerce.number({
    required_error: "가격 항목은 필수입니다.",
    invalid_type_error: "잘못된 타입입니다.",
  }),
});

export async function uploadProduct(prevState: any, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  if (!(data.photo instanceof File)) {
    return {
      formErrors: [],
      fieldErrors: { photo: ["파일이 확인되지 않습니다."] },
    };
  }

  if (!data.photo.name || data.photo.size === 0) {
    return {
      formErrors: [],
      fieldErrors: { photo: ["이미지가 확인되지 않습니다."] },
    };
  }

  if (data.photo.size > MAX_FILE_SIZE) {
    return {
      formErrors: [],
      fieldErrors: { photo: ["이미지 크기는 1MB까지 허용됩니다."] },
    };
  }

  // 이미지 파일 버퍼로 만들기
  const photoData = await data.photo.arrayBuffer();
  // 임시방편으로 이미지 프로젝트 루트에 저장하기
  await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));

  // data.photo 변경하기
  data.photo = `/${data.photo.name}`;

  const result = productSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  }

  const session = await getSession();

  if (!session.id) {
    return {
      formErrors: [],
      fieldErrors: { description: ["사용자 아이디를 확인하지 못했습니다."] },
    };
  }

  const product = await db.product.create({
    data: {
      title: result.data.title,
      photo: result.data.photo,
      description: result.data.description,
      price: result.data.price,
      user: {
        connect: {
          id: session.id,
        },
      },
    },
    select: { id: true },
  });

  return redirect(`/products/${product.id}`);
}
