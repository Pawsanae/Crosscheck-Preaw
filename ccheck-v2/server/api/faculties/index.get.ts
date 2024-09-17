import { db } from "~/db-connection";

export default eventHandler(() => {
  return db.query.faculties.findMany({
    with: {
      facultyGroup: true,
    },
  });
});
