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
  phone?: string;
  error?: z.typeToFlattenedError<string, string> | undefined;
}

export async function smsLogin(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const phone = formData.get("phone");
  const token = formData.get("token");

  const phoneResult = phoneSchema.safeParse(phone);

  // phone parse 에러시 얼리리턴
  if (phoneResult.error) {
    return {
      token: false,
      phone: phoneResult.data,
      error: phoneResult.error.flatten(),
    };
  }

  // 토큰이 사용자에게 보내지지 않은 상황
  if (!prevState.token) {
    // db에 저장된 이전 토큰 삭제하기
    await db.sMSToken.deleteMany({
      where: { user: { phone: phoneResult.data } },
    });
    // create new token
    const token = await getToken();
    // token 생성하기
    await createSMSToken(token, phoneResult.data);
    // 메시지 전송
    await sendSMS(token);

    return {
      token: true,
      phone: phoneResult.data,
    };
  }

  const tokenResult = await tokenSchema.spa(token);

  // tokenSchema로 토큰 검증 결과 확인
  // 만약 토큰이 올바르지 않으면 실행
  if (!tokenResult.success) {
    return {
      token: true,
      phone: phoneResult.data,
      error: tokenResult.error.flatten(),
    };
  }

  // db Token model에 저장된 사용자 전화번호와 사용자가 입력한 전화번호를 대조
  const dbPhone = await db.sMSToken.findUnique({
    where: { token: tokenResult.data.toString() },
    select: { phone: true },
  });

  // 안맞으면 에러처리
  if (!dbPhone || dbPhone.phone !== phoneResult.data) {
    return {
      token: true,
      phone: phoneResult.data,
      error: {
        fieldErrors: {},
        formErrors: ["인증되지 않은 전화번호입니다."],
      },
    };
  }

  // delete 는 삭제할 데이터를 반환함
  const user = await db.sMSToken.delete({
    where: { token: tokenResult.data.toString() },
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

async function createSMSToken(token: string, userPhone: string) {
  await db.sMSToken.create({
    data: {
      token,
      phone: userPhone,
      // 토큰 모델을 사용자랑 연결하는데
      user: {
        connectOrCreate: {
          // 이미 존재하는 사용자 (로그인) 인 경우에는 연결만 해주기
          where: { phone: userPhone },
          // 회원가입하는 사용자는 임시 사용자명 설정 및 phone 기록해두기
          create: {
            username: crypto.randomBytes(10).toString("hex"),
            phone: userPhone,
          },
        },
      },
    },
  });
}

async function sendSMS(token: string) {
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
}
