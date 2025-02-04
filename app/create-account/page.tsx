"use client";

import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";

import { useActionState } from "react";
import { createAccount } from "./actions";

export default function CreateAccount() {
  const [state, action] = useActionState(createAccount, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">
          회원가입을 위해 아래에 있는 폼을 채워주세요.
        </h2>
      </div>
      <form action={action} className="flex flex-col gap-3 ">
        <FormInput
          name="username"
          type="text"
          placeholder="username"
          required
        />
        <FormInput name="email" type="email" placeholder="email" required />
        <FormInput
          name="password"
          type="password"
          placeholder="password"
          required
        />
        <FormInput
          name="confirmPassword"
          type="password"
          placeholder="confirm password"
          required
        />
        <FormButton text="Create Account" />
      </form>
      <SocialLogin />
    </div>
  );
}
