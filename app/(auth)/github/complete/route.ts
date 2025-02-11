import db from "@/lib/db";
import LogUserIn from "@/lib/login";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // /github/complete?code=임시토큰
  const code = req.nextUrl.searchParams.get("code");

  // 에러 처리 (bad requset)
  if (!code) {
    return new Response(null, { status: 400 });
  }

  const { error, access_token } = await getAccessToken(code);

  // 에러 처리 (bad requset)
  if (error || !access_token) {
    return new Response(null, { status: 400 });
  }

  // 필요한 데이터 받아오기
  const { id, avatar_url, login } = await getUserProfile(access_token);
  const rawEmail = await getUserEmail(access_token);

  // 데이터 포맷
  const github_id = id.toString();
  const email = rawEmail.filter((email) => email.primary)[0].email;

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

  // 이름 및 이메일이 동일한 사용자가 있는지 확인
  const [nameExist, emailExist] = await Promise.all([
    db.user.findUnique({
      where: { username: login },
      select: { id: true },
    }),
    db.user.findUnique({
      where: { email },
      select: { id: true },
    }),
  ]);

  const newUser = await db.user.create({
    data: {
      // 같은 이름을 가진 사용자가 존재한다면 이름 뒤에 현재시 추가
      username: login + (nameExist ? Date.now() : ""),
      // 같은 이메일을 가진 사용자가 존재한다면 email field null로
      email: !emailExist ? email : null,
      avatar: avatar_url,
      github_id,
    },
    select: { id: true },
  });

  // 사용자 로그인 시키기
  await LogUserIn(newUser.id);

  // 리다이렉트
  return redirect("/profile");
}

// 제네릭 타입 정의를 위한 유틸리티 함수
async function safeJson<T>(response: Response): Promise<T> {
  return response.json();
}

interface AccessTokenRespose {
  error: string | undefined;
  access_token: string | undefined;
}

// access token fetch
async function getAccessToken(code: string) {
  // 다음 params를 준비해서
  const accessTokenParams = createAccessTokenParams(code);

  const baseUrl = "https://github.com/login/oauth/access_token";
  // access token 받기 위해 POST req 보내기
  const accessTokenUrl = `${baseUrl}?${accessTokenParams}`;

  // header 넣어서 받을 데이터 타입 (json/xml) 정하기
  const accessTokenResponse = await fetch(accessTokenUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });

  return safeJson<AccessTokenRespose>(accessTokenResponse);
}

// access token params 생성하는 함수
function createAccessTokenParams(code: string) {
  // 다음 params를 준비해서
  return new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
}

interface GithubUser {
  id: number;
  avatar_url: string;
  login: string;
}

// 유저 프로필 fetch
async function getUserProfile(access_token: string) {
  const url = "https://api.github.com/user";

  const userProfileResponse = await fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });

  return await safeJson<GithubUser>(userProfileResponse);
}

interface GithubEmail {
  email: string;
  primary: boolean;
}

// 유저 이메일 fetch
async function getUserEmail(access_token: string) {
  const url = "https://api.github.com/user/emails";

  const userEmailResponse = await fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });

  return safeJson<GithubEmail[]>(userEmailResponse);
}
