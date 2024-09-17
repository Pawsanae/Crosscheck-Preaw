import {facultySchema} from "~/composables/facultySchema";
import {db} from "~/db-connection";
import {faculties} from "~/schemas/faculties";

export default eventHandler(async (event) => {
    const schema = facultySchema();
    const result = await readValidatedBody(event, (body) =>
        schema.safeParse(body),
    );
    if (!result.success) {
        throw result.error.issues;
    }
    const faculty = await db.query.faculties.findFirst({
        where: (faculty, {eq}) => eq(faculty.name, result.data.name),
    });
    if (faculty) {
        throw new Error("คณะนี้มีอยู่แล้ว");
    }
    return db.insert(faculties).values(result.data);
});
