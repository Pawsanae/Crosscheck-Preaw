import { db } from "~/db-connection";
import { eq } from "drizzle-orm";
import { subjectOccupationTypes } from "~/schemas/subjectOccupationTypes";

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw new Error("ไม่พบประเภทวิชาชีพที่ต้องการลบ");
  }
  const subject = await db.query.subjects.findFirst({
    where: (subject) => eq(subject.subjectOccupationId, parseInt(id)),
  });
  if (subject) {
    throw new Error("ไม่สามารถประเภทวิชาชีพได้เนื่องจากมีรายวิชาที่อ้างถึง");
  }
  await db
    .delete(subjectOccupationTypes)
    .where(eq(subjectOccupationTypes.id, parseInt(id)));
});
