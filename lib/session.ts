import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  // 세션에 아이디가 없을수도 있으므로 ? 사용
  // 아이디가 없는 세션은 로그인하지 않은 사용자
  id?: number;
}

/** **사용자가 로그인 한 상태인지 확인하는 함수**
 *
 * 반환된 쿠키에 아이디가 존재하면 로그인한 상태
 */
export default async function getSession() {
  // "delicios-carrot" 라는 이름의 쿠키를 찾아 해독하여 반환하거나 빈 쿠키를 반환함
  // {빈 쿠키}.id 하고 save하면 그게 세션으로 사용될거임
  return await getIronSession<SessionContent>(await cookies(), {
    cookieName: "delicios-carrot",
    password: process.env.COOKIE_PASSWORD!,
  });
}
