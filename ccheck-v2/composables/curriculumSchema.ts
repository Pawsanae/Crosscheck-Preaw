import { z } from "zod"; // id: text("ID").notNull(),

export const curriculumSchema = () => {
  return z.object({
    id: z
      .string({
        required_error: "กรุณากรอกรหัสหลักสูตร",
      })
      .max(14, "รหัสหลักสูตรต้องเป็นตัวเลข 14 หลัก")
      .min(14, "รหัสหลักสูตรต้องเป็นตัวเลข 14 หลัก")
      .regex(/^[0-9]*$/, "รหัสหลักสูตรต้องเป็นตัวเลข 14 หลัก"),
    name: z
      .string({ required_error: "กรุณากรอกชื่อหลักสูตร" })
      .min(3, "กรุณากรอกชื่อหลักสูตรอย่างน้อย 3 ตัวอักษร"),
    year: z
      .string({
        required_error: "กรุณากรอกปีหลักสูตร",
      })
      .min(4, "กรุณากรอกปีหลักสูตรให้ถูกต้อง")
      .max(4, "กรุณากรอกปีหลักสูตรให้ถูกต้อง")
      .regex(/^[0-9]{4}$/, "กรุณากรอกปีหลักสูตรให้ถูกต้อง"),
    philosophy: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    objective: z.string().optional().nullable(),
    ability: z.string().optional().nullable(),
    partner: z.string().optional().nullable(),
    globalPartner: z.string().optional().nullable(),
    industry: z.string().optional().nullable(),
    cwie: z.string().optional().nullable(),
    eecModel: z.string().optional().nullable(),
    graduateInYear: z.number({
      required_error: "กรุณากรอกระยะเวลาของหลักสูตร",
    }),
    facultyId: z.number({ required_error: "กรุณาเลือกคณะ" }),
    degreeId: z.number({ required_error: "กรุณาเลือกระดับการศึกษา" }),
    version: z.number({ required_error: "กรุณากรอกเวอร์ชั่น" }),
  });
};
