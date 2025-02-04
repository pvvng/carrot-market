"use server";
import { z } from "zod";

// zod에게 검증할 데이터를 설명할때는 스키마(블루프린트) 생성이 필요함
const usernameSchema = z.string().min(5).max(10);

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  usernameSchema.parse(data.username);
}
