import { db } from "~/db-connection";
import { curriculums } from "~/schemas/curriculums";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const pk = getRouterParam(event, "pk");
  if (!pk) {
    throw new Error("ไม่พบหลักสูตรที่ต้องการจะลบ");
  }
  await db
    .update(curriculums)
    .set({ showStatus: false })
    .where(eq(curriculums.pk, parseInt(pk)));
});
