import { db } from "~/db-connection";
import { subjectTypeSchema } from "~/composables/subjectTypeSchema";
import { subjectTypes } from "~/schemas/subjectTypes";

export default eventHandler(async (event) => {
  const schema = subjectTypeSchema();
  const result = await readValidatedBody(event, (body) =>
    schema.safeParse(body),
  );
  if (!result.success) {
    throw result.error.issues;
  }
  const subjectType = await db.query.subjectTypes.findFirst({
    where: (subjectType, { eq }) => eq(subjectType.name, result.data.name),
  });
  if (subjectType) {
    throw new Error("ประเภทรายวิชานี้มีอยู่แล้ว");
  }
  return db.insert(subjectTypes).values(result.data);
});
