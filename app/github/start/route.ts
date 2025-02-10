import { redirect } from "next/navigation";
// route 파일로 특정 http 메서드 핸들러를 만들 수 있음
// /github/start로 GET 요청 보낼때 동작함

export async function GET() {
  const baseURL = "https://github.com/login/oauth/authorize";
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: "read:user,user:email",
    allow_signup: "true",
  };
  // get params 편하게 바꾸는 법 : URLSearchParams.toString()
  const formattedParams = new URLSearchParams(params).toString();
  const finalURL = `${baseURL}?${formattedParams}`;

  // 깃허브 로그인 페이지로 리다이렉트 시키기
  return redirect(finalURL);
  // 로그인 성공하면 application에 정의된 callback URL로 보냄
}
