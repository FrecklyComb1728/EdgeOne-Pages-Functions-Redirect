import { findRedirectRule } from './utils/redirect-config.js';

export default {
  async onRequest(context) {
    try {
      // 获取请求的主机名（优先从 Host 头；若缺失则从 URL 回退获取）
      let host = context.request.headers.get('host');

      // 当 Host 头不可用时，尝试从请求 URL 中解析 hostname 作为回退
      if (!host) {
        try {
          const parsedUrl = new URL(context.request.url);
          host = parsedUrl.hostname;
        } catch (e) {
          // 如果 URL 无法解析，则保持 host 为 undefined/null
          host = null;
        }
      }

      // 检查host是否存在
      if (!host) {
        return new Response('Bad Request: Missing Host header and unable to resolve from URL', { status: 400 });
      }

      // --- headers 遍历示例（只做演示，不改变重定向逻辑） ---
      // edge 环境对 Headers 做了扩展，支持 entries(), forEach(), getSetCookie() 等方法。
      const reqHeaders = context.request.headers;


      // 查找匹配的重定向规则
      const redirectRule = findRedirectRule(host);

      // 如果找到匹配规则，则执行重定向
      if (redirectRule) {
        // 处理路径传递
        const url = new URL(context.request.url);
        const destination = redirectRule.destination + url.pathname + url.search;

        return new Response(null, {
          status: redirectRule.statusCode,
          headers: {
            'Location': destination
          }
        });
      }

      // 如果没有匹配的规则，继续处理其他请求（例如静态资源）
      return new Response('没有匹配的路径', { status: 404 });
    } catch (error) {
      // 错误处理
      return new Response('服务器内部错误', { status: 500 });
    }
  }
}