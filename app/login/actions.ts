// 서버 액션을 위해 키워드 반드시 작성하기
"use server";

import {
  EMAIL_ERROR,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_ERROR,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import { redirect } from "next/navigation";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(EMAIL_ERROR).toLowerCase(),
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

  const result = formSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  }

  console.log(result.data);
}
