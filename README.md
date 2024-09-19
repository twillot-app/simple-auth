# OAuth 2.0 Google via Cloudflare Workers

适合独立开发者使用的 Google 登录，基于 Cloudflare Workers 实现 OAuth 2.0。

## 特点

- COPY from [worker-auth-providers)](https://github.com/subhendukundu/worker-auth-providers)
- 删除了大部分代码，仅保留谷歌登录
- 总体逻辑简单，一个链接跳转成功后回到业务方
- 一套服务支持多个域名，在 Cloudflare 上连接多个域名即可
- 支持 JWT 签名（废话）

## Cloudflare KV 配置

```toml
[[kv_namespaces]]
binding = "oauth_settings"
id = "xxxx"
```

## Google OAuth 相关配置

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

## 使用

在页面中添加登录链接即可

```jsx
<a href="https://oauth.example.com/auth/google/redirect">
  Continue with Google
</a>
```

登录成功后会跳转到 `successUrl` 并附带 token 参数。
token 参数 decode 后的信息，参考 `src/auth/jwt.ts` 文件，根据需要自行 encode 定制。

## Credits

- [worker-auth-providers)](https://github.com/subhendukundu/worker-auth-providers)
