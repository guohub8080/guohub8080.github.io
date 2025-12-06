# genSvgKeys 工具集

提供 SVG 动画参数生成相关的工具函数。

## genSvgKeys

将动画配置（初始值 + 时间线段）转换为 SVG 动画所需的关键参数（keyTimes、keySplines、values 等）。

### 功能描述

根据初始值和一系列时间线段（每段包含目标值、时间跨度和缓动曲线），自动生成 SVG 动画标签 `<animate>` 所需的 `keyTimes`（相对时间比例）、`keySplines`（贝塞尔缓动参数）、`values`（关键值）等参数，简化 SVG 复杂动画的开发。

### 使用示例

#### 基本用法

```typescript
import { genSvgKeys } from '@/utils/genSvgKeys';

const result = genSvgKeys({
  initValue: 0,
  timeline: [
    { keySpline: '0.42 0 0.58 1', toValue: 100, timeSpanSec: 2 },
    { keySpline: '0 0 0.58 1', toValue: 200, timeSpanSec: 3 }
  ]
});

console.log(result);
// {
//   keyTimes: "0.000000;0.400000;1.000000",
//   keySplines: "0.42 0 0.58 1;0 0 0.58 1",
//   values: "0;100;200",
//   totalDuration: 5
// }
```

#### 应用到 SVG 动画

```tsx
const animConfig = genSvgKeys({
  initValue: 0,
  timeline: [
    { keySpline: '0.42 0 0.58 1', toValue: 100, timeSpanSec: 2 },
    { keySpline: '0 0 1 1', toValue: 0, timeSpanSec: 1 }
  ]
});

return (
  <svg>
    <rect x="0" y="0" width="50" height="50" fill="red">
      <animate
        attributeName="x"
        keyTimes={animConfig.keyTimes}
        keySplines={animConfig.keySplines}
        values={animConfig.values}
        dur={`${animConfig.totalDuration}s`}
        calcMode="spline"
        repeatCount="indefinite"
      />
    </rect>
  </svg>
);
```

### API 文档

#### 类型定义

```typescript
interface SvgTimelineSegment {
  /** 贝塞尔缓动参数（格式："x1 y1 x2 y2"） */
  keySpline: string;
  /** 目标值 */
  toValue: string | number;
  /** 时间跨度（秒） */
  timeSpanSec: number;
}

interface SvgTimeline {
  /** 初始值 */
  initValue: string | number;
  /** 时间线段数组 */
  timeline: SvgTimelineSegment[];
}

interface SvgKeysResult {
  /** 相对时间比例字符串（分号分隔的 0~1 数字） */
  keyTimes: string;
  /** 贝塞尔参数字符串（分号分隔的贝塞尔组） */
  keySplines: string;
  /** 关键值字符串（分号分隔的 value） */
  values: string;
  /** 动画总时长（秒） */
  totalDuration: number;
}

function genSvgKeys(input: SvgTimeline): SvgKeysResult;
```

#### 参数说明

**输入参数 `SvgTimeline`**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `initValue` | `string \| number` | 是 | 动画的初始值 |
| `timeline` | `SvgTimelineSegment[]` | 是 | 时间线段数组，至少包含 1 个段 |

**时间线段 `SvgTimelineSegment`**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `keySpline` | `string` | 是 | 该段的贝塞尔缓动参数（格式："x1 y1 x2 y2"） |
| `toValue` | `string \| number` | 是 | 该段结束时的目标值 |
| `timeSpanSec` | `number` | 是 | 该段的持续时间（秒） |

**返回值 `SvgKeysResult`**

| 字段 | 类型 | 说明 |
|------|------|------|
| `keyTimes` | `string` | 相对时间比例字符串（分号分隔的 0~1 数字） |
| `keySplines` | `string` | 贝塞尔参数字符串（分号分隔的贝塞尔组） |
| `values` | `string` | 关键值字符串（分号分隔的 value） |
| `totalDuration` | `number` | 动画总时长（秒） |

### 核心特性

#### 1. 基于时间跨度

每个时间线段使用**相对时间跨度**（timeSpanSec）而不是绝对时间戳，更符合直觉：

```typescript
const config = genSvgKeys({
  initValue: 0,
  timeline: [
    { keySpline: '0 0 1 1', toValue: 50, timeSpanSec: 1 },   // 0-1秒：0→50
    { keySpline: '0 0 1 1', toValue: 100, timeSpanSec: 2 },  // 1-3秒：50→100
    { keySpline: '0 0 1 1', toValue: 0, timeSpanSec: 1 }     // 3-4秒：100→0
  ]
});
// totalDuration: 4 秒
```

