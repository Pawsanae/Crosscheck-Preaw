import { db } from "~/db-connection";
import { eq } from "drizzle-orm";
import { curriculums } from "~/schemas/curriculums";
import { curriculumSchema } from "~/composables/curriculumSchema";

export default eventHandler(async (event) => {
  const pk = getRouterParam(event, "pk");
  if (!pk) {
    throw new Error("ไม่พบหลักสูตรที่ต้องการแก้ไข");
  }
  const schema = curriculumSchema();
  const result = await readValidatedBody(event, (body) =>
    schema.safeParse(body),
  );
  if (!result.success) {
    throw result.error.issues;
  }

  await db
    .update(curriculums)
    .set(result.data)
    .where(eq(curriculums.pk, parseInt(pk)));

  return db.query.curriculums.findFirst({
    where: (curriculum) => eq(curriculum.pk, parseInt(pk)),
  });
});
