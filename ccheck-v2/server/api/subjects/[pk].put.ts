import { db } from "~/db-connection";
import { subjectSchema } from "~/composables/subjectSchema";
import { eq } from "drizzle-orm";
import { subjects } from "~/schemas/subjects";

export default eventHandler(async (event) => {
  const pk = getRouterParam(event, "pk");
  if (!pk) {
    throw new Error("ไม่พบวิชาที่ต้องการแก้ไข");
  }
  const schema = subjectSchema();
  const result = await readValidatedBody(event, (body) =>
    schema.safeParse(body),
  );
  if (!result.success) {
    throw result.error.issues;
  }
  await db
    .update(subjects)
    .set(result.data)
    .where(eq(subjects.pk, parseInt(pk)));

  return db.query.subjects.findFirst({
    where: (subject) => eq(subject.pk, parseInt(pk)),
  });
});
