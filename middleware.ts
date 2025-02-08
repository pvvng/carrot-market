import { NextRequest } from "next/server";
import getSession from "./lib/session";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/profile") {
    /** fetch api 로 새로운 JSON 응답 보내기 */
    // return Response.redirect({
    //   error: "you are not allowed here",
    // });

    // 쿠키 받아오기
    const session = await getSession();
    console.log(session);

    /** js constructor URL을 사용하여 redirect 시키기 */
    return Response.redirect(new URL("/", req.url));
  }
}
