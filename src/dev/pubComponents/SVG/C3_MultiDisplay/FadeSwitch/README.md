# FadeSwitch 渐变切换组件

## 概述

`FadeSwitch` 是一个多图渐变切换组件，实现图片通过淡入淡出效果平滑切换。所有图片叠加在同一位置，通过 opacity 动画控制显示/隐藏，营造柔和的视觉过渡效果。

## 原理说明

### 核心机制

该组件基于 **SVG animate 元素**实现：

1. **图片叠加**：所有图片通过 `<foreignObject>` 叠加在同一位置（x=0, y=0）
2. **Opacity 动画**：每张图片有独立的 `<animate>` 元素控制 opacity 变化
3. **时间分段**：通过计算每张图的开始时间，实现依次淡入淡出的效果

### 动画时间线

每张图片的完整周期：

```
等待 → 淡入(fadeDuration) → 保持显示(stayDuration) → 淡出(fadeDuration) → 等待
```

- **等待阶段**：opacity = 0，等待轮到自己显示
- **淡入阶段**：opacity 从 0 → 1，使用 ease-in-out 缓动
- **保持阶段**：opacity = 1，完全显示
- **淡出阶段**：opacity 从 1 → 0，使用 ease-in-out 缓动
- **等待阶段**：opacity = 0，等待下一轮循环

### Values & KeyTimes 计算

假设有3张图片，总时长为10秒：

**图片1**：
- 开始时间：0s
- 淡入结束：0.5s (fadeDuration)
- 保持结束：2.5s (fadeDuration + stayDuration)
- 淡出结束：3s
- keyTimes: `0; 0; 0.05; 0.25; 0.3; 1`
- values: `0; 0; 1; 1; 0; 0`

**图片2**：
- 开始时间：2.5s (图1的结束时间)
- 淡入结束：3s
- 保持结束：5s
- 淡出结束：5.5s
- keyTimes: `0; 0.25; 0.3; 0.5; 0.55; 1`

**图片3**：
- 开始时间：5s
- 淡入结束：5.5s
- 保持结束：7.5s
- 淡出结束：8s
- keyTimes: `0; 0.5; 0.55; 0.75; 0.8; 1`

## 参数说明

### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `pics` | `Array<PicConfig>` | - | 图片配置数组 |
| `isCrossDissolve` | `boolean` | `true` | 是否交叉溶解（淡出和下一张淡入重叠） |
| `viewBoxW` | `number` | - | 画布宽度（可选，默认根据第一张图片自动计算） |
| `viewBoxH` | `number` | - | 画布高度（可选，默认根据第一张图片自动计算） |
| `mp` | `mpProps` | - | 边距样式配置 |

### PicConfig

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `url` | `string` | - | 图片地址（必填） |
| `fadeDuration` | `number` | `0.5` | 淡入/淡出的时长（秒） |
| `stayDuration` | `number` | `2` | 完全显示停留的时长（秒） |

## 使用示例

### 基本用法（默认交叉溶解）

```tsx
<FadeSwitch
    pics={[
        { url: pic1 },
        { url: pic2 },
        { url: pic3 },
    ]}
/>
```

### 自定义时长

```tsx
<FadeSwitch
    pics={[
        { url: pic1, fadeDuration: 0.8, stayDuration: 1.5 },
        { url: pic2, fadeDuration: 0.5, stayDuration: 2 },
        { url: pic3, fadeDuration: 1, stayDuration: 1 },
    ]}
/>
```

### 快速切换

```tsx
<FadeSwitch
    pics={[
        { url: pic1, fadeDuration: 0.3, stayDuration: 0.5 },
        { url: pic2, fadeDuration: 0.3, stayDuration: 0.5 },
        { url: pic3, fadeDuration: 0.3, stayDuration: 0.5 },
    ]}
/>
```

### 非交叉溶解模式

```tsx
<FadeSwitch
    pics={[
        { url: pic1 },
        { url: pic2 },
        { url: pic3 },
    ]}
    isCrossDissolve={false}
/>
```

## 实现细节

### 文件结构

