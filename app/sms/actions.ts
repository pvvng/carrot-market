"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    // use validator library
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "잘못된 전화번호 형식입니다."
  );

// coerce : formdata 형변환
const tokenSchema = z.coerce
  .number()
  .min(100000, "인증코드는 100000 미만일 수 없습니다.")
  .max(999999, "인증코드는 999999 초과일 수 없습니다.");

interface ActionState {
  token: boolean;
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");

  // initial state
  // prevestate.token === false 인 상황
  // 그러니까 사용자의 핸드폰 번호가 제대로 작성되지 않은 상황
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);

    return {
      token: result.success,
      error: result.error?.flatten(),
    };
  }

  // 사용자 핸드폰 번호가 확인되었을때 실행
  // 앞선 반환문으로 prevstate.token === true로 변경된 상황
  const result = tokenSchema.safeParse(token);

  // tokenSchema로 토큰 검증 결과 확인
  // 만약 토큰이 올바르지 않으면 실행
  if (!result.success) {
    return {
      token: true,
      // return error
      error: result.error.flatten(),
    };
  }

  // 전화번호 및 토큰 검증이 완료되면 redirect
  return redirect("/");
}
