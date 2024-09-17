import { db } from "~/db-connection";
import { eq } from "drizzle-orm";
import { facultyGroupSchema } from "~/composables/facultyGroupSchema";
import { facultyGroups } from "~/schemas/facultyGroups";

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw new Error("ไม่พบรหัสกลุ่มคณะที่ต้องการแก้ไข");
  }

  const schema = facultyGroupSchema();
  const result = await readValidatedBody(event, (body) =>
    schema.safeParse(body),
  );
  if (!result.success) {
    throw result.error.issues;
  }
  await db
    .update(facultyGroups)
    .set(result.data)
    .where(eq(facultyGroups.id, parseInt(id)));

  return db.query.facultyGroups.findFirst({
    where: (facultyGroup) => eq(facultyGroup.id, parseInt(id)),
  });
});
