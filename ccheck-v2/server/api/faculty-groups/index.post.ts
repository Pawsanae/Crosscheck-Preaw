import { db } from "~/db-connection";
import { facultyGroupSchema } from "~/composables/facultyGroupSchema";
import { facultyGroups } from "~/schemas/facultyGroups";

export default eventHandler(async (event) => {
  const schema = facultyGroupSchema();
  const result = await readValidatedBody(event, (body) =>
    schema.safeParse(body),
  );
  if (!result.success) {
    throw result.error.issues;
  }
  const facultyGroup = await db.query.facultyGroups.findFirst({
    where: (facultyGroup, { eq }) => eq(facultyGroup.name, result.data.name),
  });
  if (facultyGroup) {
    throw new Error("กลุ่มคณะนี้มีอยู่แล้ว");
  }
  return db.insert(facultyGroups).values(result.data);
});