#### 2. 自动计算 keyTimes

函数会根据每段的 `timeSpanSec` 自动计算相对时间比例：

```typescript
const config = genSvgKeys({
  initValue: 0,
  timeline: [
    { keySpline: '0 0 1 1', toValue: 100, timeSpanSec: 2 },  // 占总时长的 2/5
    { keySpline: '0 0 1 1', toValue: 200, timeSpanSec: 3 }   // 占总时长的 3/5
  ]
});
// keyTimes: "0.000000;0.400000;1.000000"
// (0秒=0, 2秒=0.4, 5秒=1)
```

#### 3. 值类型灵活

支持数字和字符串值（如颜色、路径等）：

```typescript
// 数字值
genSvgKeys({
  initValue: 0,
  timeline: [{ keySpline: '0 0 1 1', toValue: 100, timeSpanSec: 2 }]
});

// 颜色值
genSvgKeys({
  initValue: '#ff0000',
  timeline: [
    { keySpline: '0.25 0.1 0.25 1', toValue: '#00ff00', timeSpanSec: 2 },
    { keySpline: '0.25 0.1 0.25 1', toValue: '#0000ff', timeSpanSec: 2 }
  ]
});

// 路径值
genSvgKeys({
  initValue: 'M 0 0 L 100 0',
  timeline: [
    { keySpline: '0.42 0 0.58 1', toValue: 'M 0 0 L 100 100', timeSpanSec: 3 }
  ]
});
```

### 常见贝塞尔缓动参数

| 缓动类型 | keySpline 值 | 效果 |
|---------|-------------|------|
| 线性 | `"0 0 1 1"` | 匀速运动 |
| ease | `"0.25 0.1 0.25 1"` | 缓慢开始，然后加速，最后减速 |
| ease-in | `"0.42 0 1 1"` | 缓慢开始，然后加速 |
| ease-out | `"0 0 0.58 1"` | 快速开始，然后减速 |
| ease-in-out | `"0.42 0 0.58 1"` | 缓慢开始和结束 |
| 自定义 | `"x1 y1 x2 y2"` | 自定义贝塞尔曲线 |

### 使用场景

#### 场景 1：位置动画（来回移动）

```typescript
const xAnim = genSvgKeys({
  initValue: 0,
  timeline: [
    { keySpline: '0.42 0 0.58 1', toValue: 200, timeSpanSec: 2 },  // 右移
    { keySpline: '0.42 0 0.58 1', toValue: 0, timeSpanSec: 2 }     // 左移
  ]
});

<animate
  attributeName="x"
  keyTimes={xAnim.keyTimes}
  keySplines={xAnim.keySplines}
  values={xAnim.values}
  dur={`${xAnim.totalDuration}s`}
  calcMode="spline"
  repeatCount="indefinite"
/>
```

#### 场景 2：透明度动画（淡入淡出）

```typescript
const opacityAnim = genSvgKeys({
  initValue: 0,
  timeline: [
    { keySpline: '0 0 0.58 1', toValue: 1, timeSpanSec: 1 },    // 淡入
    { keySpline: '0 0 1 1', toValue: 1, timeSpanSec: 2 },       // 保持
    { keySpline: '0.42 0 1 1', toValue: 0, timeSpanSec: 1 }     // 淡出
  ]
});
```

#### 场景 3：颜色动画（彩虹效果）

```typescript
const colorAnim = genSvgKeys({
  initValue: '#ff0000',
  timeline: [
    { keySpline: '0.25 0.1 0.25 1', toValue: '#ffff00', timeSpanSec: 1 },
    { keySpline: '0.25 0.1 0.25 1', toValue: '#00ff00', timeSpanSec: 1 },
    { keySpline: '0.25 0.1 0.25 1', toValue: '#00ffff', timeSpanSec: 1 },
    { keySpline: '0.25 0.1 0.25 1', toValue: '#0000ff', timeSpanSec: 1 },
    { keySpline: '0.25 0.1 0.25 1', toValue: '#ff00ff', timeSpanSec: 1 },
    { keySpline: '0.25 0.1 0.25 1', toValue: '#ff0000', timeSpanSec: 1 }
  ]
});
```

#### 场景 4：缩放动画（呼吸效果）

```typescript
const scaleAnim = genSvgKeys({
  initValue: 1,
  timeline: [
    { keySpline: '0.42 0 0.58 1', toValue: 1.2, timeSpanSec: 1 },  // 放大
    { keySpline: '0.42 0 0.58 1', toValue: 1, timeSpanSec: 1 }     // 缩小
  ]
});

<animateTransform
  attributeName="transform"
  type="scale"
  keyTimes={scaleAnim.keyTimes}
  keySplines={scaleAnim.keySplines}
  values={scaleAnim.values}
  dur={`${scaleAnim.totalDuration}s`}
  calcMode="spline"
  repeatCount="indefinite"
/>
```

