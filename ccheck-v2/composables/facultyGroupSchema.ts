import { z } from "zod";

export const facultyGroupSchema = () => {
  return z.object({
    name: z
      .string({ required_error: "กรุณากรอกชื่อกลุ่มคณะ" })
      .min(3, "กรุณากรอกชื่อกลุ่มอย่างน้อย 3 ตัวอักษร"),
  });
};
