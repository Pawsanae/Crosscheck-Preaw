import { db } from "~/db-connection";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const pk = getRouterParam(event, "pk");
  if (!pk) {
    throw new Error("ไม่พบหลักสูตรที่ต้องการ");
  }
  const curriculum = await db.query.curriculums.findFirst({
    where: (curriculums) => eq(curriculums.pk, parseInt(pk)),
  });

  if (!curriculum) {
    throw new Error("ไม่พบหลักสูตรที่ต้องการ");
  }

  return curriculum;
});
