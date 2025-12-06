# genSvgAnimateTransform

生成 SVG 动画标签的 React 工具函数（分发器）。

包含：
- 浮动动画（`<animateTransform>` - translate）
- 呼吸动画（`<animate>` - opacity）
- 缩放动画（`<animateTransform>` - scale）

## 使用示例

### 基础浮动动画

```tsx
import { genSvgAnimateTransformFloat } from '@/utils/genSvgAnimateTransform';

// 生成默认的上下浮动动画
const floating = genSvgAnimateTransformFloat();

console.log(floating);
// 输出:
// <animateTransform
//   attributeName="transform"
//   type="translate"
//   values="0 20;0 -20;0 20"
//   repeatCount="indefinite"
//   calcMode="spline"
//   keySplines="0.24 0 0.24 1;0.24 0 0.24 1"
//   dur="4s"
// />
```

### 自定义浮动参数

```tsx
// 自定义浮动范围和时长
const customFloating = genSvgAnimateTransformFloat({
  floatRangeY: 30,      // 垂直浮动范围 30px
  floatRangeX: 10,      // 水平浮动范围 10px
  duration: 3,          // 持续时间 3 秒
  keySplines: '0.42 0 0.58 1',  // 自定义缓动曲线
});

// 有限次数重复
const limitedFloating = genSvgAnimateTransformFloat({
  infinite: false,
  repeatCount: 5,       // 重复 5 次
  delay: 1,             // 延迟 1 秒开始
});
```

### 使用预设

```tsx
import { floatingPresets } from '@/utils/genSvgAnimateTransform';

// 轻微浮动
const gentle = floatingPresets.gentle();

// 快速浮动
const fast = floatingPresets.fast();

// 左右摇摆
const sway = floatingPresets.sway();
```

### 自定义关键帧动画

```tsx
import { genSvgAnimateTransformCustom } from '@/utils/genSvgAnimateTransform';

// 复杂的移动路径
const complexMove = genSvgAnimateTransformCustom({
  type: 'translate',
  values: ['0 0', '100 0', '100 100', '0 100', '0 0'],  // 方形路径
  keySplines: [
    '0.42 0 0.58 1',
    '0.42 0 0.58 1',
    '0.42 0 0.58 1',
    '0.42 0 0.58 1',
  ],
  duration: 8,
});

// 旋转动画
const rotate = genSvgAnimateTransformCustom({
  type: 'rotate',
  values: ['0 50 50', '360 50 50'],  // 围绕中心旋转
  duration: 2,
});

// 缩放动画
const scale = genSvgAnimateTransformCustom({
  type: 'scale',
  values: ['1', '1.5', '1'],  // 放大缩小
  duration: 2,
});
```

## API

### genSvgAnimateTransformFloat(options?)

生成上下/左右浮动的平移动画。

**参数（FloatOptions）：**
- `floatRangeY?`: Y轴浮动范围（像素），默认 `20`
- `floatRangeX?`: X轴浮动范围（像素），默认 `0`
- `duration?`: 动画时长（秒），默认 `4`
- `keySplines?`: 缓动曲线，默认 `'0.24 0 0.24 1'`
- `infinite?`: 是否无限循环，默认 `true`
- `repeatCount?`: 重复次数，默认 `1`
- `delay?`: 初始延迟（秒），默认 `0`

**返回：** `string` - `<animateTransform>` 标签字符串

### genSvgAnimateTransformCustom(options)

生成自定义关键帧的变换动画。

**参数（CustomTransformOptions）：**
- `type?`: 变换类型（'translate' | 'rotate' | 'scale' | 'skewX' | 'skewY'），默认 `'translate'`
- `values`: 关键帧值数组（必填）
- `duration?`: 动画时长（秒），默认 `4`
- `keySplines?`: 贝塞尔曲线数组（长度应为 values.length - 1）
- `infinite?`: 是否无限循环，默认 `true`
- `repeatCount?`: 重复次数，默认 `1`
- `delay?`: 初始延迟（秒），默认 `0`

**返回：** `string` - `<animateTransform>` 标签字符串

### floatingPresets

预设的浮动效果对象：
- `gentle()` - 轻微浮动（10px，3秒）
- `normal()` - 标准浮动（20px，4秒）
- `strong()` - 强烈浮动（40px，5秒）
- `fast()` - 快速浮动（20px，2秒）
- `slow()` - 慢速浮动（20px，6秒）
- `sway()` - 左右摇摆（30px，3秒）
- `diagonal()` - 对角线浮动（15px，4秒）

---

## 呼吸动画

### 基础用法

