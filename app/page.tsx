import Link from "next/link";
// db 파일 실행
import "@/lib/db";
// 클라이언트 생성 결과
// {
//   id: 1,
//   username: 'test',
//   email: null,
//   password: null,
//   phone: null,
//   github_id: null,
//   avatar: null,
//   created_at: 2025-02-06T02:57:09.843Z,
//   updated_at: 2025-02-06T02:57:09.843Z
// }

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6">
      <div className="flex flex-col items-center gap-2 my-auto *:font-medium">
        <span className="text-9xl">🥕</span>
        <h1 className="text-4xl">당근</h1>
        <h2 className="text-2xl">당근 마켓에 어서오세요!</h2>
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
        <Link href="/create-account" className="primary-btn text-lg py-2.5">
          시작하기
        </Link>
        <div className="flex gap-2">
          <span>이미 계정이 있나요?</span>
          <Link href="/login" className="hover:underline underline-offset-4">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
