"use client";

import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";

export default function Login() {
  const onclick = async () => {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username: "kim",
        password: "21230",
      }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Login with email and password</h2>
      </div>
      <form className="flex flex-col gap-3 ">
        <FormInput type="email" placeholder="email" required errors={[]} />
        <FormInput
          type="password"
          placeholder="password"
          required
          errors={[]}
        />
      </form>
      <span onClick={onclick}>
        <FormButton text="Create Account" isLoading={false} />
      </span>
      <SocialLogin />
    </div>
  );
}
