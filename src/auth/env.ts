import { Context } from "hono";
import { KVNamespace } from "@cloudflare/workers-types";
import { OAuthConfig } from "~/types/provider.types";

// 定义环境变量的类型
interface Bindings {
  oauth_settings: KVNamespace;
}

export async function getOAuthConfig(
  c: Context<{ Bindings: Bindings }>
): Promise<OAuthConfig> {
  const domain = new URL(c.req.url).host;
  const config = await c.env.oauth_settings.get<OAuthConfig | null>(
    domain,
    "json"
  );
  if (!config) {
    throw new Error("No config found for domain");
  }
  return config;
}
