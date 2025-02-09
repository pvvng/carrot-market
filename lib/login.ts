import getSession from "./session";

/** 사용자 로그인 시키는 함수
 * @param id 로그인 할 유저의 id
 */
export default async function LogUserIn(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
}