```tsx
import { genSvgAnimateBreathe } from '@/utils/genSvgAnimateTransform';

// 生成默认的呼吸动画
const breathing = genSvgAnimateBreathe();

// 在 JSX 中使用
<svg>
  <g>
    {genSvgAnimateBreathe({ duration: 1.2 })}
    <circle cx="50" cy="50" r="30" fill="red" />
  </g>
</svg>
```

### 自定义参数

```tsx
// 自定义透明度范围和时长
const customBreathe = genSvgAnimateBreathe({
  minOpacity: 0.3,      // 最小透明度
  maxOpacity: 1,        // 最大透明度
  duration: 2,          // 持续时间 2 秒
  keySplines: '0.42 0 0.58 1',  // 自定义缓动曲线
});

// 有限次数重复
const limitedBreathe = genSvgAnimateBreathe({
  infinite: false,
  repeatCount: 3,       // 重复 3 次
  delay: 0.5,           // 延迟 0.5 秒开始
});
```

### 使用预设

```tsx
import { breathePresets } from '@/utils/genSvgAnimateTransform';

// 轻柔呼吸
const gentle = breathePresets.gentle();

// 深度呼吸
const deep = breathePresets.deep();

// 闪烁效果
const blink = breathePresets.blink();
```

### genSvgAnimateBreathe(options?)

生成透明度变化的呼吸动画。

**参数（BreatheOptions）：**
- `maxOpacity?`: 最大透明度，默认 `1`
- `minOpacity?`: 最小透明度，默认 `0.2`
- `duration?`: 动画时长（秒），默认 `1.2`
- `keySplines?`: 缓动曲线，默认 `'0.45 0 0.55 1'`
- `infinite?`: 是否无限循环，默认 `true`
- `repeatCount?`: 重复次数，默认 `1`
- `delay?`: 初始延迟（秒），默认 `0`

**返回：** `JSX.Element` - React `<animate>` 元素

### breathePresets

预设的呼吸效果对象：
- `gentle()` - 轻柔呼吸（0.5-1，2秒）
- `normal()` - 标准呼吸（0.2-1，1.2秒）
- `deep()` - 深度呼吸（0.1-1，2.5秒）
- `fast()` - 快速呼吸（0.3-1，0.8秒）
- `slow()` - 慢速呼吸（0.2-1，3秒）
- `subtle()` - 微弱呼吸（0.7-1，2秒）
- `blink()` - 闪烁效果（0-1，0.5秒）

---

## 缩放动画

### ⚠️ 重要说明：中心缩放

**`<animateTransform>` 默认以坐标原点 (0,0) 为中心缩放，不是图形的中心！**

要实现中心缩放，需要配合 CSS 的 `transform-origin` 和 `transform-box` 属性：

```tsx
import { genSvgAnimateTransformScale, getCenterScaleStyle } from '@/utils/genSvgAnimateTransform';

// ✅ 推荐：使用 getCenterScaleStyle() 辅助函数
<svg>
  <g style={getCenterScaleStyle()}>
    {genSvgAnimateTransformScale({ toScale: 1.2 })}
    <rect width="100" height="100" fill="blue" />
  </g>
</svg>

// 或者手动设置样式
<svg>
  <g style={{ transformOrigin: 'center', transformBox: 'fill-box' }}>
    {genSvgAnimateTransformScale({ toScale: 1.2 })}
    <rect width="100" height="100" fill="blue" />
  </g>
</svg>
```

### 基础用法

```tsx
import { genSvgAnimateTransformScale } from '@/utils/genSvgAnimateTransform';

// 生成点击触发的缩放动画
const scale = genSvgAnimateTransformScale();

// ⚠️ 注意：不设置 style 会以左上角为中心缩放
<svg>
  <g>
    {genSvgAnimateTransformScale({ toScale: 1.2, duration: 0.5 })}
    <rect width="100" height="100" fill="blue" />
  </g>
</svg>
```

### 自定义参数

```tsx
// 自定义缩放范围和触发方式
const customScale = genSvgAnimateTransformScale({
  fromScale: 1,           // 初始大小
  toScale: 1.5,           // 目标大小（放大到 1.5 倍）
  duration: 0.8,          // 持续时间 0.8 秒
  begin: 'click',         // 点击触发
  freeze: true,           // 保持最终状态
  keySplines: '0.42 0 0.58 1',  // 缓动曲线
});

// 自动触发（延迟开始）
const autoScale = genSvgAnimateTransformScale({
  toScale: 1.3,
  begin: 1.5,             // 1.5秒后自动开始
  duration: 1,
});

// 无限循环缩放
const loopScale = genSvgAnimateTransformScale({
  fromScale: 1,
  toScale: 1.2,
  duration: 2,
  infinite: true,
  freeze: false,          // 不保持最终状态（以便循环）
});

// 缩小效果
const shrinkScale = genSvgAnimateTransformScale({
  fromScale: 1,
  toScale: 0.8,           // 缩小到 0.8 倍
  duration: 0.5,
});
```

