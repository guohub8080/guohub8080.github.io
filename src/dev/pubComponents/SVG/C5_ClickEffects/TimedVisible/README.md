# TimedVisible 限时可见组件

## 功能说明
点击后第二张图片会在指定时间内显示，然后自动消失。适用于需要临时显示内容的场景。

## 原理
- 使用两个 SVG 元素叠加
- 底层 SVG 作为背景图，一直显示
- 顶层 SVG 默认透明，点击后通过 `<animate>` 元素控制透明度变化
- 透明度变化过程：0 → 1（淡入）→ 保持 → 0（淡出）

## Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| backgroundUrl | string | - | 背景图片 URL（一直显示） |
| overlayUrl | string | - | 叠加图片 URL（点击后限时显示） |
| duration | number | 4 | 显示持续时间（秒） |
| fadeInRatio | number | 0.2 | 淡入时间占比（0-1） |
| fadeOutRatio | number | 0.2 | 淡出时间占比（0-1） |
| viewBoxW | number | - | SVG 视图框宽度 |
| viewBoxH | number | - | SVG 视图框高度 |
| hotArea | HotAreaConfig | 全屏 | 热区配置 |
| mp | mpProps | - | margin/padding 配置 |

## 使用示例

```tsx
import TimedVisible from "@pubSVG/C5_ClickEffects/TimedVisible";

// 基础用法
<TimedVisible 
  backgroundUrl="背景图.jpg"
  overlayUrl="限时显示图.jpg"
/>

// 自定义时间配置
<TimedVisible 
  backgroundUrl="背景图.jpg"
  overlayUrl="限时显示图.jpg"
  duration={6}
  fadeInRatio={0.1}
  fadeOutRatio={0.3}
/>

// 自定义热区
<TimedVisible 
  backgroundUrl="背景图.jpg"
  overlayUrl="限时显示图.jpg"
  hotArea={{
    x: 100,
    y: 100,
    width: 250,
    height: 250
  }}
/>
```

## 时间配置说明

- `duration`: 总持续时间
- `fadeInRatio`: 淡入阶段占总时间的比例
- `fadeOutRatio`: 淡出阶段占总时间的比例
- 中间保持显示的时间 = `duration * (1 - fadeInRatio - fadeOutRatio)`

例如：`duration=4`, `fadeInRatio=0.2`, `fadeOutRatio=0.2`
- 淡入：0.8秒（0-20%）
- 保持：2.4秒（20%-80%）
- 淡出：0.8秒（80%-100%）

## 注意事项

1. 叠加图片通过 `transform: rotate(180deg)` 两次旋转来保持正常显示
2. 热区矩形设置为透明（`opacity: 0`），但可以响应点击事件
3. 叠加层设置 `pointerEvents: "none"`，点击事件由热区矩形处理
4. 每次点击都会重新触发动画

