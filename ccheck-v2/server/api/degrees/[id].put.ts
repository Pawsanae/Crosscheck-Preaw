import { db } from "~/db-connection";
import { degrees } from "~/schemas/degrees";
import { eq } from "drizzle-orm";
import { degreeSchema } from "~/composables/degreeSchema";

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw new Error("ไม่พบรหัสระดับการศึกษาที่ต้องการแก้ไข");
  }

  const schema = degreeSchema();
  const result = await readValidatedBody(event, (body) =>
    schema.safeParse(body),
  );
  if (!result.success) {
    throw result.error.issues;
  }

  await db
    .update(degrees)
    .set(result.data)
    .where(eq(degrees.id, parseInt(id)));

  return db.query.degrees.findFirst({
    where: (degree) => eq(degree.id, parseInt(id)),
  });
});
