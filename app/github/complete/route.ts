import db from "@/lib/db";
import LogUserIn from "@/lib/login";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

interface GitHubUser {
  id: number;
  avatar_url: string;
  login: string;
}

export async function GET(req: NextRequest) {
  // /github/complete?code=임시토큰
  // 토큰 불러오기
  const code = req.nextUrl.searchParams.get("code");

  // 에러 처리 (bad requset)
  if (!code) {
    return new Response(null, {
      status: 400,
    });
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

  // 에러 처리 (bad requset)
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

  let { id, avatar_url, login }: GitHubUser = await userProfileResponse.json();
  const github_id = id.toString();

  const user = await db.user.findUnique({
    where: { github_id },
    select: { id: true },
  });

  // 이미 존재하는 사용자는 세션만 저장하고 리다이렉트
  if (user) {
    await LogUserIn(user.id);

    return redirect("/profile");
  }

  const isUserNameExist = await db.user.findUnique({
    where: { username: login },
    select: { id: true },
  });

  // 중복되는 사용자 이름이 존재한다면 현재 시간 붙히기
  const username = isUserNameExist ? login + Date.now().toString() : login;

  const newUser = await db.user.create({
    data: { github_id, avatar: avatar_url, username },
    select: { id: true },
  });

  // 사용자 로그인 시키기
  await LogUserIn(newUser.id);

  return redirect("/profile");
}
