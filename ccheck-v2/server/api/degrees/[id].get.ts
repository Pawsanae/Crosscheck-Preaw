import { db } from "~/db-connection";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw new Error("ไม่พบรหัสระดับการศึกษาที่ต้องการ");
  }
  const degree = await db.query.degrees.findFirst({
    where: (degree) => eq(degree.id, parseInt(id)),
  });

  if (!degree) {
    throw new Error("ไม่พบระดับการศึกษาที่ต้องการ");
  }

  return degree;
});
