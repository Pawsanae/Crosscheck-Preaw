import { int, mysqlTable, text } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { faculties } from "~/schemas/faculties";

export const facultyGroups = mysqlTable("FACULTY_GROUPS", {
  id: int("ID").primaryKey().autoincrement(),
  name: text("NAME").notNull(),
});

export const facultyGroupRelations = relations(
  facultyGroups,
  ({ one, many }) => ({
    faculties: many(faculties),
  }),
);
