import { int, mysqlTable, text } from "drizzle-orm/mysql-core";
import { curriculums } from "~/schemas/curriculums";
import { relations } from "drizzle-orm";
import { facultyGroups } from "~/schemas/facultyGroups";

export const faculties = mysqlTable("FACULTIES", {
  id: int("ID").primaryKey().autoincrement(),
  name: text("NAME").notNull(),
  facultyGroupId: int("FACULTY_GROUP_ID").notNull(),
});

export const facultyRelations = relations(faculties, ({ one, many }) => ({
  curriculums: many(curriculums),
  facultyGroup: one(facultyGroups, {
    fields: [faculties.facultyGroupId],
    references: [facultyGroups.id],
  }),
}));
