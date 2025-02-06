// 서버 액션을 위해 키워드 반드시 작성하기
"use server";

import {
  EMAIL_ERROR,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_ERROR,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email(EMAIL_ERROR)
    .toLowerCase()
    .refine(
      checkEmailExists,
      "이 이메일을 사용하는 사용자가 존재하지 않습니다."
    ),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

// 서버 액션을 서버 파일로 분리해서 import 후 사용하기
// (클라이언트 컴포넌트에서 서버액션 사용이 안되기 때문)
export async function login(prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = await formSchema.spa(data);

  if (!result.success) {
    return result.error.flatten();
  }

  // password 검증
  const user = await db.user.findUnique({
    where: { email: result.data.email },
    select: {
      password: true,
      id: true,
    },
  });

  // arg : myPlaintextPassword, hash
  const ok = await bcrypt.compare(result.data.password, user!.password ?? "");

  if (ok) {
    const session = await getSession();
    session.id = user!.id;
    await session.save();

    redirect("/profile");
  }

  // zod인척 에러 반환
  return {
    fieldErrors: {
      email: [],
      password: ["잘못된 비밀번호입니다."],
    },
  };
}
