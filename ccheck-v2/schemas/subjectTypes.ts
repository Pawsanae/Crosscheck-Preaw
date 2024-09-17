import { int, mysqlTable, text } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { subjects } from "~/schemas/subjects";

export const subjectTypes = mysqlTable("SUBJECT_TYPES", {
  id: int("ID").primaryKey().autoincrement(),
  name: text("NAME").notNull(),
});

export const subjectTypeRelations = relations(subjectTypes, ({ many }) => ({
  subjects: many(subjects),
}));