```
FadeSwitch/
├── index.tsx                   # 主组件
├── FadeSwitchPicOne.tsx       # 单图主循环层组件
├── FadeSwitchGhostPicOne.tsx  # 假动作层组件（用于交叉溶解）
└── README.md                   # 说明文档
```

### 关键代码

**主组件 (index.tsx)**：
- 处理图片数组（至少2张图，单图自动复制）
- 计算总时长（交叉溶解模式下减去第一张的淡入时长）
- 渲染Ghost层（仅在交叉溶解模式）和所有图片主循环层

**主循环层组件 (FadeSwitchPicOne.tsx)**：
- 使用 `genAnimateOpacity` 工具函数生成动画
- 交叉溶解模式：第一张图使用负延迟提前淡入
- 计算当前图片的时间线：等待 → 淡入 → 保持 → 淡出

**假动作层组件 (FadeSwitchGhostPicOne.tsx)**：
- 仅在交叉溶解模式下渲染
- 在最后一张图淡出时，下面显示第一张图的假动作淡入
- 确保循环无缝衔接

### SVG 结构

**交叉溶解模式：**
```xml
<svg viewBox="0 0 450 450">
    <!-- 假动作层：第一张图的Ghost版本 -->
    <g name="ghost-layer" opacity="0">
        <foreignObject>...</foreignObject>
        <animate attributeName="opacity" ... />
    </g>
    
    <!-- 主循环层：图片1（使用负延迟提前淡入） -->
    <g name="fade-pic-0" opacity="0">
        <foreignObject>...</foreignObject>
        <animate attributeName="opacity" begin="-0.5s" dur="..." />
    </g>
    
    <!-- 主循环层：图片2、3... -->
    <g name="fade-pic-1" opacity="0">
        <foreignObject>...</foreignObject>
        <animate attributeName="opacity" ... />
    </g>
</svg>
```

**非交叉溶解模式：**
```xml
<svg viewBox="0 0 450 450">
    <!-- 无Ghost层，所有图片依次淡入淡出，中间有空白 -->
    <g opacity="0">
        <foreignObject>...</foreignObject>
        <animate attributeName="opacity" 
                 values="0;0;1;1;0;0"
                 dur="..."
                 repeatCount="indefinite" />
    </g>
    <!-- ... -->
</svg>
```

## 使用建议

### 推荐实践

- **淡入时长**：0.3-1 秒（过短显得生硬，过长显得拖沓）
- **停留时长**：
  - 文字内容：1.5-3 秒
  - 纯图片：0.8-1.5 秒
- **图片数量**：3-5 张（过多会让循环时间过长）
- **适用场景**：相册展示、产品轮播、内容切换等需要柔和过渡的场景

### 注意事项

1. **图片叠加**：所有图片叠加在同一位置，只通过 opacity 控制显示
2. **交叉溶解（默认）**：
   - 淡出和下一张的淡入同时进行，无空白间隙
   - 使用Ghost层确保循环无缝衔接
   - 第一张图使用负延迟提前淡入
3. **非交叉溶解**：
   - 图片依次淡入淡出，淡出完成后下一张才开始淡入
   - 切换过程中会有短暂的空白（全透明）
4. **时长计算**：
   - 交叉溶解：总时长 = Σ(fadeDuration + stayDuration) - 第一张fadeDuration
   - 非交叉溶解：总时长 = Σ(fadeDuration + stayDuration)
5. **单图处理**：如果只提供一张图，会自动复制形成两张图的切换
6. **工具函数**：使用 `genAnimateOpacity` 生成动画，确保代码简洁和可维护性

## 对比其他组件

| 组件 | 切换方式 | 特点 | 适用场景 |
|------|----------|------|----------|
| **FadeSwitch** | 淡入淡出 | 柔和平滑 | 相册、产品展示 |
| **AnyPush** | 位移推入 | 动感活力 | 内容切换、幻灯片 |
| **CoverIn** | 滑入覆盖 | 层次分明 | 信息展示、瀑布流 |
| **Carousel** | 轮播滚动 | 连续流畅 | 广告轮播、新闻滚动 |

## 参考资源

- [SVG animate 元素文档](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animate)
- [SVG keyTimes 属性](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/keyTimes)
- [SVG calcMode 属性](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/calcMode)

