import { db } from "~/db-connection";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const pk = getRouterParam(event, "pk");
  if (!pk) {
    throw new Error("ไม่พบวิชาที่ต้องการ");
  }
  const subject = await db.query.subjects.findFirst({
    where: (subjects) => eq(subjects.pk, parseInt(pk)),
  });

  if (!subject) {
    throw new Error("ไม่พบวิชาที่ต้องการ");
  }

  return subject;
});
