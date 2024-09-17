import { db } from "~/db-connection";
import { curriculums } from "~/schemas/curriculums";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const pk = getRouterParam(event, "pk");
  if (!pk) {
    throw new Error("ไม่พบหลักสูตรที่ต้องการจะลบ");
  }
  // const subject = await db.query.subjects.findFirst({
  //   where: (subject) => eq(subject.curriculumPk, parseInt(pk)),
  // });
  // if (subject) {
  //   throw new Error("ไม่สามารถลบหลักสูตรได้เนื่องจากมีรายวิชาที่อ้างถึง");
  // }
  await db
    .update(curriculums)
    .set({ showStatus: true })
    .where(eq(curriculums.pk, parseInt(pk)));
});
