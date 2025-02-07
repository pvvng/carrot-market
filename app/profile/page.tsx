import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";

async function getUser() {
  const session = await getSession();
  // 쿠키 세션을 통해서 user id 알아내기
  if (session.id) {
    const user = await db.user.findUnique({
      where: { id: session.id },
    });

    if (user) {
      return user;
    }
  }

  // 세션 id가 없을때 (== 로그아웃)
  // 혹은 id가 db에 존재하지 않을때 실행
  // not-found 보여주기
  notFound();
}

export default async function Profile() {
  // get session(cookie)
  const user = await getUser();

  // inline server action
  const logout = async () => {
    "use server";
    const session = await getSession();
    // 세션 쿠키 삭제
    session.destroy();
  };

  return (
    <div>
      <h1>welcome {user.username}</h1>
      <form action={logout}>
        <button>log out</button>
      </form>
    </div>
  );
}
