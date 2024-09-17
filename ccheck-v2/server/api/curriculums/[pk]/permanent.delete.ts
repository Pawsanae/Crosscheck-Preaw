import { db } from "~/db-connection";
import { curriculums } from "~/schemas/curriculums";
import { eq } from "drizzle-orm";
import { subjects } from "~/schemas/subjects";

export default eventHandler(async (event) => {
  const pk = getRouterParam(event, "pk");
  if (!pk) {
    throw new Error("ไม่พบหลักสูตรที่ต้องการจะลบ");
  }
  await db.delete(subjects).where(eq(subjects.curriculumPk, parseInt(pk)));
  await db.delete(curriculums).where(eq(curriculums.pk, parseInt(pk)));
});
