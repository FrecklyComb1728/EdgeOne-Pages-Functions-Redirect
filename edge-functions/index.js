import rules from './redirect-rules.json' assert { type: 'json' };

function findRedirectRule(host) {
  try {
    if (!host || typeof host !== 'string') return null;

    let rule = rules.find(r => r.source === host);
    if (!rule) {
      rule = rules.find(r => typeof r.source === 'string' && r.source.startsWith('*.') && host.endsWith(r.source.substring(1)));
    }
    return rule || null;
  } catch (e) {
    return null;
  }
}

export async function onRequest(context) {
  try {
    // 获取请求的主机名（优先从 Host 头；若缺失则从 URL 回退获取）
    let host = context.request.headers.get('host');

    if (!host) {
      try {
        const parsedUrl = new URL(context.request.url);
        host = parsedUrl.hostname;
      } catch (e) {
        host = null;
      }
    }

    if (!host) {
      return new Response('Bad Request: Missing Host header and unable to resolve from URL', { status: 400 });
    }

    const redirectRule = findRedirectRule(host);

    if (redirectRule) {
      const url = new URL(context.request.url);
      const destination = redirectRule.destination + url.pathname + url.search;
      return new Response(null, {
        status: redirectRule.statusCode,
        headers: { 'Location': destination }
      });
    }

    return new Response('没有匹配的路径', { status: 404 });
  } catch (error) {
    return new Response('服务器内部错误', { status: 500 });
  }
}