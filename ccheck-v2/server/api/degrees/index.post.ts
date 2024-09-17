import { db } from "~/db-connection";
import { degrees } from "~/schemas/degrees";
import { degreeSchema } from "~/composables/degreeSchema";

export default eventHandler(async (event) => {
  const schema = degreeSchema();
  const result = await readValidatedBody(event, (body) =>
    schema.safeParse(body),
  );
  if (!result.success) {
    throw result.error.issues;
  }
  const degree = await db.query.degrees.findFirst({
    where: (degree, { eq }) => eq(degree.name, result.data.name),
  });
  if (degree) {
    throw new Error("ระดับการศึกษานี้มีอยู่แล้ว");
  }
  return db.insert(degrees).values(result.data);
});
