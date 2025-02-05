"use server";

import { z } from "zod";
import validator from "validator";

const phoneSchema = z.string().trim().refine(validator.isMobilePhone);
// coerce : formdata 형변환
const tokenSchema = z.coerce.number().min(100000).max(999999);

export async function smsLogin(prevState: any, formData: FormData) {}
