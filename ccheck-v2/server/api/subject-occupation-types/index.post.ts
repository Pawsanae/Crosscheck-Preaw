import { db } from "~/db-connection";
import { subjectTypeSchema } from "~/composables/subjectTypeSchema";
import { subjectOccupationTypes } from "~/schemas/subjectOccupationTypes";

export default eventHandler(async (event) => {
  const schema = subjectTypeSchema();
  const result = await readValidatedBody(event, (body) =>
    schema.safeParse(body),
  );
  if (!result.success) {
    throw result.error.issues;
  }
  const subjectOccupationType = await db.query.subjectOccupationTypes.findFirst(
    {
      where: (subjectOccupationType, { eq }) =>
        eq(subjectOccupationType.name, result.data.name),
    },
  );
  if (subjectOccupationType) {
    throw new Error("ประเภทรายวิชานี้มีอยู่แล้ว");
  }
  return db.insert(subjectOccupationTypes).values(result.data);
});
