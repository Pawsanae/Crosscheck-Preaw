import {
  boolean,
  int,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { faculties } from "~/schemas/faculties";
import { degrees } from "~/schemas/degrees";

export const curriculums = mysqlTable("CURRICULUMS", {
  pk: int("PK").primaryKey().autoincrement(),
  id: varchar("ID", { length: 14 }).notNull(),
  name: text("NAME").notNull(),
  year: varchar("YEAR", { length: 4 }).notNull(),
  philosophy: text("PHILOSOPHY"),
  description: text("DESCRIPTION"),
  objective: text("OBJECTIVE"),
  ability: text("ABILITY"),
  partner: text("PARTNER"),
  globalPartner: text("GLOBAL_PARTNER"),
  industry: text("INDUSTRY"),
  cwie: text("CWIE"),
  eecModel: text("EEC_MODEL"),
  graduateInYear: int("GRADUATE_IN_YEAR").default(4).notNull(),
  showStatus: boolean("SHOW_STATUS").default(true).notNull(),
  facultyId: int("FACULTY_ID").notNull(),
  degreeId: int("DEGREE_ID").notNull(),
  version: int("VERSION").default(1).notNull(),
});

export const curriculumRelations = relations(curriculums, ({ one, many }) => ({
  faculty: one(faculties, {
    fields: [curriculums.facultyId],
    references: [faculties.id],
  }),
  degree: one(degrees, {
    fields: [curriculums.degreeId],
    references: [degrees.id],
  }),
}));
