import { db } from "~/db-connection";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw new Error("ไม่พบประเภทรายวิชาที่ต้องการ");
  }
  const subjectType = await db.query.subjectTypes.findFirst({
    where: (subjectType) => eq(subjectType.id, parseInt(id)),
  });

  if (!subjectType) {
    throw new Error("ไม่พบประเภทรายวิชาที่ต้องการ");
  }

  return subjectType;
});
