"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

const productSchema = z.object({
  id: z.coerce.number({
    invalid_type_error: "잘못된 타입입니다.",
  }),
  photo: z.string({
    required_error: "사진 항목은 필수입니다.",
    invalid_type_error: "잘못된 타입입니다.",
  }),
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
  sold_out: z
    .enum(["0", "1"], {
      errorMap: () => ({
        message:
          "판매 상태는 0(판매 중) 또는 1(판매 완료)만 입력할 수 있습니다.",
      }),
    })
    .transform((val) => val === "1"),
});

export async function editProduct<T>(_: T, formData: FormData) {
  const data = {
    id: formData.get("id"),
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
    sold_out: formData.get("sold_out"),
  };

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

  const product = await db.product.update({
    where: { id: result.data.id },
    data: {
      title: result.data.title,
      photo: result.data.photo,
      description: result.data.description,
      price: result.data.price,
      sold_out: result.data.sold_out,
      user: {
        connect: {
          id: session.id,
        },
      },
    },
    select: { id: true },
  });

  // revalidateTag는 서버에서만 동작함
  revalidateTag("#home");
  revalidateTag("#selling-products");
  revalidateTag("#purchased-products");

  revalidatePath(`/products/p/${product.id}`);

  return redirect(`/products/p/${product.id}`);
}
