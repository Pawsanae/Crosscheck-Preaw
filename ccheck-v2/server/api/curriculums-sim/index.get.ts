import { db } from "~/db-connection";
import { curriculums } from "~/schemas/curriculums";
import { and, eq, like, or, sql } from "drizzle-orm";
import { subjects } from "~/schemas/subjects";

// get curriculums which have subjects
export default eventHandler(async (event) => {
    try {
        const AllCurriculums = await db.query.curriculums.findMany({
            where: (curriculums) => eq(curriculums.showStatus, true),
        });

        const curriculumsWithSubjects = await Promise.all(
            AllCurriculums.map(async (curriculum) => {
                const subjectsCount = await db
                    .select({
                        count: sql`count(*)`,
                    })
                    .from(subjects)
                    .where(eq(subjects.curriculumPk, curriculum.pk));

                return {
                    ...curriculum,
                    subjectsCount: subjectsCount[0].count,
                };
            })
        );

        return curriculumsWithSubjects;
    } catch (e: any) {
        throw createError({
            message: e.message,
            status: e.status,
        });
    }
});
