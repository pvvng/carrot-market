import { z } from "zod";

export const productSchema = z.object({
  photo: z.string({
    required_error: "사진 항목은 필수입니다.",
    invalid_type_error: "잘못된 타입입니다.",
  }),
  title: z.string({
    required_error: "제목 항목은 필수입니다.",
    invalid_type_error: "잘못된 타입입니다.",
  }),
  description: z.string({
    required_error: "설명 항목은 필수입니다.",
    invalid_type_error: "잘못된 타입입니다.",
  }),
  price: z.coerce.number({
    required_error: "가격 항목은 필수입니다.",
    invalid_type_error: "잘못된 타입입니다.",
  }),
});

// productForm의 타입 선언
export type ProductFormType = z.infer<typeof productSchema>;
