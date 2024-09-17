import {facultySchema} from "~/composables/facultySchema";
import {db} from "~/db-connection";
import {eq} from "drizzle-orm";
import {faculties} from "~/schemas/faculties";

export default eventHandler(async (event) => {
    const id = getRouterParam(event, "id");

    if (!id) {
        throw new Error("ไม่พบรหัสคณะที่ต้องการแก้ไข");
    }

    const schema = facultySchema();
    const result = await readValidatedBody(event, (body) =>
        schema.safeParse(body),
    );
    if (!result.success) {
        throw result.error.issues;
    }
    console.log(result.data);
    await db
        .update(faculties)
        .set(result.data)
        .where(eq(faculties.id, parseInt(id)));

    return db.query.faculties.findFirst({
        where: (faculty) => eq(faculty.id, parseInt(id)),
    });
});
