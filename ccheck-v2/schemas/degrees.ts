import { int, mysqlTable, text } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { curriculums } from "~/schemas/curriculums";

export const degrees = mysqlTable("DEGREES", {
  id: int("ID").primaryKey().autoincrement(),
  name: text("NAME").notNull(),
});

export const degreeRelations = relations(degrees, ({ many }) => ({
  curriculum: many(curriculums),
}));
