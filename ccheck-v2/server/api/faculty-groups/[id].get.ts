import { db } from "~/db-connection";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw new Error("ไม่พบรหัสกลุ่มคณะที่ต้องการ");
  }
  const facultyGroup = await db.query.facultyGroups.findFirst({
    where: (facultyGroup) => eq(facultyGroup.id, parseInt(id)),
  });

  if (!facultyGroup) {
    throw new Error("ไม่พบกลุ่มคณะที่ต้องการ");
  }

  return facultyGroup;
});
