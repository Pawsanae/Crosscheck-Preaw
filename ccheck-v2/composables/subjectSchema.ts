import { z } from "zod";

export const subjectSchema = () => {
  return z.object({
    id: z
      .string({
        required_error: "กรุณากรอกรหัสวิชา",
      })
      .max(8, "รหัสวิชาต้องเป็นตัวเลข 8 หลัก")
      .min(8, "รหัสวิชาต้องเป็นตัวเลข 8 หลัก")
      .regex(/^[0-9]{8}$/, "รหัสวิชาต้องเป็นตัวเลข 8 หลัก"),
    nameTH: z
      .string({ required_error: "กรุณากรอกชื่อรายวิชาภาษาไทย" })
      .min(3, "กรุณากรอกชื่อวิชาอย่างน้อย 3 ตัวอักษร"),
    nameEN: z
      .string({ required_error: "กรุณากรอกชื่อรายวิชาภาษาอังกฤษ" })
      .min(3, "กรุณากรอกชื่อวิชาอย่างน้อย 3 ตัวอักษร"),
    descTH: z
      .string({ required_error: "กรุณากรอกคำอธิบายรายวิชาภาษาไทย" })
      .min(3, "กรุณากรอกคำอธิบายรายวิชาอย่างน้อย 3 ตัวอักษร"),
    descEN: z
      .string({ required_error: "กรุณากรอกคำอธิบายรายวิชาภาษาอังกฤษ" })
      .min(3, "กรุณากรอกคำอธิบายรายวิชาอย่างน้อย 3 ตัวอักษร"),
    overAllCredit: z
      .number()
      .nonnegative("จำนวนหน่วยกิตห้ามเป็นจำนวนติดลบ")
      .optional()
      .nullable(),
    selfLearnCredit: z
      .number()
      .nonnegative("จำนวนชั่วโมงในการศึกษาด้วยตัวเองห้ามเป็นจำนวนติดลบ")
      .optional()
      .nullable(),
    lectureCredit: z
      .number()
      .nonnegative("จำนวนชั่วโมงในการบรรยายห้ามเป็นจำนวนติดลบ")
      .optional()
      .nullable(),
    labCredit: z
      .number()
      .nonnegative("จำนวนชั่วโมงในการปฏิบัติห้ามเป็นจำนวนติดลบ")
      .optional()
      .nullable(),
    curriculumPk: z.number({ required_error: "กรุณาเลือกหลักสูตร" }),
    subjectTypeId: z.number({ required_error: "กรุณาเลือกประเภทวิชา" }),
    subjectOccupationId: z.number({
      required_error: "กรุณาเลือกประเภทวิชาชีพ",
    }),
  });
};
