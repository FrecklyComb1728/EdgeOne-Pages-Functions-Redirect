import { findRedirectRule } from './utils/redirect-config.js';

export default {
  async onRequest(context) {
    // 获取请求的主机名
    const host = context.request.headers.get('host');
    
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
  }
}