import { z } from "zod";

export const loginSchema = () => {
  return z.object({
    username: z.string({ required_error: "กรุณากรอกชื่อผู้ใช้" }),
    password: z.string({ required_error: "กรุณากรอกรหัสผ่าน" }),
  });
};
