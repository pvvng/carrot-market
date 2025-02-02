import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

export default function CreateAccount() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">
          회원가입을 위해 아래에 있는 폼을 채워주세요.
        </h2>
      </div>
      <form className="flex flex-col gap-3 ">
        <div className="flex flex-col gap-2">
          <input
            className="bg-transparent rounded-md w-full h-10 border-none
            focus:outline-none ring-1 focus:ring-2 ring-neutral-200 focus:ring-orange-500 
            placeholder:text-neutral-400"
            type="text"
            placeholder="사용자 이름"
            required
          />
          <span className="text-red-500 font-medium">Input Error</span>
        </div>
        <button className="primary-btn h-10">회원가입</button>
      </form>
      <div className="w-full h-px bg-neutral-500 " />
      <div>
        <Link
          className="primary-btn flex h-10 items-center justify-center gap-3"
          href="sms"
        >
          <span>
            <ChatBubbleOvalLeftEllipsisIcon className="size-6" />
          </span>

          <span>sign up with SMS</span>
        </Link>
      </div>
    </div>
  );
}
