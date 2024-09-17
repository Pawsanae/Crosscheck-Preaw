import { db } from "~/db-connection";
import { subjects } from "~/schemas/subjects";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const pk = getRouterParam(event, "pk");
  if (!pk) {
    throw new Error("ไม่พบวิชาที่ต้องการลบ");
  }
  await db.delete(subjects).where(eq(subjects.pk, parseInt(pk)));
});
