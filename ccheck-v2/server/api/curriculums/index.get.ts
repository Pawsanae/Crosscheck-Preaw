import { db } from "~/db-connection";
import { curriculums } from "~/schemas/curriculums";
import { and, eq, like, or, sql } from "drizzle-orm";

export default eventHandler(async (event) => {
  const { search, limit, offset, degreeId, facultyId } = getQuery(event);

  if (!search && !limit && !offset && !facultyId && !degreeId) {
    return db.query.curriculums.findMany({
      with: {
        degree: true,
        faculty: {
          with: {
            facultyGroup: true,
          },
        },
      },
      where: (curriculums) => eq(curriculums.showStatus, true),
      orderBy: (curriculums, { desc }) => [desc(curriculums.pk)],
    });
  }

  if (search && degreeId && facultyId && limit && offset) {
    const total = await db
      .select({ count: sql`count(*)` })
      .from(curriculums)
      .where(
        and(
          or(
            like(curriculums.name, `%${search}%`),
            like(curriculums.id, `%${search}%`),
          ),
          eq(curriculums.degreeId, parseInt(degreeId as string)),
          eq(curriculums.facultyId, parseInt(facultyId as string)),
          eq(curriculums.showStatus, true),
        ),
      );

    const data = await db.query.curriculums.findMany({
      where: (curriculums) =>
        and(
          or(
            like(curriculums.name, `%${search}%`),
            like(curriculums.id, `%${search}%`),
          ),
          eq(curriculums.degreeId, parseInt(degreeId as string)),
          eq(curriculums.facultyId, parseInt(facultyId as string)),
          eq(curriculums.showStatus, true),
        ),
      with: {
        degree: true,
        faculty: {
          with: {
            facultyGroup: true,
          },
        },
      },
      offset: parseInt(offset as string),
      limit: parseInt(limit as string),
      orderBy: (curriculums, { desc }) => [desc(curriculums.pk)],
    });
    return {
      total: total[0].count,
      data: data,
    };
  }

  if (search && degreeId && limit && offset) {
    const total = await db
      .select({ count: sql`count(*)` })
      .from(curriculums)
      .where(
        and(
          or(
            like(curriculums.name, `%${search}%`),
            like(curriculums.id, `%${search}%`),
          ),
          eq(curriculums.degreeId, parseInt(degreeId as string)),
          eq(curriculums.showStatus, true),
        ),
      );
    const data = await db.query.curriculums.findMany({
      where: (curriculums) =>
        and(
          or(
            like(curriculums.name, `%${search}%`),
            like(curriculums.id, `%${search}%`),
          ),
          eq(curriculums.degreeId, parseInt(degreeId as string)),
          eq(curriculums.showStatus, true),
        ),
      with: {
        degree: true,
        faculty: {
          with: {
            facultyGroup: true,
          },
        },
      },
      offset: parseInt(offset as string),
      limit: parseInt(limit as string),
      orderBy: (curriculums, { desc }) => [desc(curriculums.pk)],
    });
    return {
      total: total[0].count,
      data: data,
    };
  }

  if (search && facultyId && limit && offset) {
    const total = await db
      .select({ count: sql`count(*)` })
      .from(curriculums)
      .where(
        and(
          or(
            like(curriculums.name, `%${search}%`),
            like(curriculums.id, `%${search}%`),
          ),
          eq(curriculums.facultyId, parseInt(facultyId as string)),
          eq(curriculums.showStatus, true),
        ),
      );
    const data = await db.query.curriculums.findMany({
      where: (curriculums) =>
        and(
          or(
            like(curriculums.name, `%${search}%`),
            like(curriculums.id, `%${search}%`),
          ),
          eq(curriculums.facultyId, parseInt(facultyId as string)),
          eq(curriculums.showStatus, true),
        ),
      with: {
        degree: true,
        faculty: {
          with: {
            facultyGroup: true,
          },
        },
      },
      offset: parseInt(offset as string),
      limit: parseInt(limit as string),
      orderBy: (curriculums, { desc }) => [desc(curriculums.pk)],
    });
    return {
      total: total[0].count,
      data: data,
    };
  }

  if (degreeId && facultyId && limit && offset) {
    const total = await db
      .select({ count: sql`count(*)` })
      .from(curriculums)
      .where(
        and(
          eq(curriculums.degreeId, parseInt(degreeId as string)),
          eq(curriculums.facultyId, parseInt(facultyId as string)),
          eq(curriculums.showStatus, true),
        ),
      );
    const data = await db.query.curriculums.findMany({
      where: (curriculums) =>
        and(
          eq(curriculums.degreeId, parseInt(degreeId as string)),
          eq(curriculums.facultyId, parseInt(facultyId as string)),
          eq(curriculums.showStatus, true),
        ),
      with: {
        degree: true,
        faculty: {
          with: {
            facultyGroup: true,
          },
        },
      },
      offset: parseInt(offset as string),
      limit: parseInt(limit as string),
      orderBy: (curriculums, { desc }) => [desc(curriculums.pk)],
    });
    return {
      total: total[0].count,
      data: data,
    };
  }

  if (degreeId && limit && offset) {
    const total = await db
      .select({ count: sql`count(*)` })
      .from(curriculums)
      .where(and(eq(curriculums.degreeId, parseInt(degreeId as string))));
    const data = await db.query.curriculums.findMany({
      where: (curriculums) =>
        and(
          eq(curriculums.degreeId, parseInt(degreeId as string)),
          eq(curriculums.showStatus, true),
        ),
      with: {
        degree: true,
        faculty: {
          with: {
            facultyGroup: true,
          },
        },
      },
      offset: parseInt(offset as string),
      limit: parseInt(limit as string),
      orderBy: (curriculums, { desc }) => [desc(curriculums.pk)],
    });
    return {
      total: total[0].count,
      data: data,
    };
  }

  if (facultyId && limit && offset) {
    const total = await db
      .select({ count: sql`count(*)` })
      .from(curriculums)
      .where(and(eq(curriculums.facultyId, parseInt(facultyId as string))));
    const data = await db.query.curriculums.findMany({
      where: (curriculums) =>
        and(
          eq(curriculums.facultyId, parseInt(facultyId as string)),
          eq(curriculums.showStatus, true),
        ),
      with: {
        degree: true,
        faculty: {
          with: {
            facultyGroup: true,
          },
        },
      },
      offset: parseInt(offset as string),
      limit: parseInt(limit as string),
      orderBy: (curriculums, { desc }) => [desc(curriculums.pk)],
    });
    return {
      total: total[0].count,
      data: data,
    };
  }

  if (search && limit && offset) {
    const total = await db
      .select({ count: sql`count(*)` })
      .from(curriculums)
      .where(
        and(
          or(
            like(curriculums.name, `%${search}%`),
            like(curriculums.id, `%${search}%`),
          ),
          eq(curriculums.showStatus, true),
        ),
      );
    const data = await db.query.curriculums.findMany({
      where: (curriculums) =>
        and(
          or(
            like(curriculums.name, `%${search}%`),
            like(curriculums.id, `%${search}%`),
          ),
          eq(curriculums.showStatus, true),
        ),
      with: {
        degree: true,
        faculty: {
          with: {
            facultyGroup: true,
          },
        },
      },
      offset: parseInt(offset as string),
      limit: parseInt(limit as string),
      orderBy: (curriculums, { desc }) => [desc(curriculums.pk)],
    });
    return {
      total: total[0].count,
      data: data,
    };
  }

  if (limit && offset) {
    const total = await db
      .select({ count: sql`count(*)` })
      .from(curriculums)
      .where(eq(curriculums.showStatus, true));

    const data = await db.query.curriculums.findMany({
      with: {
        degree: true,
        faculty: {
          with: {
            facultyGroup: true,
          },
        },
      },
      where: (curriculums) => eq(curriculums.showStatus, true),
      offset: parseInt(offset as string),
      limit: parseInt(limit as string),
      orderBy: (curriculums, { desc }) => [desc(curriculums.pk)],
    });
    return {
      total: total[0].count,
      data: data,
    };
  }
  return;
});