#### 场景 5：复杂组合动画

```typescript
const xAnim = genSvgKeys({
  initValue: 0,
  timeline: [
    { keySpline: '0.42 0 0.58 1', toValue: 100, timeSpanSec: 2 },
    { keySpline: '0.42 0 0.58 1', toValue: 200, timeSpanSec: 2 }
  ]
});

const yAnim = genSvgKeys({
  initValue: 0,
  timeline: [
    { keySpline: '0.42 0 0.58 1', toValue: 50, timeSpanSec: 1 },
    { keySpline: '0 0 1 1', toValue: 50, timeSpanSec: 2 },
    { keySpline: '0.42 0 0.58 1', toValue: 100, timeSpanSec: 1 }
  ]
});

const opacityAnim = genSvgKeys({
  initValue: 0,
  timeline: [
    { keySpline: '0 0 0.58 1', toValue: 1, timeSpanSec: 1 },
    { keySpline: '0 0 1 1', toValue: 1, timeSpanSec: 2 },
    { keySpline: '0.42 0 1 1', toValue: 0, timeSpanSec: 1 }
  ]
});

return (
  <svg>
    <circle cx="0" cy="0" r="10" fill="red">
      <animate
        attributeName="cx"
        keyTimes={xAnim.keyTimes}
        keySplines={xAnim.keySplines}
        values={xAnim.values}
        dur={`${xAnim.totalDuration}s`}
        calcMode="spline"
        repeatCount="indefinite"
      />
      <animate
        attributeName="cy"
        keyTimes={yAnim.keyTimes}
        keySplines={yAnim.keySplines}
        values={yAnim.values}
        dur={`${yAnim.totalDuration}s`}
        calcMode="spline"
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        keyTimes={opacityAnim.keyTimes}
        keySplines={opacityAnim.keySplines}
        values={opacityAnim.values}
        dur={`${opacityAnim.totalDuration}s`}
        calcMode="spline"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);
```

### 错误处理

函数会在以下情况抛出错误：

1. **缺少必填参数**
   - `timeline` 不是数组或为空数组

2. **参数格式错误**
   - `keySpline` 格式不是 "x1 y1 x2 y2"（4 个数字用空格分隔）

3. **逻辑错误**
   - 总时长为 0 或负数（所有 timeSpanSec 之和 ≤ 0）

### 技术细节

- **时间精度**：keyTimes 保留 6 位小数
- **贝塞尔验证**：自动验证贝塞尔参数格式（必须是 4 个有效数字）
- **时间累加**：自动累加每段的 timeSpanSec 计算总时长和相对时间

### 注意事项

1. **时间跨度必须为正数**：每个 timeSpanSec 应该大于 0
2. **SVG 属性兼容性**：确保使用的属性值格式符合 SVG 规范
3. **calcMode 必须为 "spline"**：使用 keySplines 时，SVG 的 calcMode 必须设置为 "spline"
4. **值的数量**：最终 values 的数量 = timeline.length + 1（包含初始值）

### 与传统方式对比

#### 传统写法（手动计算）

```tsx
<animate
  attributeName="x"
  keyTimes="0;0.333333;0.666667;1"
  keySplines="0.42 0 0.58 1;0 0 1 1;0.42 0 0.58 1"
  values="0;100;100;200"
  dur="6s"
  calcMode="spline"
  repeatCount="indefinite"
/>
```

#### 使用 genSvgKeys

```tsx
const anim = genSvgKeys({
  initValue: 0,
  timeline: [
    { keySpline: '0.42 0 0.58 1', toValue: 100, timeSpanSec: 2 },
    { keySpline: '0 0 1 1', toValue: 100, timeSpanSec: 2 },
    { keySpline: '0.42 0 0.58 1', toValue: 200, timeSpanSec: 2 }
  ]
});

<animate
  attributeName="x"
  keyTimes={anim.keyTimes}
  keySplines={anim.keySplines}
  values={anim.values}
  dur={`${anim.totalDuration}s`}
  calcMode="spline"
  repeatCount="indefinite"
/>
```

使用 `genSvgKeys` 的优势：
- ✅ 更直观：直接指定每段的时间跨度
- ✅ 更易维护：修改某段时间不影响其他段
- ✅ 更少出错：自动计算 keyTimes，避免手动计算错误
- ✅ 类型安全：TypeScript 类型检查
