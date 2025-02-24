import ProfileCard from "@/components/profile-card";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import { revalidateTag } from "next/cache";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

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
  const user = await getUser();

  const logout = async () => {
    "use server";
    const session = await getSession();
    // 세션 쿠키 삭제
    await session.destroy();
    revalidateTag("#user");
    redirect("/");
  };

  return (
    <div className="p-5 flex flex-col gap-4 mb-24">
      <div className="bg-neutral-950 rounded-md flex flex-col gap-5 justify-center items-start p-5">
        <div className="flex items-center gap-3">
          <div className="size-14 rounded-full overflow-hidden bg-neutral-200 relative">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.username}
                fill
                sizes="56"
                priority
                className="object-cover"
              />
            ) : (
              <UserIcon />
            )}
          </div>
          <p className="font-semibold text-lg">{user.username}</p>
        </div>
        <form className="w-full">
          <button className="bg-neutral-700 w-full font-medium py-1 rounded-md hover:bg-neutral-600 transition-colors">
            프로필 수정
          </button>
        </form>
      </div>
      <div className="bg-neutral-950 rounded-md flex flex-col p-5 gap-2">
        <p className="font-semibold text-sm p-1">나의 거래</p>
        <ProfileCard icon="sell" text="판매내역" link="/profile/sell" />
        <ProfileCard icon="purchase" text="구매내역" link="#" />
        <ProfileCard icon="givenReview" text="받은 매너 평가" link="#" />
        <ProfileCard icon="receivedReview" text="보낸 매너 평가" link="#" />
      </div>
      <div className="bg-neutral-950 rounded-md flex flex-col p-5 gap-2">
        <p className="font-semibold text-sm p-1">나의 활동</p>
        <ProfileCard icon="heart" text="관심목록" link="#" />
        <ProfileCard icon="recent" text="최근 본 게시물" link="#" />
        <ProfileCard icon="post" text="내 동네생활 글" link="#" />
      </div>
      <form action={logout} className="w-full">
        <button className="bg-red-500 w-full font-medium py-1 rounded-md hover:bg-red-400 transition-colors">
          로그아웃
        </button>
      </form>
    </div>
  );
}
