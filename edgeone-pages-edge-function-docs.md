## 路由 
Edge Functions 基于 /edge-functions 目录结构生成访问路由。您可在项目仓库 /edge-functions 目录下创建任意层级的子目录，参考下述示例。
```
...
edge-functions
├── index.js
├── hello-pages.js
├── helloworld.js
├── api
    ├── users
      ├── list.js
      ├── geo.js
      ├── [id].js
    ├── visit
      ├── index.js
    ├── [[default]].js
...
```
上述目录文件结构，经 EdgeOne Pages 平台构建后将生成以下路由。这些路由将 Pages URL 映射到 /edge-functions 文件，当客户端访问 URL 时将触发对应的文件代码被运行：
| 文件路径 | 路由 |
| ------- | ------- |
| /edge-functions/index.js | example.com/ |
| /edge-functions/hello-pages.js | example.com/hello-pages |
| /edge-functions/helloworld.js | example.com/helloworld |
| /edge-functions/api/users/list.js | example.com/api/users/list |
| /edge-functions/api/users/geo.js | example.com/api/users/geo |
| /edge-functions/api/users/[id].js | example.com/api/users/{id} |
| /edge-functions/api/visit/index.js | example.com/api/visit/ |
| /edge-functions/api/[[default]].js | example.com/api/{path} |


> - 路由尾部斜杠 / 是可选。/hello-pages 和 /hello-pages/ 将被路由到 /edge-functions/hello-pages.js。
> - 如果没有匹配到 Edge Functions 路由，客户端请求将被路由到 Pages 对应的静态资源。
> - 路由大小写敏感，/helloworld 将被路由到 /edge-functions/helloworld.js，不能被路由到 /edge-functions/HelloWorld.js

## 动态路由
Edge Functions 支持动态路由，上述示例中一级动态路径 /edge-functions/api/users/[id].js，多级动态路径 /edge-functions/api/[[default]].js。参考下述用法：
| 文件路径 | 路由 | 匹配 |
| ------- | ------- | ------- |
| /edge-functions/api/users/[id].js | example.com/api/users/1024 | 是 |
| /edge-functions/api/users/[id].js | example.com/api/users/vip/1024 | 否 |
| /edge-functions/api/users/[id].js | example.com/api/vip/1024 | 否 |
| /edge-functions/api/[[default]].js | example.com/api/1024 | 是 |
| /edge-functions/api/[[default]].js | example.com/api/books/list | 是 |
| /edge-functions/api/[[default]].js | example.com/v2/vip/1024 | 否 |

## Function Handlers
使用 Functions Handlers 可为 Pages 创建自定义请求处理程序，以及定义 RESTful API 实现全栈应用。支持下述的 Handlers 方法：
| Handlers 方法 | 描述 |
| ------- | ------- |
| onRequest(context: EventContext): Response Promise<Response> | 匹配 HTTP Methods (GET, POST, PATCH, PUT, DELETE, HEAD, OPTIONS) |
onRequestGet(context: EventContext): Response Promise<Response> | 匹配 HTTP Methods (GET) |
onRequestPost(context: EventContext): Response Promise<Response> | 匹配 HTTP Methods (POST) |

## EventContext 对象描述
context 是传递给 Function Handlers 方法的对象，包含下述属性：
> params：动态路由 /edge-functions/api/users/[id].js 参数值
```javascript
export function onRequestGet(context) {
  return new Response(`User id is ${context.params.id}`);
}
```
- env：Pages 环境变量
- waitUntil：(task: Promise<any>): void; 用于通知边缘函数等待 Promise 完成，可延长事件处理的生命周期
> request：客户端请求对象

Request 对象包含下述属性：
> Request 代表 HTTP 请求对象，基于 Web APIs 标准 Request 进行设计。
> 边缘函数中，可通过两种方式获得 Request 对象：
> - 使用 Request 构造函数创建一个 Request 对象，用于 Fetch API 的操作。
> - 使用 FetchEvent 对象 event.request，获得当前请求的 Request 对象。
### 构造函数
```javascript
const request = new Request(input: string | Request, init?: RequestInit)
```
### 参数
参数名称 | 类型 | 必填 | 说明
--- | --- | --- | ---
input | string / Request | 是 | URL 字符串或 Request 对象。
init | RequestInit | 否 | Request 对象初始化配置项。

### RequestInit
初始化 Request 对象的属性值选项。
属性名 | 类型 | 必填 | 默认值 | 说明
--- | --- | --- | --- | ---
method | string | 否 | GET | 请求方法 (GET、POST 等)。
headers | Headers | 否 | - | 请求头部信息。
body | string | 否 | - | 请求体。
redirect | string | 否 | follow | 重定向策略，支持 manual、error和 follow。
maxFollow | number | 否 | 12 | 最大可重定向次数。
version | string | 否 | HTTP/1.1 | HTTP 版本号。
copyHeaders | boolean | 否 | - | 非 Web APIs 标准选项，表示是否拷贝传入的 Request 对象的 headers。
eo | RequestInitEoProperties | 否 | - | 非 Web APIs 标准选项，用于控制边缘函数处理该请求的行为。

### RequestInitEoProperties
RequestInitEoProperties 是非 Web APIs 标准选项，用于控制边缘函数处理该请求的行为。
参数名称 | 类型 | 必填 | 说明
--- | --- | --- | ---
resolveOverride | string | 否 | 用于 fetch 请求下覆盖原有的域名解析, 支持指定域名或者 IP 地址。<br>IP 不允许带 scheme 以及端口号。<br>IPv6 无需使用方括号包裹。
image | ImageProperties | 否 | 图片处理参数配置项。
### 实例属性
body
```javascript
// request.body
readonly body: ReadableStream;
```
bodyUsed
```javascript
// request.bodyUsed
readonly bodyUsed: boolean;
```
headers
```javascript
// request.headers
readonly headers: Headers;
```
method
```javascript
// request.method
readonly method: string;
```
redirect
```javascript
// request.redirect
readonly redirect: string;
```
maxFollow
```javascript
// request.maxFollow
readonly maxFollow: number;
```
url
```javascript
// request.url
readonly url: string;
```
version
```javascript
// request.version
readonly version: string;
```
eo
```javascript
// request.eo
readonly eo: IncomingRequestEoProperties;
```