import { db } from "~/db-connection";
import { degrees } from "~/schemas/degrees";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw new Error("ไม่พบรหัสระดับการศึกษาที่ต้องการลบ");
  }
  const curriculum = await db.query.curriculums.findFirst({
    where: (curriculum) => eq(curriculum.degreeId, parseInt(id)),
  });
  if (curriculum) {
    throw new Error("ไม่สามารถลบระดับการศึกษาได้เนื่องจากมีหลักสูตรที่อ้างถึง");
  }
  await db.delete(degrees).where(eq(degrees.id, parseInt(id)));
});
