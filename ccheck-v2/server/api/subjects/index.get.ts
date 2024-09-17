import { db } from "~/db-connection";
import { and, eq, like, or, sql } from "drizzle-orm";
import { subjects } from "~/schemas/subjects";

export default eventHandler(async (event) => {
  const { search, limit, offset, curriculumPk, subjectTypeId } =
    getQuery(event);
  if (!search && !limit && !offset && !curriculumPk && !subjectTypeId) {
    return db.query.subjects.findMany({
      with: {
        subjectType: true,
        subjectOccupationType: true,
      },
      orderBy: (subjects, { desc }) => [desc(subjects.pk)],
    });
  }

  if (search && curriculumPk && subjectTypeId && limit && offset) {
    const total = await db
      .select({
        count: sql`count(*)`,
      })
      .from(subjects)
      .where(
        and(
          or(
            like(subjects.id, `%${search}%`),
            like(subjects.nameEN, `%${search}%`),
            like(subjects.nameTH, `%${search}%`),
          ),
          eq(subjects.curriculumPk, parseInt(curriculumPk as string)),
          eq(subjects.subjectTypeId, parseInt(subjectTypeId as string)),
        ),
      );
    const data = await db.query.subjects.findMany({
      where: (subjects) =>
        and(
          or(
            like(subjects.id, `%${search}%`),
            like(subjects.nameEN, `%${search}%`),
            like(subjects.nameTH, `%${search}%`),
          ),
          eq(subjects.curriculumPk, parseInt(curriculumPk as string)),
          eq(subjects.subjectTypeId, parseInt(subjectTypeId as string)),
        ),
      with: {
        subjectType: true,
        subjectOccupationType: true,
      },
      offset: parseInt(offset as string),
      limit: parseInt(limit as string),
      orderBy: (subjects, { desc }) => [desc(subjects.pk)],
    });
    return {
      total: total[0].count,
      data: data,
    };
  }
  if (search && curriculumPk && limit && offset) {
    const total = await db
      .select({
        count: sql`count(*)`,
      })
      .from(subjects)
      .where(
        and(
          or(
            like(subjects.id, `%${search}%`),
            like(subjects.nameEN, `%${search}%`),
            like(subjects.nameTH, `%${search}%`),
          ),
          eq(subjects.curriculumPk, parseInt(curriculumPk as string)),
        ),
      );
    const data = await db.query.subjects.findMany({
      where: (subjects) =>
        and(
          or(
            like(subjects.id, `%${search}%`),
            like(subjects.nameEN, `%${search}%`),
            like(subjects.nameTH, `%${search}%`),
          ),
          eq(subjects.curriculumPk, parseInt(curriculumPk as string)),
        ),
      with: {
        subjectType: true,
        subjectOccupationType: true,
      },
      offset: parseInt(offset as string),
      limit: parseInt(limit as string),
      orderBy: (subjects, { desc }) => [desc(subjects.pk)],
    });
    return {
      total: total[0].count,
      data: data,
    };
  }
  if (curriculumPk && subjectTypeId && limit && offset) {
    const total = await db
      .select({
        count: sql`count(*)`,
      })
      .from(subjects)
      .where(
        and(
          eq(subjects.curriculumPk, parseInt(curriculumPk as string)),
          eq(subjects.subjectTypeId, parseInt(subjectTypeId as string)),
        ),
      );
    const data = await db.query.subjects.findMany({
      where: (subjects) =>
        and(
          eq(subjects.curriculumPk, parseInt(curriculumPk as string)),
          eq(subjects.subjectTypeId, parseInt(subjectTypeId as string)),
        ),
      with: {
        subjectType: true,
        subjectOccupationType: true,
      },
      offset: parseInt(offset as string),
      limit: parseInt(limit as string),
      orderBy: (subjects, { desc }) => [desc(subjects.pk)],
    });
    return {
      total: total[0].count,
      data: data,
    };
  }

  if (curriculumPk && limit && offset) {
    const total = await db
      .select({
        count: sql`count(*)`,
      })
      .from(subjects)
      .where(and(eq(subjects.curriculumPk, parseInt(curriculumPk as string))));
    const data = await db.query.subjects.findMany({
      where: (subjects) =>
        and(eq(subjects.curriculumPk, parseInt(curriculumPk as string))),
      with: {
        subjectType: true,
        subjectOccupationType: true,
      },
      offset: parseInt(offset as string),
      limit: parseInt(limit as string),
      orderBy: (subjects, { desc }) => [desc(subjects.pk)],
    });
    return {
      total: total[0].count,
      data: data,
    };
  }

  if (subjectTypeId && limit && offset) {
    const total = await db
      .select({
        count: sql`count(*)`,
      })
      .from(subjects)
      .where(
        and(eq(subjects.subjectTypeId, parseInt(subjectTypeId as string))),
      );
    const data = await db.query.subjects.findMany({
      where: (subjects) =>
        and(eq(subjects.subjectTypeId, parseInt(subjectTypeId as string))),
      with: {
        subjectType: true,
        subjectOccupationType: true,
      },
      offset: parseInt(offset as string),
      limit: parseInt(limit as string),
      orderBy: (subjects, { desc }) => [desc(subjects.pk)],
    });
    return {
      total: total[0].count,
      data: data,
    };
  }
});
