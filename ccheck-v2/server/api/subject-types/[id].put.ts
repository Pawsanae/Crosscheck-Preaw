import { db } from "~/db-connection";
import { eq } from "drizzle-orm";
import { subjectTypeSchema } from "~/composables/subjectTypeSchema";
import { subjectTypes } from "~/schemas/subjectTypes";

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw new Error("ไม่พบประเภทรายวิชาที่ต้องการแก้ไข");
  }

  const schema = subjectTypeSchema();
  const result = await readValidatedBody(event, (body) =>
    schema.safeParse(body),
  );
  if (!result.success) {
    throw result.error.issues;
  }

  await db
    .update(subjectTypes)
    .set(result.data)
    .where(eq(subjectTypes.id, parseInt(id)));

  return db.query.subjectTypes.findFirst({
    where: (subjectType) => eq(subjectType.id, parseInt(id)),
  });
});
