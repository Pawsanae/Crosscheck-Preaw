import { z } from "zod";

export const subjectTypeSchema = () => {
  return z.object({
    name: z
      .string({ required_error: "กรุณากรอกชื่อประเภทรายวิชา" })
      .min(3, "กรุณากรอกชื่อประเภทรายวิชาอย่างน้อย 3 ตัวอักษร"),
  });
};
