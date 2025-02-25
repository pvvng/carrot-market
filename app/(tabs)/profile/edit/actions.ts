"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";

const userSchema = z.object({
  photo: z.string({
    required_error: "사진 항목은 필수입니다.",
    invalid_type_error: "잘못된 타입입니다.",
  }),
  username: z
    .string({
      required_error: "사용자 이름 항목은 필수입니다.",
      invalid_type_error: "잘못된 타입입니다.",
    })
    .refine(async (username: string) => {
      const session = await getSession();
      const isExist = await db.user.findMany({
        where: {
          id: { not: session.id! },
          username,
        },
        select: { id: true },
      });
      return !Boolean(isExist.length);
    }, "이 이름을 사용하는 사용자가 존재합니다."),
});

export async function editUser(_: any, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    username: formData.get("username"),
  };

  const result = await userSchema.spa(data);

  if (!result.success) {
    return result.error.flatten();
  }

  const session = await getSession();

  await db.user.update({
    where: { id: session.id! },
    data: {
      username: result.data.username,
      avatar: result.data.photo + "/public",
    },
  });

  redirect("/profile");
}
