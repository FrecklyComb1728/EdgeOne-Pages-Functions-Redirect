# EdgeOne Functions 重定向

这个项目提供了一个基于 EdgeOne Functions 的重定向解决方案，允许根据域名进行重定向，并支持自定义状态码。

## 功能特点

- 基于域名的重定向
- 支持自定义 HTTP 状态码（301、302 等）
- 支持通配符匹配（如 `*.example.com`）
- 路径保持：重定向时保留原始路径和查询参数

## 使用方法

有两种方式可以配置重定向规则：

### 方法一：使用 EdgeOne 控制台配置（推荐）

在项目根目录创建 [edgeone.json](file:///edgeone.json) 文件，添加重定向规则：

```json
{
  "redirects": [
    {
      "source": "www.edison.ink",
      "destination": "https://edison.ink",
      "statusCode": 302
    },
    {
      "source": "cute.edison.ink",
      "destination": "https://edison.ink",
      "statusCode": 302
    }
  ]
}
```

这种方法使用 EdgeOne 平台原生的重定向功能，性能更好且更稳定。

### 方法二：使用 Edge Functions 代码配置

编辑 [/edge-functions/utils/redirect-config.js](file:///edge-functions/utils/redirect-config.js) 文件中的 `redirectRules` 数组：

```javascript
[
  {
    "source": "example.com",
    "destination": "https://new-example.com",
    "statusCode": 301
  },
  {
    "source": "test.example.com",
    "destination": "https://test.new-example.com",
    "statusCode": 302
  },
  {
    "source": "*.oldsite.com",
    "destination": "https://newsite.com",
    "statusCode": 301
  }
]
```

### 重定向规则说明

- `source`: 源域名或路径，支持通配符（如 `*.example.com`）和参数（如 `/articles/:id`）
- `destination`: 目标 URL 或路径
- `statusCode`: HTTP 状态码（如 301 永久重定向，302 临时重定向）

### 部署

将代码推送到您的 EdgeOne Pages 仓库，平台会自动构建并部署函数。

## 工作原理

由于 [index.js](file:///edge-functions/index.js) 位于 [/edge-functions](file:///edge-functions) 目录的根目录下，它会拦截所有请求并检查是否需要重定向：

- 访问 `http://example.com/some/path?query=1` 将会重定向到 `https://new-example.com/some/path?query=1`（301重定向）
- 访问 `http://test.example.com/` 将会重定向到 `https://test.new-example.com/`（302重定向）
- 访问 `http://blog.oldsite.com/article/123` 将会重定向到 `https://newsite.com/article/123`（301重定向）

如果请求的域名没有匹配的重定向规则，函数将返回 404 错误，此时请求会被传递给 Pages 的静态资源处理。

## 自定义

您可以根据需要修改 [/edge-functions/utils/redirect-config.js](file:///edge-functions/utils/redirect-config.js) 中的规则，支持更多复杂的重定向需求。