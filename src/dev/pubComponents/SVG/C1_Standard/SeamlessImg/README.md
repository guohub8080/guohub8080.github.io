# 无缝图组件 SeamlessImg

用于显示无缝背景图片，支持深色模式对抗和多种交互模式。

## 1. 什么是无缝图？

无缝图是一种特殊的图片展示方式，使用 SVG 的 `background-image` 技术实现。

**核心特点：**
- ✅ 图片和容器之间**无缝隙、无白边**
- ✅ 支持**深色模式对抗**（图片不会变灰）
- ✅ 可控制交互行为（可点击、可穿透、可长按等）

## 2. 基本用法

```tsx
import SeamlessImg from '@pubSVG/C1_Standard/SeamlessImg';

// 最简单的用法（默认深色对抗）
<SeamlessImg 
  url="https://example.com/image.jpg"
  w={300}
  h={200}
/>

// 使用占位符（开发时）
<SeamlessImg 
  url={getWechat300x300(1)}
  w={300}
  h={200}
/>
```

## 3. 参数说明

| 参数 | 类型 | 说明 |
|------|------|------|
| `url` | string | 图片地址（可选，默认使用占位图） |
| `w` | number | 图片宽度（可选，默认自动获取） |
| `h` | number | 图片高度（可选，默认自动获取） |
| `mp` | mpProps | 边距样式（margin, padding 等） |

## 4. 七种模式详解

`SeamlessImg` 提供了 7 种不同的实现方式，通过布尔参数控制。**优先级从高到低**：

### 模式 1：默认深色对抗 ⭐

**参数：** 默认模式（无需额外参数）

**特点：**
- 使用 SVG `background-image` 显示图片
- 自带 `transform: scale(1)` 实现深色模式对抗
- 不可点击弹出，但可长按识别保存

**适用场景：** 装饰性图片、背景图、不需要弹出的内容图

**实现：** `SeamlessImg1.tsx`

```tsx
<SeamlessImg url="..." w={300} h={200} />
```

---

### 模式 2：自然优先级

**参数：** `isNaturalPriority={true}`

**特点：**
- 无 `transform` 属性
- 在层叠场景中保持自然的渲染优先级
- 深色模式下可能变灰（无深色对抗）

**适用场景：** 需要精确控制渲染层级的场景

**实现：** `SeamlessImg2.tsx`

```tsx
<SeamlessImg 
  url="..." 
  w={300} 
  h={200} 
  isNaturalPriority={true} 
/>
```

---

### 模式 3：事件穿透

**参数：** `isEventThrough={true}`

**特点：**
- 添加 `pointerEvents: 'none'`
- 点击事件会穿透到下层元素
- 支持深色对抗

**适用场景：** 半透明遮罩层、需要点击穿透的装饰图

**实现：** `SeamlessImg3.tsx`

```tsx
<SeamlessImg 
  url="..." 
  w={300} 
  h={200} 
  isEventThrough={true} 
/>
```

---

### 模式 4：可弹出 🖼️

**参数：** `isPopable={true}`

**特点：**
- 使用 `<foreignObject>` + `<img>` 实现
- 点击可弹出查看大图
- 同时保留 SVG 背景显示（双层结构）

**适用场景：** 需要用户查看原图的内容图片

**实现：** `SeamlessImg4.tsx`

```tsx
<SeamlessImg 
  url="..." 
  w={300} 
  h={200} 
  isPopable={true} 
/>
```

---

### 模式 5：强制可触摸

**参数：** `isTouchForced={true}`

**特点：**
- 添加 `pointerEvents: 'visible'`
- 强制接收所有触摸事件
- 支持深色对抗

**适用场景：** 需要确保能够响应点击的交互图片

**实现：** `SeamlessImg5.tsx`

```tsx
<SeamlessImg 
  url="..." 
  w={300} 
  h={200} 
  isTouchForced={true} 
/>
```

---

### 模式 6：发布后可替换 🔄

**参数：** `isReplaceableAfterPublish={true}`

