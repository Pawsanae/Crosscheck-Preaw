import { db } from "~/db-connection";

export default eventHandler(() => {
  return db.query.subjectTypes.findMany();
});