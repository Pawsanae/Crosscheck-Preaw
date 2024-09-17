import { int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { subjectTypes } from "~/schemas/subjectTypes";
import { subjectOccupationTypes } from "~/schemas/subjectOccupationTypes";

export const subjects = mysqlTable("SUBJECTS", {
  pk: int("PK").primaryKey().autoincrement(),
  id: varchar("ID", { length: 8 }).notNull(),
  nameTH: text("NAME_TH").notNull(),
  nameEN: text("NAME_EN").notNull(),
  descTH: text("DESC_TH").notNull(),
  descEN: text("DESC_EN").notNull(),
  overAllCredit: int("OVERALL_CREDIT"),
  selfLearnCredit: int("SELF_LEARN_CREDIT"),
  lectureCredit: int("LECTURE_CREDIT"),
  labCredit: int("LAB_CREDIT"),
  curriculumPk: int("CURRICULUM_PK").notNull(),
  subjectTypeId: int("SUBJECT_TYPE_ID").notNull().default(1),
  subjectOccupationId: int("SUBJECT_OCCUPATION_ID").notNull().default(1),
});

export const subjectRelations = relations(subjects, ({ one, many }) => ({
  subjectType: one(subjectTypes, {
    fields: [subjects.subjectTypeId],
    references: [subjectTypes.id],
  }),
  subjectOccupationType: one(subjectOccupationTypes, {
    fields: [subjects.subjectOccupationId],
    references: [subjectOccupationTypes.id],
  }),
}));
