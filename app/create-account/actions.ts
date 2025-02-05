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
import { z } from "zod";

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

  // parse 메서드는 에러를 throw 하지만 safePased는 에러 반환 안함
  // { success: false; error: ZodError }
  const result = formSchema.safeParse(data);

  if (!result.success) {
    console.log(result.error.flatten());
    // 에러메시지 깔끔하게 깔끼하기 위해 flatten 메서드 사용
    return result.error.flatten();
  }

  // validated, transformed data
  console.log(result.data);
}
