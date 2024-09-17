import { db } from "~/db-connection";
import { eq } from "drizzle-orm";
import { facultyGroups } from "~/schemas/facultyGroups";

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw new Error("ไม่พบรหัสกลุ่มคณะที่ต้องการลบ");
  }
  const faculty = await db.query.faculties.findFirst({
    where: (faculty) => eq(faculty.facultyGroupId, parseInt(id)),
  });
  if (faculty) {
    throw new Error("ไม่สามารถลบกลุ่มคณะได้เนื่องจากมีคณะที่อ้างถึง");
  }
  await db.delete(facultyGroups).where(eq(facultyGroups.id, parseInt(id)));
});
