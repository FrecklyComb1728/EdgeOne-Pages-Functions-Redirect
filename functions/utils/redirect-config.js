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
  try {
    // 检查输入参数
    if (!host || typeof host !== 'string') {
      return null;
    }
    
    // 查找精确匹配的重定向规则
    let rule = redirectRules.find(r => r.source === host);
    
    // 如果没有精确匹配，查找通配符匹配
    if (!rule) {
      rule = redirectRules.find(r => {
        if (typeof r.source === 'string' && r.source.startsWith('*.') && host.endsWith(r.source.substring(1))) {
          return true;
        }
        return false;
      });
    }
    
    return rule || null;
  } catch (error) {
    // 发生错误时返回null
    return null;
  }
}