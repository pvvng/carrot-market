"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";

import { handleForm } from "./actions";
import { useActionState } from "react";

export default function Login() {
  /**
   * useActionState : 클라이언트 컴포넌트에서만 사용 가능한 form 훅
   *
   * state -> form이 반환한 값, action의 실행 결과값이 된다.
   * trigger(dispatch, action) -> form의 action 실행 함수
   */
  const [state, action] = useActionState(
    handleForm,
    null // form state의 초기값 설정
  );

  // useActionState의 실행 순서
  // 0. 초기값(state) handleForm으로 전송
  // 1. action 트리거 (form 제출)
  // 2. 초기값 state, action 결과값으로 갱신
  console.log(state);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Login with email and password</h2>
      </div>
      <form className="flex flex-col gap-3" action={action}>
        <Input name="email" type="email" placeholder="email" required />
        <Input
          name="password"
          type="password"
          placeholder="password"
          required
          minLength={8}
        />
        <Button text="로그인" />
      </form>
      <SocialLogin />
    </div>
  );
}
