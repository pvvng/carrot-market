"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import crypto from "crypto";
import LogUserIn from "@/lib/login";
import { Vonage } from "@vonage/server-sdk";
import { Auth } from "@vonage/auth";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    // use validator library
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "잘못된 전화번호 형식입니다."
  );

// 입력한 토큰이 올바른지 검증
const tokenExist = async (token: number) => {
  const exist = await db.sMSToken.findUnique({
    where: { token: token.toString() },
    select: { id: true },
  });

  return Boolean(exist);
};

// coerce : formdata 형변환
const tokenSchema = z.coerce
  .number()
  .min(100000, "인증코드는 100000 미만일 수 없습니다.")
  .max(999999, "인증코드는 999999 초과일 수 없습니다.")
  .refine(tokenExist, "인증코드가 일치하지 않습니다.");

interface ActionState {
  token: boolean;
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");

  // initial state
  // prevestate.token === false 인 상황
  // 토큰이 사용자에게 보내지지 않은 상황
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

    // Vonage로 메시지 보내지
    const credentials = new Auth({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET,
    });

    const vonage = new Vonage(credentials);

    await vonage.sms.send({
      to: process.env.MY_PHONE_NUMBER!,
      //to: result.data,
      from: process.env.VONAGE_SMS_FROM!,
      text: `Your Carrot-market code is : ${token}`,
    });

    return {
      token: result.success,
      error: result.error?.flatten(),
    };
  }

  // 사용자 핸드폰 번호가 확인되었을때 실행
  // 앞선 반환문으로 prevstate.token === true로 변경된 상황
  const result = await tokenSchema.spa(token);

  // tokenSchema로 토큰 검증 결과 확인
  // 만약 토큰이 올바르지 않으면 실행
  if (!result.success) {
    return {
      token: true,
      error: result.error.flatten(),
    };
  }

  // delete 는 삭제할 데이터를 반환함
  const user = await db.sMSToken.delete({
    where: { token: result.data.toString() },
    select: { userId: true },
  });

  // 유저 로그인
  await LogUserIn(user!.userId);

  // 전화번호 및 토큰 검증이 완료되면 redirect
  return redirect("/profile");
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
