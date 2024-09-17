import { subjectSchema } from "~/composables/subjectSchema";
import { db } from "~/db-connection";
import { subjects } from "~/schemas/subjects";

export default eventHandler(async (event) => {
  const schema = subjectSchema();
  const result = await readValidatedBody(event, (body) =>
    schema.safeParse(body),
  );
  if (!result.success) {
    throw result.error.issues;
  }
  const subject = await db.query.subjects.findFirst({
    where: (subject, { and, eq }) =>
      and(
        eq(subject.id, result.data.id),
        eq(subject.curriculumPk, result.data.curriculumPk),
      ),
  });
  if (subject) {
    throw new Error(
      "ยกเลิกการบันทึกข้อมูล เนื่องจากรหัสวิชาซ้ำกับวิชาอื่นที่มีอยู่แล้ว",
    );
  }
  return db.insert(subjects).values(result.data);
});
