# EdgeOne Pages Edge-functions 重定向服务

基于腾讯云EdgeOne Pages Edge-functions实现的灵活域名重定向服务。

## 功能特点

- 支持基于域名的重定向
- 支持基于域名+路径的重定向
- 支持默认重定向规则
- 自动保留查询参数
- 可配置HTTP状态码(301/302)

## 配置说明

在`edge-functions/redirect-rules.json`中配置重定向规则：

```json
[
  {
    "default": true, 
    "destination": "https://example.com",
    "statusCode": 302
  },
  {
    "domain": "example.com",
    "destination": "https://new-example.com",
    "statusCode": 301
  },
  {
    "domain": "example.org",
    "path": "/special",
    "destination": "https://special.example.org",
    "statusCode": 302
  }
]
```

### 规则说明

1. 只配置`domain`：访问该域名时重定向到目标网站，路径会被保留
2. 同时配置`domain`和`path`：需同时匹配域名和路径才重定向
3. 配置`default`为`true`：当没有匹配规则时使用的默认重定向
4. `statusCode`：HTTP重定向状态码，301(永久)或302(临时)

## 部署方法

1. 克隆本仓库
2. 修改`edge-functions/redirect-rules.json`配置文件
3. 使用EdgeOne Pages部署服务

## 实现原理

- `index.js`：处理纯域名重定向和默认规则
- `[[default]].js`：处理域名+路径重定向和默认规则