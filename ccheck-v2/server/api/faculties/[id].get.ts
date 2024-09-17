import { db } from "~/db-connection";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw new Error("ไม่พบรหัสคณะที่ต้องการ");
  }
  const faculty = await db.query.faculties.findFirst({
    where: (faculty) => eq(faculty.id, parseInt(id)),
    with: {
      facultyGroup: true,
    },
  });

  if (!faculty) {
    throw new Error("ไม่พบคณะที่ต้องการ");
  }

  return faculty;
});
