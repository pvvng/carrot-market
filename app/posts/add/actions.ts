"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";

const postSchema = z.object({
  title: z
    .string({
      required_error: "제목 항목은 필수입니다.",
      invalid_type_error: "잘못된 타입입니다.",
    })
    .min(2, "제목은 최소 2자 이상 입력해야합니다.")
    .max(20, "제목은 최대 20자만 입력 가능합니다."),
  description: z
    .string({
      required_error: "제목 항목은 필수입니다.",
      invalid_type_error: "잘못된 타입입니다.",
    })
    .max(100, "내용은 최대 100자만 입력 가능합니다."),
});

export async function uploadPost(_: any, formData: FormData) {
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const result = postSchema.safeParse(data);

  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  }

  const session = await getSession();

  if (!session || !session.id) {
    return {
      formErrors: [],
      fieldErrors: {
        description: ["로그인 후에 이용 가능합니다."],
      },
    };
  }

  await db.post.create({
    data: {
      userId: session.id!,
      title: result.data.title,
      description: result.data.description,
    },
  });

  redirect("/life");
}
