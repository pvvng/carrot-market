import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

export async function middleware(req: NextRequest) {
  console.log("hello");
  const pathname = req.nextUrl.pathname;
  if (pathname === "/") {
    // 사용자에게 제공할 response 설정
    const response = NextResponse.next();
    response.cookies.set("middleware-cookie", "middleware");
    // req 인터셉트 후 수정해서 res 전송
    return response;
  }
  if (pathname === "/profile") {
    // 쿠키 받아오기
    const session = await getSession();
    console.log(session);

    /** js constructor URL을 사용하여 redirect 시키기 */
    return Response.redirect(new URL("/", req.url));
  }
}

// middleware가 실행되어야할 req 설정 가능
// regex도 사용 가능
export const config = {
  // /api, _next/static, _next/image, favicion.ico 등 배제 가능
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
