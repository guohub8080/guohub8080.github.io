/**
 * genSvgKeys 测试
 */

import { genSvgKeys } from './genSvgKeys.ts';

console.log('=== genSvgKeys 测试 ===\n');

// 测试 1: 基本功能
console.log('测试 1: 基本功能');
try {
  const result = genSvgKeys({
    initValue: 0,
    timeline: [
      { keySplines: '0.42 0 0.58 1', toValue: 100, timeSpanSec: 2 },
      { keySplines: '0 0 0.58 1', toValue: 200, timeSpanSec: 3 }
    ]
  });
  console.log('✓ 成功');
  console.log('  keyTimes:', result.keyTimes);
  console.log('  keySplines:', result.keySplines);
  console.log('  values:', result.values);
  console.log('  totalDuration:', result.totalDuration);
  console.log('');
} catch (error) {
  console.log('✗ 失败:', error);
}

// 测试 2: 字符串值（颜色）
console.log('测试 2: 字符串值（颜色）');
try {
  const result = genSvgKeys({
    initValue: '#ff0000',
    timeline: [
      { keySplines: '0.25 0.1 0.25 1', toValue: '#00ff00', timeSpanSec: 2 },
      { keySplines: '0.25 0.1 0.25 1', toValue: '#0000ff', timeSpanSec: 2 }
    ]
  });
  console.log('✓ 成功');
  console.log('  values:', result.values);
  console.log('');
} catch (error) {
  console.log('✗ 失败:', error);
}

// 测试 3: 单个时间段
console.log('测试 3: 单个时间段');
try {
  const result = genSvgKeys({
    initValue: 0,
    timeline: [
      { keySplines: '0 0 1 1', toValue: 100, timeSpanSec: 5 }
    ]
  });
  console.log('✓ 成功');
  console.log('  keyTimes:', result.keyTimes);
  console.log('  keySplines:', result.keySplines);
  console.log('  values:', result.values);
  console.log('  totalDuration:', result.totalDuration);
  console.log('');
} catch (error) {
  console.log('✗ 失败:', error);
}

// 测试 4: 多个时间段（呼吸效果）
console.log('测试 4: 多个时间段（呼吸效果）');
try {
  const result = genSvgKeys({
    initValue: 1,
    timeline: [
      { keySplines: '0.42 0 0.58 1', toValue: 1.2, timeSpanSec: 1 },
      { keySplines: '0.42 0 0.58 1', toValue: 1, timeSpanSec: 1 }
    ]
  });
  console.log('✓ 成功');
  console.log('  keyTimes:', result.keyTimes);
  console.log('  keySplines:', result.keySplines);
  console.log('  values:', result.values);
  console.log('  totalDuration:', result.totalDuration);
  console.log('');
} catch (error) {
  console.log('✗ 失败:', error);
}

// 测试 5: 错误处理 - 空 timeline
console.log('测试 5: 错误处理 - 空 timeline');
try {
  genSvgKeys({
    initValue: 0,
    timeline: []
  });
  console.log('✗ 应该抛出错误但没有');
} catch (error) {
  console.log('✓ 正确抛出错误:', (error as Error).message);
  console.log('');
}

// 测试 6: 错误处理 - 无效的 keySplines
console.log('测试 6: 错误处理 - 无效的 keySplines');
try {
  genSvgKeys({
    initValue: 0,
    timeline: [
      { keySplines: 'invalid', toValue: 100, timeSpanSec: 2 }
    ]
  });
  console.log('✗ 应该抛出错误但没有');
} catch (error) {
  console.log('✓ 正确抛出错误:', (error as Error).message);
  console.log('');
}

// 测试 7: 错误处理 - 总时长为 0
console.log('测试 7: 错误处理 - 总时长为 0');
try {
  genSvgKeys({
    initValue: 0,
    timeline: [
      { keySplines: '0 0 1 1', toValue: 100, timeSpanSec: 0 }
    ]
  });
  console.log('✗ 应该抛出错误但没有');
} catch (error) {
  console.log('✓ 正确抛出错误:', (error as Error).message);
  console.log('');
}

// 测试 8: keyTimes 计算精度
console.log('测试 8: keyTimes 计算精度');
try {
  const result = genSvgKeys({
    initValue: 0,
    timeline: [
      { keySplines: '0 0 1 1', toValue: 33, timeSpanSec: 1 },
      { keySplines: '0 0 1 1', toValue: 66, timeSpanSec: 1 },
      { keySplines: '0 0 1 1', toValue: 100, timeSpanSec: 1 }
    ]
  });
  console.log('✓ 成功');
  console.log('  keyTimes:', result.keyTimes);
  console.log('  预期: 0.000000;0.333333;0.666667;1.000000');
  console.log('');
} catch (error) {
  console.log('✗ 失败:', error);
}

console.log('=== 测试完成 ===');


