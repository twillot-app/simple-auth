import { Context } from "hono";

import getAuthUser from "~/providers/google/users";
import { encode } from "~/auth/jwt";
import { getOAuthConfig } from "../env";

export default async function handler(c: Context) {
  let errorUrl: string = "/?error=true";
  try {
    const {
      googleClientId,
      googleClientSecret,
      googleCallbackUrl,
      jwtToken,
      successUrl,
      maxAgeInDays = 7,
    } = await getOAuthConfig(c);
    errorUrl = successUrl + "?error=true";

    const { user: providerUser } = await getAuthUser({
      options: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        redirectUrl: googleCallbackUrl,
      },
      request: c.req.raw,
    });

    const maxAge = 60 * 60 * 24 * maxAgeInDays;
    const jwt = await encode(
      providerUser,
      jwtToken,
      Math.floor(Date.now() / 1000) + maxAge
    );

    return c.redirect(successUrl + "?token=" + jwt);
  } catch (e) {
    console.log(e);
    return c.redirect(errorUrl);
  }
}
