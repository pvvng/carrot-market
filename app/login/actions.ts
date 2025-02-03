// 서버 액션을 위해 키워드 반드시 작성하기
"use server";

import { redirect } from "next/navigation";

// 서버 액션을 서버 파일로 분리해서 import 후 사용하기
// (클라이언트 컴포넌트에서 서버액션 사용이 안되기 때문)
export async function handleForm(prevState: any, formData: FormData) {
  console.log(prevState);

  // fetch (example)
  await new Promise((res) => setTimeout(res, 5000));

  // redirect
  // redirect("/");

  // handleForm return value (error)
  return {
    errors: ["wrong password", "password too short"],
  };
}
