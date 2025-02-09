import db from "@/lib/db";
import LogUserIn from "@/lib/login";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

interface GithubUser {
  id: number;
  avatar_url: string;
  login: string;
}

interface GithubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string;
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

  // 필요한 데이터 받아오기
  const { id, avatar_url, login } = await getUserProfile(access_token);
  const rawEmail: GithubEmail[] = await getUserEmail(access_token);

  // 데이터 포맷
  const github_id = formatGithubUserId(id);
  const email = formatGithubUserEmail(rawEmail);

  // 이미 가입된 사용자인지 확인
  const user = await db.user.findUnique({
    where: { github_id },
    select: { id: true },
  });

  // 이미 존재하는 사용자는 세션만 저장하고 리다이렉트
  if (user) {
    await LogUserIn(user.id);

    return redirect("/profile");
  }

  // 이름이 동일한 사용자가 있는지 확인
  const isUserNameExist = await db.user.findUnique({
    where: { username: login },
    select: { id: true },
  });

  // 중복되는 사용자 이름이 존재한다면 현재 시간 붙히기
  const username = isUserNameExist ? login + Date.now().toString() : login;

  // 이메일이 중복되는 사용자가 존재하는지 확인
  const isUserEmailExist = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });

  const newUser = await db.user.create({
    data: {
      // 같은 이메일을 가진 사용자가 존재한다면 email field null
      email: !isUserEmailExist ? email : null,
      avatar: avatar_url,
      github_id,
      username,
    },
    select: { id: true },
  });

  // 사용자 로그인 시키기
  await LogUserIn(newUser.id);

  return redirect("/profile");
}

// 유저 프로필 fetch
async function getUserProfile(access_token: string) {
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });

  return await userProfileResponse.json();
}

// 유저 이메일 fetch
async function getUserEmail(access_token: string) {
  const userEmailResponse = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });

  return await userEmailResponse.json();
}

function formatGithubUserId(id: number) {
  return id.toString();
}

function formatGithubUserEmail(rawEmail: GithubEmail[]) {
  return rawEmail.filter((email) => email.primary)[0].email;
}
