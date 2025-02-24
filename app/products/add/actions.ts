"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { productSchema } from "./schema";
import { revalidateTag } from "next/cache";

export async function uploadProduct(formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
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

  // revalidateTag는 서버에서만 동작함
  revalidateTag("#home");
  revalidateTag("#selling-products");
  revalidateTag("#purchased-products");

  return redirect(`/products/p/${product.id}`);
}
