"use server";
import { z } from "zod";

const chekcUsername = (username: string) => !username.includes("$");
const checkPasswords = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;
// 소문자, 대문자, 특수문자 검증하는 regex
const passwordRegex = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
);

// zod에게 검증할 데이터를 설명할때는 스키마(블루프린트) 생성이 필요함
const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "사용자 이름은 문자만 허용됩니다.",
        required_error: "사용자 이름이 확인되지 않습니다.",
      })
      .min(3, "비밀번호는 3자 이상이어야 합니다.")
      .max(10, "비밀번호는 10자 이하여야 합니다.")
      // transform
      .toLowerCase()
      .trim()
      // custom transform
      .transform((username) => `🔥`)
      // custome validation
      .refine(chekcUsername, "$ 문자는 사용할 수 없습니다."),
    email: z.string().email("이메일 형식이 아닙니다.").toLowerCase(),
    password: z
      .string()
      .min(8, "비밀번호는 10자 이상이어야합니다.")
      .regex(
        passwordRegex,
        "비밀번호는 숫자, 대문자, 특수문자를 포함해야 합니다."
      ),
    confirmPassword: z.string().min(8, "비밀번호는 10자 이상이어야합니다."),
  })
  // global 에러를 특정 영역에서 처리하기 위해 에러 책임 지저하는 path 명시
  .refine(checkPasswords, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
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
    console.log(result.error.flatten());
    // 에러메시지 깔끔하게 깔끼하기 위해 flatten 메서드 사용
    return result.error.flatten();
  }

  // validated, transformed data
  console.log(result.data);
}
