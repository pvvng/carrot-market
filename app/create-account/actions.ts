"use server";

import {
  EMAIL_ERROR,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_ERROR,
  PASSWORD_NOT_CONFIRMED_ERROR,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
  USERNAME_INVALID_ERROR,
  USERNAME_TYPE_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import LogUserIn from "@/lib/login";

const checkPasswords = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;

// zod에게 검증할 데이터를 설명할때는 스키마(블루프린트) 생성이 필요함
const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: USERNAME_TYPE_ERROR,
        required_error: USERNAME_INVALID_ERROR,
      })
      .toLowerCase()
      .trim(),
    email: z.string().email(EMAIL_ERROR).toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR),
  })
  // fatal한 에러 발생시 뒤의 validation을 실행하지 않고 얼리리턴
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 사용중인 이름입니다.",
        path: ["username"],
        fatal: true,
      });

      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이 이메일로 가입된 계정이 이미 존재합니다.",
        path: ["email"],
        fatal: true,
      });

      return z.NEVER;
    }
  })
  // global 에러를 특정 영역에서 처리하기 위해 에러 책임 지저하는 path 명시
  .refine(checkPasswords, {
    message: PASSWORD_NOT_CONFIRMED_ERROR,
    path: ["confirmPassword"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  // safeParseAsync -> promise 함수에 알아서 async await
  const result = await formSchema.spa(data);

  if (!result.success) {
    console.log(result.error.flatten());
    // 에러메시지 깔끔하게 깔끼하기 위해 flatten 메서드 사용
    return result.error.flatten();
  }

  // hash password
  const hashedPassword = await bcrypt.hash(result.data.password, 12);

  // save the user to db
  const user = await db.user.create({
    data: {
      username: result.data.username,
      email: result.data.email,
      password: hashedPassword,
    },
    select: {
      id: true,
    },
  });

  await LogUserIn(user.id);

  // 사용자 리다이렉트
  redirect("/profile");
}
