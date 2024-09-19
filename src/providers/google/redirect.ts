import queryString from "qs";

import { BaseProvider } from "~/types/provider.types";

export default function getRedirectUrl({
  options,
}: BaseProvider.RedirectOptions): string {
  const {
    clientId,
    redirectTo,
    scope = "openid email profile",
    responseType = "code",
    state = "pass-through value",
    accessType = "online",
  } = options;
  if (!clientId) {
    throw new Error("No client id passed");
  }

  const params = queryString.stringify({
    client_id: clientId,
    redirect_uri: redirectTo,
    response_type: responseType,
    scope,
    include_granted_scopes: "true",
    state,
    access_type: accessType,
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  return url;
}
