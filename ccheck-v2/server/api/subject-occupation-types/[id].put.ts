import { db } from "~/db-connection";
import { eq } from "drizzle-orm";
import { subjectOccupationTypeSchema } from "~/composables/subjectOccupationTypeSchema";
import { subjectOccupationTypes } from "~/schemas/subjectOccupationTypes";

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw new Error("ไม่พบประเภทวิชาชีพที่ต้องการแก้ไข");
  }

  const schema = subjectOccupationTypeSchema();
  const result = await readValidatedBody(event, (body) =>
    schema.safeParse(body),
  );
  if (!result.success) {
    throw result.error.issues;
  }

  await db
    .update(subjectOccupationTypes)
    .set(result.data)
    .where(eq(subjectOccupationTypes.id, parseInt(id)));

  return db.query.subjectOccupationTypes.findFirst({
    where: (subjectOccupationType) =>
      eq(subjectOccupationType.id, parseInt(id)),
  });
});
