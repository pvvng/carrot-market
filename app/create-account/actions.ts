"use server";
import { z } from "zod";

// zod에게 검증할 데이터를 설명할때는 스키마(블루프린트) 생성이 필요함
const formSchema = z.object({
  username: z.string().min(3).max(10),
  email: z.string().email(),
  password: z.string().min(10),
  confirmPassword: z.string().min(10),
});

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  // parse 메서드는 에러를 throw 하지만 safePased는 에러 반환 안함
  // { success: false; error: ZodError }
  const result = formSchema.safeParse(data);

  if (!result.success) {
    // 에러메시지 깔끔하게 깔끼하기 위해 flatten 메서드 사용
    return result.error.flatten();
  }
}
