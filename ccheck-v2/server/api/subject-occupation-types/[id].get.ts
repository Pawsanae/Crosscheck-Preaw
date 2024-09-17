import { db } from "~/db-connection";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw new Error("ไม่พบประเภทวิชาชีพที่ต้องการ");
  }
  const subjectOccupationType = await db.query.subjectOccupationTypes.findFirst(
    {
      where: (subjectOccupationType) =>
        eq(subjectOccupationType.id, parseInt(id)),
    },
  );

  if (!subjectOccupationType) {
    throw new Error("ไม่พบประเภทวิชาชีพที่ต้องการ");
  }

  return subjectOccupationType;
});
