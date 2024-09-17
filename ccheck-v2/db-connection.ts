import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as curriculumSchema from "~/schemas/curriculums";
import * as degreeSchema from "~/schemas/degrees";
import * as facultySchema from "~/schemas/faculties";
import * as facultyGroupSchema from "~/schemas/facultyGroups";
import * as subjectSchema from "~/schemas/subjects";
import * as subjectTypeSchema from "~/schemas/subjectTypes";
import * as subjectOccupationTypeSchema from "~/schemas/subjectOccupationTypes";

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "crosscheck",
  database: process.env.DB_NAME || "ccheck",
  password: process.env.DB_PASS || "",
  port: parseInt(process.env.DB_PORT!) || 3306,
});
export const db = drizzle(connection, {
  schema: {
    ...curriculumSchema,
    ...degreeSchema,
    ...facultySchema,
    ...facultyGroupSchema,
    ...subjectSchema,
    ...subjectTypeSchema,
    ...subjectOccupationTypeSchema,
  },
  mode: "default",
});
