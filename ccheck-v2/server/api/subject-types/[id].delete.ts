import { db } from "~/db-connection";
import { eq } from "drizzle-orm";
import { subjectTypes } from "~/schemas/subjectTypes";

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw new Error("ไม่พบประเภทรายวิชาที่ต้องการลบ");
  }
  const subject = await db.query.subjects.findFirst({
    where: (subject) => eq(subject.subjectTypeId, parseInt(id)),
  });
  if (subject) {
    throw new Error("ไม่สามารถประเภทรายวิชาได้เนื่องจากมีรายวิชาที่อ้างถึง");
  }
  await db.delete(subjectTypes).where(eq(subjectTypes.id, parseInt(id)));
});
