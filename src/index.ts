import { Hono } from "hono";

import authGoogleRedirect from "./auth/google/redirect";
import authGoogleCallback from "./auth/google/callback";

const app = new Hono();

app.get("/oauth/google/redirect", authGoogleRedirect);
app.get("/oauth/google/callback", authGoogleCallback);

export default app;
