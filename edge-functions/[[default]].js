import redirectRules from './redirect-rules.json';

export function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const host = url.hostname;
  const path = url.pathname;
  
  let matchedRule = null;
  let defaultRule = null;
  
  for (const rule of redirectRules) {
    if (rule.default === true) {
      defaultRule = rule;
      continue;
    }
    
    if (!rule.domain) {
      continue;
    }
    
    if (rule.domain === host && rule.path && path === rule.path) {
      matchedRule = rule;
      break;
    }
  }
  
  if (matchedRule) {
    let destination = matchedRule.destination;
    
    if (url.search) {
      destination += url.search;
    }
    
    return Response.redirect(destination, matchedRule.statusCode || 302);
  }
  
  if (defaultRule) {
    return Response.redirect(defaultRule.destination, defaultRule.statusCode || 302);
  }
  
  return new Response('Not Found', { status: 404 });
}
