import { db } from "~/db-connection";
import { eq } from "drizzle-orm";
import { faculties } from "~/schemas/faculties";

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw new Error("ไม่พบรหัสคณะที่ต้องการลบ");
  }
  const curriculum = await db.query.curriculums.findFirst({
    where: (curriculum) => eq(curriculum.facultyId, parseInt(id)),
  });
  if (curriculum) {
    throw new Error("ไม่สามารถลบคณะได้เนื่องจากมีหลักสูตรที่อ้างถึง");
  }
  await db.delete(faculties).where(eq(faculties.id, parseInt(id)));
});
