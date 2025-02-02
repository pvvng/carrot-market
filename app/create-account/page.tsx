import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
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
        <FormInput type="text" placeholder="username" required errors={[]} />
        <FormInput type="email" placeholder="email" required errors={[]} />
        <FormInput
          type="password"
          placeholder="password"
          required
          errors={[]}
        />
        <FormInput
          type="password"
          placeholder="confirm password"
          required
          errors={[]}
        />
        <FormButton text="Create Account" isLoading={false} />
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
