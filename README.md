# EdgeOne Functions Redirect

轻量的 Edge Functions 重定向示例，基于一个 JSON 规则表（`edge-functions/redirect-rules.json`）按 Host 做域名重定向。适合在 EdgeOne / Pages 平台本地开发与部署。

## 目录

- `edge-functions/index.js` - Edge 函数实现（入口为 `onRequest`）。
- `edge-functions/redirect-rules.json` - 重定向规则数组。

## 功能说明

当收到请求时，函数会：

- 解析请求 Host（优先 `Host` 头；若缺失则解析请求 URL）。
- 将 Host 规范化（小写并剥离端口）。
- 在规则数组中查找精确匹配或以 `*.` 开头的通配子域匹配，例如 `*.example.com` 可以匹配 `a.example.com`。
- 若匹配，则根据对应规则返回带 `Location` 头的重定向响应；否则返回 404。

## 规则格式 (edge-functions/redirect-rules.json)

规则是一个 JSON 数组，每项包含：

- `source` (string)：要匹配的主机名，例如 `www.edison.ink`、`*.example.com` 或包含端口的 `127.0.0.1:8088`。
- `destination` (string)：目标基础地址（不应包含路径查询），例如 `https://edison.ink`。
- `statusCode` (number)：重定向 HTTP 状态码，通常为 301 或 302。

示例：

```json
[
  { "source": "www.edison.ink", "destination": "https://edison.ink", "statusCode": 302 },
  { "source": "*.example.com", "destination": "https://example.com", "statusCode": 302 }
]
```

