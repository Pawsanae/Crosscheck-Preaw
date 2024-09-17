import { z } from "zod";

export const facultySchema = () => {
  return z.object({
    name: z
      .string({ required_error: "กรุณากรอกชื่อคณะ" })
      .min(3, "กรุณากรอกชื่อคณะอย่างน้อย 3 ตัวอักษร"),
    facultyGroupId: z
      .number({ required_error: "กรุณาเลือกกลุ่มคณะ" })
      .nonnegative("กรุณาเลือกกลุ่มคณะ"),
  });
};
