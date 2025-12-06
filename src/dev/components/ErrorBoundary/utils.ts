// 错误边界工具函数
import { UAParser } from 'ua-parser-js';

// 创建解析器实例
const parser = new UAParser();
const result = parser.getResult();

// 解析错误堆栈以提取文件路径、行号和列号
export const parseErrorStack = (stack: string) => {
  const lines = stack.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i === 0 && !line.includes('at ')) continue;
    
    const match = line.match(/(?:at\s+.*?\(|at\s+|@)(.+?):(\d+):(\d+)/);
    if (match) {
      return {
        source: match[1],
        line: parseInt(match[2], 10),
        column: parseInt(match[3], 10)
      };
    }
  }
  return { source: '', line: 0, column: 0 };
};

// 提取函数名
export const extractFunctionName = (stack: string): string => {
  const lines = stack.split('\n');
  for (const line of lines) {
    if (line.includes('at ')) {
      const match = line.match(/at\s+(?:.*?\.)?(\w+)\s*\(/);
      if (match) {
        return match[1];
      }
    }
  }
  return '未知函数';
};

// 从组件堆栈中提取组件名称
export const extractComponentNameFromStack = (componentStack: string): string => {
  const lines = componentStack.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('at ')) {
      const match = trimmed.match(/at\s+(\w+)\s*\(/);
      if (match) {
        return match[1];
      }
    }
  }
  return 'Unknown';
};

// 格式化组件堆栈
export const formatComponentStack = (componentStack: string): string => {
  const componentName = extractComponentNameFromStack(componentStack);
  
  const description = `The above error occurred in the <${componentName}> component:`;
  const stackLines = componentStack
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (trimmed === '') return '';
      if (trimmed.startsWith('at ')) {
        return '    at ' + trimmed.substring(3);
      }
      return trimmed;
    })
    .filter(line => line.length > 0);
  
  return [description, ...stackLines].join('\n');
};

// 获取设备类型
export const getDeviceType = (): string => {
  const device = result.device;
  if (device.type === 'mobile') return 'Mobile';
  if (device.type === 'tablet') return 'Tablet';
  if (device.type === 'wearable') return 'Wearable';
  if (device.type === 'smarttv') return 'Smart TV';
  if (device.type === 'console') return 'Console';
  return 'Desktop';
};

// 获取操作系统信息
export const getOSInfo = (): string => {
  const os = result.os;
  const osName = os.name || 'Unknown';
  const osVersion = os.version || '';
  
  // Windows 10 和 11 在 User Agent 中都显示为 NT 10.0，无法区分
  // 所以统一显示为 Windows 10/11
  if (osName === 'Windows' && osVersion === '10') {
    return 'Windows 10/11';
  }
  
  return osVersion ? `${osName} ${osVersion}` : osName;
};

// 获取浏览器信息
export const getBrowserInfo = (): string => {
  const browser = result.browser;
  const browserName = browser.name || 'Unknown';
  const browserVersion = browser.version || '';
  return browserVersion ? `${browserName} ${browserVersion}` : browserName;
};

// 获取移动设备信息
export const getMobileInfo = (): string => {
  const device = result.device;
  
  // 只有移动设备或平板才显示设备信息
  if (device.type !== 'mobile' && device.type !== 'tablet') return '';
  
  const vendor = device.vendor || '';
  const model = device.model || '';
  
  if (vendor && model) {
    return `${vendor} ${model}`;
  } else if (vendor) {
    return vendor;
  } else if (model) {
    return model;
  }
  
  return '';
};

// 获取平台信息（微信、支付宝等）
export const getPlatformInfo = (): string => {
  const ua = navigator.userAgent.toLowerCase();
  
  // 检测各种平台
  if (ua.includes('micromessenger')) return '微信浏览器';
  if (ua.includes('alipay')) return '支付宝';
  if (ua.includes('dingtalk')) return '钉钉';
  if (ua.includes('weibo')) return '微博';
  if (ua.includes('qq') && !ua.includes('mqqbrowser')) return 'QQ';
  if (ua.includes('mqqbrowser')) return 'QQ浏览器';
  if (ua.includes('ucbrowser')) return 'UC浏览器';
  if (ua.includes('baidubrowser')) return '百度浏览器';
  if (ua.includes('sogou')) return '搜狗浏览器';
  if (ua.includes('quark')) return '夸克浏览器';
  
  return 'Web Browser';
};

// 生成错误报告文本
export const generateErrorReport = (error: {
  name: string;
  message: string;
  stack?: string;
  componentStack?: string;
  source?: string;
  line?: number;
  column?: number;
}): string => {
  return `
🚨 React 错误报告
==================

📋 错误信息
-----------
错误类型: ${error.name}
错误信息: ${error.message}

📍 错误位置
-----------
触发位置: ${error.source || 'N/A'}
触发函数: ${extractFunctionName(error.stack || '')}
行列数: 行 ${error.line || 'N/A'}, 列 ${error.column || 'N/A'}

🔍 错误堆栈
-----------
${error.stack || 'N/A'}

🧩 组件堆栈
-----------
${formatComponentStack(error.componentStack || 'N/A')}

📊 环境信息
-----------
设备类型: ${getDeviceType()}
操作系统: ${getOSInfo()}
浏览器: ${getBrowserInfo()}
平台: ${getPlatformInfo()}
${getMobileInfo() ? `设备型号: ${getMobileInfo()}` : ''}
当前 URL: ${window.location.href}
User Agent: ${navigator.userAgent}
  `.trim();
};

