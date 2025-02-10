"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import crypto from "crypto";

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
    // db에 저장된 이전 토큰 삭제하기
    await db.sMSToken.deleteMany({
      where: { user: { phone: result.data } },
    });
    // create new token
    const token = await getToken();
    // token 생성하기
    await db.sMSToken.create({
      data: {
        token,
        // 토큰 모델을 사용자랑 연결하는데
        user: {
          connectOrCreate: {
            // 이미 존재하는 사용자 (로그인) 인 경우에는 연결만 해주기
            where: { phone: result.data },
            // 회원가입하는 사용자는 임시 사용자명 설정 및 phone 기록해두기
            create: {
              username: crypto.randomBytes(10).toString("hex"),
              phone: result.data,
            },
          },
        },
      },
    });
    // send the token using twillio

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
      error: result.error.flatten(),
    };
  }

  // 전화번호 및 토큰 검증이 완료되면 redirect
  return redirect("/");
}

async function getToken() {
  // 토큰 생성
  const token = crypto.randomInt(100000, 999999).toString();
  // 이미 토큰이 존재하는지 확인
  const exist = await db.sMSToken.findUnique({
    where: { token },
    select: { id: true },
  });

  // 이미 토큰이 존재하면 재귀
  if (exist) {
    return getToken();
  }

  return token;
}
