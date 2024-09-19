import { Context } from "hono";

import getRedirectUrl from "~/providers/google/redirect";
import { getOAuthConfig } from "../env";

export default async function handler(c: Context) {
  try {
    const { googleClientId, googleCallbackUrl } = await getOAuthConfig(c);

    return c.redirect(
      getRedirectUrl({
        options: {
          clientId: googleClientId,
          redirectTo: googleCallbackUrl,
        },
      })
    );
  } catch (e: any) {
    return c.text(e.message || "Internal Server Error", 500);
  }
}
