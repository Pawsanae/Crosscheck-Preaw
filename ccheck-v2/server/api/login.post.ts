import { loginSchema } from "~/composables/loginSchema";

type Response = {
  info: string;
  username: string;
  email: string;
  name: string;
  auth: boolean;
};

export default eventHandler(async (event) => {
  const schema = loginSchema();
  const result = await readValidatedBody(event, (body) =>
    schema.safeParse(body),
  );
  if (!result.success) {
    throw result.error.issues;
  }

  const BaseApiUrl = process.env["BASE_API_URL"];

  const res: Response = await $fetch(`${BaseApiUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: result.data,
  });
  return res;
});
