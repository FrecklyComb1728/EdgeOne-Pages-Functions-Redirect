import rules from './redirect-rules.json' assert { type: 'json' };

function normalizeHost(raw) {
  if (!raw || typeof raw !== 'string') return null;
  let host = raw.trim().toLowerCase();
  if (host.indexOf('://') !== -1) {
    try {
      host = new URL(host).hostname;
    } catch (e) {
    }
  }

  if (host.startsWith('[')) {
    const idx = host.indexOf(']');
    if (idx !== -1) {
      host = host.slice(1, idx);
    }
  } else {
    const colonIndex = host.lastIndexOf(':');
    if (colonIndex !== -1 && host.indexOf(':') === colonIndex) {
      host = host.slice(0, colonIndex);
    }
  }

  return host;
}

function findRedirectRule(host) {
  try {
    const normalized = normalizeHost(host);
    if (!normalized) return null;
    let rule = rules.find(r => {
      return typeof r.source === 'string' && normalizeHost(r.source) === normalized;
    });

    if (rule) return rule;

    rule = rules.find(r => {
      if (typeof r.source !== 'string') return false;
      const s = r.source.trim().toLowerCase();
      if (!s.startsWith('*.')) return false;
      const tail = s.substring(1);
      return normalized.endsWith(tail);
    });

    return rule || null;
  } catch (e) {
    return null;
  }
}

function buildDestination(destinationBase, requestUrl) {
  try {
    let base = destinationBase;
    if (!/^https?:\/\//i.test(base)) {
      base = 'https://' + base.replace(/:\/\//, '');
    }
    const req = new URL(requestUrl);
    const dest = new URL(req.pathname + req.search, base);
    return dest.toString();
  } catch (e) {
    return null;
  }
}

export async function onRequest(context) {
  try {
    // 获取请求的主机名（优先从 Host 头；若缺失则从 URL 回退获取）
    let rawHost = context.request.headers.get('host');

    if (!rawHost) {
      try {
        const parsedUrl = new URL(context.request.url);
        rawHost = parsedUrl.host || parsedUrl.hostname;
      } catch (e) {
        rawHost = null;
      }
    }

    const host = normalizeHost(rawHost);
    if (!host) {
      return new Response('请求头中缺失 Host 字段，无法进行重定向。', { status: 400 });
    }

    const redirectRule = findRedirectRule(host);
    if (redirectRule) {
      const destination = buildDestination(redirectRule.destination, context.request.url);
      if (!destination) {
        return new Response('重定向目标构造失败', { status: 500 });
      }

      return new Response(null, {
        status: redirectRule.statusCode || 302,
        headers: {
          'Location': destination,
          'x-redirected-by': 'edgeone-redirect',
        }
      });
    }

    return new Response('没有匹配的路径', { status: 404 });
  } catch (error) {
    return new Response('服务器内部错误', { status: 500 });
  }
}