import { Context } from "hono";
import { decode } from "~/auth/jwt";

export default {
  async handler(c: Context) {
    const request = c.req.raw;
    const isXhr = c.req.header("X-Requested-With") === "XMLHttpRequest";

    try {
      if (request.method !== "GET") {
        throw new Error("Method not supported!");
      }

      if (!isXhr) {
        throw new Error("Request not allowed!");
      }

      const payload = await decode(
        c.req.header("Authorization") || "",
        c.env.OAUTH_JWT_TOKEN
      );

      const userData = await c.env.WORKER_AUTH_PROVIDERS_STORE.get(
        payload?.user_id as string,
        "json"
      );

      return c.json({
        success: true,
        data: userData,
      });
    } catch (err: any) {
      return c.json({
        success: false,
        message: err.message,
      });
    }
  },
};