**特点：**
- 使用 `data-src` 属性存储图片地址
- 支持公众号发布后通过脚本替换图片
- 使用 `<foreignObject>` + `<img>`

**适用场景：** 需要动态更新内容的图片（如活动海报、实时数据图）

**实现：** `SeamlessImg6.tsx`

```tsx
<SeamlessImg 
  url="..." 
  w={300} 
  h={200} 
  isReplaceableAfterPublish={true} 
/>
```

---

### 模式 7：仅长按识别 👆

**参数：** `isLongPressOnly={true}`

**特点：**
- 双层结构：透明 `<img>`（opacity: 0）+ SVG 背景
- 不可点击弹出，但可长按识别保存
- 支持深色对抗

**适用场景：** 希望用户保存图片但不想弹出预览的场景（如二维码、海报）

**实现：** `SeamlessImg7.tsx`

```tsx
<SeamlessImg 
  url="..." 
  w={300} 
  h={200} 
  isLongPressOnly={true} 
/>
```

---

## 5. 模式选择优先级

当同时设置多个参数时，优先级从高到低：

1. `isLongPressOnly` - 仅长按识别
2. `isReplaceableAfterPublish` - 发布后可替换
3. `isTouchForced` - 强制可触摸
4. `isPopable` - 可弹出
5. `isEventThrough` - 事件穿透
6. `isNaturalPriority` - 自然优先级
7. 默认 - 深色对抗模式

## 6. 功能对比表

| 模式 | 深色对抗 | 可弹出 | 可长按 | 事件穿透 | 可替换 |
|------|---------|--------|--------|---------|--------|
| 默认深色对抗 | ✅ | ❌ | ✅ | ❌ | ❌ |
| 自然优先级 | ❌ | ❌ | ✅ | ❌ | ❌ |
| 事件穿透 | ✅ | ❌ | ❌ | ✅ | ❌ |
| 可弹出 | ✅ | ✅ | ✅ | ❌ | ❌ |
| 强制可触摸 | ✅ | ❌ | ✅ | ❌ | ❌ |
| 发布后可替换 | ✅ | ❌ | ✅ | ❌ | ✅ |
| 仅长按识别 | ✅ | ❌ | ✅ | ❌ | ❌ |

## 7. 快速选择指南

| 使用场景 | 推荐模式 |
|---------|---------|
| 装饰性背景图、不需要弹出 | 默认模式 |
| 内容图片，用户需要查看大图 | `isPopable={true}` |
| 二维码、海报（可保存不可弹出） | `isLongPressOnly={true}` |
| 半透明遮罩、需要点击穿透 | `isEventThrough={true}` |
| 动态更新的活动图片 | `isReplaceableAfterPublish={true}` |
| 需要精确控制层级关系 | `isNaturalPriority={true}` |
| 确保能响应点击事件 | `isTouchForced={true}` |

## 8. 技术实现说明

### 深色对抗原理

微信公众号在深色模式下会自动降低图片亮度。通过添加 `transform: scale(1)` 可以阻止这种自动调整，保持图片原始亮度。

### 无缝显示原理

使用 SVG 的 `background-image` 而不是 `<image>` 标签，配合容器的 `overflow: hidden` 和 `lineHeight: 0`，实现图片与容器之间完全无缝隙。

### foreignObject 技术

模式 4、6、7 使用了 `<foreignObject>` 来嵌入 HTML `<img>` 标签，这样可以：
- 支持点击弹出查看（模式 4）
- 支持 `data-src` 属性（模式 6）
- 支持长按识别（模式 7）

同时通过双层结构保持 SVG 背景显示，确保视觉效果。

## 9. SVG 嵌套与兼容性说明

### 9.1 两种实现结构

无缝图组件根据功能需求采用两种不同的 HTML/SVG 结构：

#### 结构 A：section 包裹 SVG（模式 1, 2, 3, 5, 7）

```tsx
<section>
  <svg style={{ backgroundImage: svgURL(url) }}>
    {/* SVG 本身作为容器，通过 background-image 显示图片 */}
  </svg>
</section>
```

