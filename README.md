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

注意：

- `source` 为字符串比较；支持 `*.` 前缀的简单通配（仅匹配子域）。
- `destination` 不会自动去重斜杠，规则编写时请使用不带尾部路径的域名（如 `https://example.com`）。

## 本地开发与调试

需要安装并使用 EdgeOne / pages 本地开发工具（你当前项目使用 `edgeone pages dev`）：

1. 在项目根运行开发服务器：

```powershell
edgeone pages dev
```

2. 在另一个终端使用 curl 或浏览器访问本地函数，并传入不同的 Host 头以测试匹配：

```powershell
# 使用 Host 头模拟请求
curl -v -H "Host: www.edison.ink" http://localhost:8088/
curl -v -H "Host: cute.edison.ink" http://localhost:8088/
curl -v -H "Host: 127.0.0.1:8088" http://localhost:8088/
```

如果返回带 `Location` 的响应并且状态码符合规则，则为正确行为。

## 部署

将 `edge-functions/` 目录部署到支持 EdgeOne / Pages 的平台。确保入口为命名导出 `onRequest`（而不是 default 对象），否则运行时会出现 `ReferenceError: onRequest is not defined`。

## 建议的改进（可选）

- 添加规则校验脚本，启动时验证 `redirect-rules.json` 的正确性（缺失字段、错误 URL、冲突规则等）。
- 将规则转换成更高效的数据结构（如 Map）用于生产环境以加速查找。
- 为常用场景添加测试（例如：精确匹配、通配符匹配、带端口的 host、缺失 Host header）。
- 在 CI 中加入 lint/格式和简单的集成测试，保证入口函数签名正确。

## 变更记录（本仓库当前修改）

- 将 `export default { onRequest }` 改为顶层命名导出 `export async function onRequest(context)`，解决运行时报 `onRequest is not defined` 的错误。
- 增强 host 解析（从 Host 头/URL 中获取并规范化），支持端口剥离与小写比较。
- 在本地 dev wrapper 中拦截 `/.well-known/` 前缀请求以减少无用日志。

---

如果你希望我把 README 翻译为英文、添加 CI 示例（GitHub Actions）、或为规则添加校验脚本，我可以继续实现这些改进。要继续哪一项？
