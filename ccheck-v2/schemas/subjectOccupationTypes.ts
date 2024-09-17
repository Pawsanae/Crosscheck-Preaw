import { int, mysqlTable, text } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { subjects } from "~/schemas/subjects";

export const subjectOccupationTypes = mysqlTable("SUBJECT_OCCUPATION_TYPES", {
  id: int("ID").primaryKey().autoincrement(),
  name: text("NAME").notNull(),
});

export const subjectOccupationTypeRelations = relations(
  subjectOccupationTypes,
  ({ many }) => ({
    subjects: many(subjects),
  }),
);
