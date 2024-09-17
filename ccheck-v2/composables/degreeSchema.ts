import { z } from "zod";

export const degreeSchema = () => {
  return z.object({
    name: z
      .string({ required_error: "กรุณากรอกชื่อระดับการศึกษา" })
      .min(3, "กรุณากรอกชื่อระดับการศึกษาอย่างน้อย 3 ตัวอักษร"),
  });
};