### 使用预设

```tsx
import { scalePresets } from '@/utils/genSvgAnimateTransform';

// 轻微放大
const gentle = scalePresets.growGentle();

// 标准放大
const normal = scalePresets.growNormal();

// 弹性放大（带回弹效果）
const bounce = scalePresets.bounce();

// 自动放大
const auto = scalePresets.autoGrow();

// 呼吸缩放（无限循环）
const breathe = scalePresets.breathe();
```

### getCenterScaleStyle(origin?)

获取中心缩放所需的样式对象。

**参数：**
- `origin?`: 变换原点，默认 `'center'`，也可以是自定义值如 `'50% 50%'` 或 `'100 100'`

**返回：** `React.CSSProperties` - 包含 `transformOrigin` 和 `transformBox` 的样式对象

**使用示例：**
```tsx
// 基础用法
<g style={getCenterScaleStyle()}>
  {genSvgAnimateTransformScale({ toScale: 1.5 })}
  <circle cx="50" cy="50" r="30" fill="red" />
</g>

// 自定义原点
<g style={getCenterScaleStyle('top left')}>
  {genSvgAnimateTransformScale({ toScale: 1.5 })}
  <rect width="100" height="100" fill="blue" />
</g>
```

### genSvgAnimateTransformScale(options?)

生成缩放变换动画。

**⚠️ 重要：** 此函数生成的动画默认以坐标原点 (0,0) 为中心。要实现中心缩放，请在父元素上使用 `getCenterScaleStyle()` 或手动设置 CSS 样式。

**参数（ScaleOptions）：**
- `fromScale?`: 初始缩放比例，默认 `1`
- `toScale?`: 目标缩放比例，默认 `1.2`
- `duration?`: 动画时长（秒），默认 `1`
- `keySplines?`: 缓动曲线，默认 `'0.42 0 0.58 1'`
- `freeze?`: 是否保持最终状态，默认 `true`
- `begin?`: 触发方式，默认 `'click'`（点击触发），也可以是数字表示延迟秒数
- `additive?`: 是否累加变换（与其他变换组合），默认 `false`
- `infinite?`: 是否无限循环，默认 `false`
- `repeatCount?`: 重复次数，默认 `1`

**返回：** `JSX.Element` - React `<animateTransform>` 元素

### scalePresets

预设的缩放效果对象：
- `growGentle()` - 轻微放大（1.1倍，0.3秒）
- `growNormal()` - 标准放大（1.2倍，0.5秒）
- `growStrong()` - 强烈放大（1.5倍，0.8秒）
- `growFast()` - 快速放大（1.3倍，0.2秒）
- `shrink()` - 缩小效果（0.8倍，0.5秒）
- `bounce()` - 弹性放大（1.3倍，带回弹）
- `autoGrow()` - 自动放大（0.5秒后自动触发）
- `breathe()` - 呼吸缩放（1-1.1倍，无限循环）

---

## 原理说明

### animateTransform（浮动动画）
通过定义关键帧值实现平移、旋转、缩放等变换动画。

关键参数：
- `values`: 定义关键帧位置，格式为 `"x1 y1;x2 y2;x3 y3"`
- `keySplines`: 定义相邻关键帧间的贝塞尔缓动曲线（需要 n-1 段）
- `calcMode="spline"`: 启用贝塞尔曲线插值
- `repeatCount="indefinite"`: 无限循环播放

### animate（呼吸动画）
通过改变 `opacity` 属性实现透明度渐变的呼吸效果。

关键参数：
- `attributeName="opacity"`: 动画化透明度属性
- `values`: 定义透明度关键帧，格式为 `"1;0.2;1"`（完全显示→淡出→完全显示）
- 同样支持 `keySplines` 和 `calcMode` 实现平滑过渡

### animateTransform（缩放动画）
通过定义 scale 变换实现放大缩小效果。

关键参数：
- `type="scale"`: 缩放类型变换
- `values`: 定义缩放比例，格式为 `"1;1.2"`（原始大小→放大到1.2倍）
- `begin`: 触发时机，可以是 `"click"`（点击）、`"0.5s"`（延迟）等
- `fill="freeze"`: 保持最终状态（常用于点击触发的效果）
- `additive="sum"`: 累加变换（可与其他变换组合使用）

