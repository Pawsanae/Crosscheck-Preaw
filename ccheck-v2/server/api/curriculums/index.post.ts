import { curriculumSchema } from "~/composables/curriculumSchema";
import { db } from "~/db-connection";
import { curriculums } from "~/schemas/curriculums";

export default eventHandler(async (event) => {
  const schema = curriculumSchema();
  const result = await readValidatedBody(event, (body) =>
    schema.safeParse(body),
  );
  if (!result.success) {
    throw result.error.issues;
  }
  const curriculum = await db.query.curriculums.findFirst({
    where: (curriculum, { and, eq }) =>
      and(
        eq(curriculum.id, result.data.id),
        eq(curriculum.year, result.data.year),
        eq(curriculum.version, result.data.version),
        eq(curriculum.showStatus, true),
      ),
  });
  if (curriculum) {
    throw new Error("ยกเลิกการบันทึกข้อมูล เนื่องจากหลักสูตรนี้มีอยู่แล้ว");
  }
  return db.insert(curriculums).values(result.data);
});
