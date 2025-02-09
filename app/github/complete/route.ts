import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // /github/complete?code=임시토큰
  // 토큰 불러오기
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return notFound();
  }

  // 다음 params를 준비해서
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();

  // access token 받기 위해 POST req 보내기
  const accessTokenUrl = `https://github.com/login/oauth/access_token?${accessTokenParams}`;

  // header 넣어서 받을 데이터 타입 (json/xml) 정하기
  const accessTokenResponse = await fetch(accessTokenUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });

  const { error, access_token } = await accessTokenResponse.json();

  // 에러 처리 (400 페이지)
  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });

  const {
    id,
    avatar_url: avatar,
    login: username,
  } = await userProfileResponse.json();
  const github_id = id.toString();

  const user = await db.user.findUnique({
    where: { github_id },
    select: { id: true },
  });

  // 이미 존재하는 사용자는 세션만 저장하고 리다이렉트
  if (user) {
    const session = await getSession();
    session.id = user.id;
    await session.save();

    return redirect("/profile");
  }

  try {
    const newUser = await db.user.create({
      data: {
        github_id,
        avatar,
        // 이메일 로그인 사용자와 이름이 겹칠 수도 있음.
        // 어떻게 해결해야할까?
        username,
      },
      select: { id: true },
    });
    // 세션 저장하기
    const session = await getSession();
    session.id = newUser.id;
    await session.save();
  } catch (error) {
    // 에러 객체 자체를 console로 출력할 수는 없음
    // console.log(error)
    // TypeError: The "payload" argument must be of type object. Received null
    console.log("에러 전체:", JSON.stringify(error));

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.error("중복된 유저 이름:", username);
        return new Response("유저명이 중복되었습니다.", { status: 400 });
      }
    }
    console.error("예기치 못한 에러:", error);
    return new Response("DB 오류 발생", { status: 500 });
  }

  return redirect("/profile");
}
