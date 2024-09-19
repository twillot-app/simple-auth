# OAuth 2.0 Google via Cloudflare Workers

适合独立开发者使用的 Google 登录，基于 Cloudflare Workers 实现 OAuth 2.0。文档仓促，多多包含。

## Features

- 代码全靠抄！！！
- 删了大部分代码，仅保留谷歌登录
- 逻辑简单，一个链接跳转授权后返回业务方
- 一套服务支持多个域名，不同的域名使用不同的 OAuth 配置（在 Cloudflare 上连接多个域名即可）
- 支持 JWT 签名（废话）

## Cloudflare KV Settings

```toml
[[kv_namespaces]]
binding = "oauth_settings"
id = "xxxx"
```

## Google OAuth Settings

```typescript
interface OAuthConfig {
  googleClientId: string;
  googleClientSecret: string;
  googleCallbackUrl: string;
  jwtToken: string;
  successUrl: string;
  maxAgeInDays?: number;
}
```

将 json 文本内容保存到 Cloudflare KV 中，key 为 `oauth` 域名，示例如下：

```ini
oauth.example.com = {"googleClientId": "xxx", "googleClientSecret": "xxx", "googleCallbackUrl": "xxx", "jwtToken": "xxx", "successUrl": "xxx", "maxAgeInDays": 1}
```

## Usage

在页面中添加登录链接即可

```jsx
<a href="https://oauth.example.com/auth/google/redirect">
  Continue with Google
</a>
```

登录成功后会跳转到 `successUrl` 并附带 token 参数。
token 参数 decode 后的信息，参考 `src/auth/jwt.ts` 文件，根据需要自行 encode 定制。

## Credits

- [worker-auth-providers](https://github.com/subhendukundu/worker-auth-providers)

## User Cases

- https://www.twillot.com/
- https://www.shipsuperfast.com
