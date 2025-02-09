import { notFound } from "next/navigation";
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

  const accessTokenData = await accessTokenResponse.json();

  // 에러 처리
  if ("error" in accessTokenData) {
    return new Response(null, { status: 400 });
  }

  return Response.json({ accessTokenData });
}
