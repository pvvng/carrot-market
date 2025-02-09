import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import GithubLogin from "./github-login";

export default function SocialLogin() {
  return (
    <>
      <div className="w-full h-px bg-neutral-500 " />
      <div className="flex flex-col gap-3">
        <GithubLogin />
        <Link
          className="primary-btn flex h-10 items-center justify-center gap-3"
          href="/sms"
        >
          <span>
            <ChatBubbleOvalLeftEllipsisIcon className="size-6" />
          </span>
          <span>Continue with SMS</span>
        </Link>
      </div>
    </>
  );
}
