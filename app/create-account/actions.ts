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
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const checkPasswords = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;
// zod의 유효성 검사를 통해 db에 username 중복이 존재하는지 확인하기
const checkUniqueUserName = async (username: string) => {
  const user = await db.user.findUnique({
    where: { username },
    select: { id: true },
  });

  // user가 검출되면 false, 아니면 true
  return !Boolean(user);
};

const checkEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return !Boolean(user);
};

// zod에게 검증할 데이터를 설명할때는 스키마(블루프린트) 생성이 필요함
const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: USERNAME_TYPE_ERROR,
        required_error: USERNAME_INVALID_ERROR,
      })
      .toLowerCase()
      .trim()
      .refine(checkUniqueUserName, "이미 사용 중인 사용자 이름입니다."),
    email: z
      .string()
      .email(EMAIL_ERROR)
      .toLowerCase()
      .refine(checkEmail, "이 이메일로 회원가입 된 계정이 이미 존재합니다."),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR),
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
  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
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
  // log the user in
  // 쿠키를 한번 저장하면 다음에 유저가 http 통신을 할때 쿠키도 보냄
  // 사용자 정보가 필요한 페이지에서도 쿠키를 사용 가능함

  // 쿠키를 받아서 getIronSession을 통해 delicios-carrot 쿠키 생성 혹은 가져오기
  const cookie = await getIronSession(await cookies(), {
    cookieName: "delicios-carrot",
    password: process.env.COOKIE_PASSWORD!,
  });
  // @ts-ignore
  // 회원가입한 사용자의 암호화 된 db-id를 쿠키에 저장
  cookie.id = user.id;
  await cookie.save();

  // 사용자 리다이렉트
  redirect("/profile");
}
