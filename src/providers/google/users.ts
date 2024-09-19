import { BaseProvider, OAuthTokens } from "~/types/provider.types";
import { Google } from "./types";

export async function getTokensFromCode(
  code: string,
  { redirectUrl, clientId, clientSecret }: BaseProvider.TokensFromCodeOptions
): Promise<OAuthTokens> {
  console.log(`[redirectUrl], ${redirectUrl}`, "info");

  const params = {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUrl,
    code,
    grant_type: "authorization_code",
  };

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(params),
  });
  const result: any = await response.json();
  console.log(`[tokens], ${JSON.stringify(result)}`, "info");

  if (result.error) {
    throw new Error(result.error_description);
  }
  return result as OAuthTokens;
}

export async function getUser(token: string): Promise<Google.UserResponse> {
  try {
    const getUserResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    const data: Google.UserResponse = await getUserResponse.json();
    console.log(`[provider user data], ${JSON.stringify(data)}`, "info");
    return data;
  } catch (e: any) {
    console.log(`[error], ${JSON.stringify(e.stack)}`, "error");
    throw new Error("There was an error fetching the user");
  }
}

export default async function callback({
  options,
  request,
}: BaseProvider.CallbackOptions): Promise<Google.CallbackResponse> {
  const query = new URL(request.url).searchParams;
  const code = query.get("code");
  if (!code) {
    throw new Error("No code is passed!");
  }
  const tokens = await getTokensFromCode(code, options);
  const accessToken = tokens.access_token;
  const providerUser = await getUser(accessToken);
  return {
    user: providerUser,
    tokens,
  };
}