**特点：**
- ✅ 轻量级，性能好
- ✅ 深色对抗稳定
- ❌ 不支持点击弹出查看
- ❌ 不支持 data-src 动态替换

**兼容性：** 最佳，所有平台完全支持

---

#### 结构 B：foreignObject 嵌入（模式 4, 6）

```tsx
<section>
  <svg>
    <foreignObject>
      <img src={url} />  {/* 通过 foreignObject 嵌入 HTML img 标签 */}
    </foreignObject>
    <foreignObject>
      <svg style={{ backgroundImage: svgURL(url) }} />  {/* 背景层 */}
    </foreignObject>
  </svg>
</section>
```

**特点：**
- ✅ 支持点击弹出查看
- ✅ 支持 data-src 属性
- ✅ 可嵌入任何 HTML 元素
- ⚠️ 结构复杂，性能略低

**兼容性：** 良好，微信公众号完全支持

---

### 9.2 为什么需要 foreignObject？

SVG 是一个独立的图形系统，**不能直接包含 HTML 元素**。如果需要在 SVG 中使用 HTML 功能，必须通过 `<foreignObject>` 标签：

| 需求 | 是否需要 foreignObject | 原因 |
|------|---------------------|------|
| 纯背景图显示 | ❌ 不需要 | 使用 `background-image` 即可 |
| 点击弹出查看 | ✅ 需要 | 需要嵌入 `<img>` 标签触发点击事件 |
| 长按识别图片 | ✅ 需要 | 需要嵌入透明 `<img>` 标签提供长按目标 |
| data-src 属性 | ✅ 需要 | `data-src` 是 HTML 属性，SVG 不支持 |
| 嵌入表单、视频等 | ✅ 需要 | 这些都是 HTML 元素 |

---

### 9.3 foreignObject 使用注意事项

#### ⚠️ 命名空间声明

使用 foreignObject 时，SVG 标签必须声明 XML 命名空间：

```tsx
<svg 
  xmlns="http://www.w3.org/2000/svg"
  xmlnsXlink="http://www.w3.org/1999/xlink"  // 如果使用 xlink:href
>
  <foreignObject width={w} height={h}>
    <img src={url} />
  </foreignObject>
</svg>
```

#### ⚠️ 尺寸设置

foreignObject 必须明确指定宽高，否则内容不显示：

```tsx
// ✅ 正确
<foreignObject width={300} height={200}>
  <img src={url} style={{ width: '100%' }} />
</foreignObject>

// ❌ 错误 - 没有指定宽高
<foreignObject>
  <img src={url} />
</foreignObject>
```

#### ⚠️ 坐标系统

foreignObject 使用 SVG 坐标系统，可以通过 `x` 和 `y` 属性定位：

```tsx
<foreignObject x={0} y={0} width={300} height={200}>
  {/* 内容从 (0, 0) 开始 */}
</foreignObject>
```

---

### 9.4 如何选择实现方式？

**使用 section + SVG（推荐大多数场景）：**
- 装饰性图片、背景图
- 不需要点击弹出的内容图
- 追求最佳性能

**使用 foreignObject：**
- 需要点击弹出查看大图
- 需要发布后动态替换图片
- 需要在 SVG 中嵌入复杂 HTML 内容

---

## 10. 注意事项

1. **尺寸参数**：虽然 `w` 和 `h` 是可选的，但建议明确提供，避免自动获取失败
2. **URL 格式**：建议使用 HTTPS 协议的图片地址
3. **深色对抗**：如果不需要深色对抗，使用 `isNaturalPriority={true}`
4. **性能考虑**：大量使用 `foreignObject` 可能影响性能，优先使用默认模式
5. **兼容性**：所有模式在微信公众号中测试通过
6. **嵌套限制**：如果需要在 SVG 内嵌入 HTML 元素，必须使用 foreignObject
7. **命名空间**：使用 foreignObject 时记得声明 xmlns 和 xmlnsXlink

