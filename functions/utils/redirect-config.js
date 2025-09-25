// 重定向配置
export const redirectRules = [
  {
    "source": "www.edison.ink",
    "destination": "https://edison.ink",
    "statusCode": 302
  },
  {
    "source": "cute.edison.ink",
    "destination": "https://edison.ink",
    "statusCode": 302
  },
  {
    "source": "edison.mfawa.top",
    "destination": "https://edison.ink",
    "statusCode": 302
  }
];

export function findRedirectRule(host) {
  // 查找精确匹配的重定向规则
  let rule = redirectRules.find(r => r.source === host);
  
  // 如果没有精确匹配，查找通配符匹配
  if (!rule) {
    rule = redirectRules.find(r => {
      if (r.source.startsWith('*.') && host.endsWith(r.source.substring(1))) {
        return true;
      }
      return false;
    });
  }
  
  return rule;
}