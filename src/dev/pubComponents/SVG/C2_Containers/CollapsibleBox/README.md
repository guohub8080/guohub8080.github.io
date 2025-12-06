# CollapsibleBox 坍塌盒子组件

## 📖 组件概述

可点击展开/收起的SVG交互盒子，点击热区后盒子会坍塌收起。

**核心特性**：采用"展示层与控制层分离"的设计，可以接收**任何React节点**作为children。

---

## 🎯 使用示例

### 示例1: 普通图片（最常用）

```tsx
<CollapsibleBox 
  viewBoxW={450}
  viewBoxH={750}
  hotAreaW={450}
  hotAreaH={750}
>
  <img src={pic1} style={{ width: '100%' }} />
</CollapsibleBox>
```

### 示例2: React组件

```tsx
<CollapsibleBox 
  viewBoxW={450}
  viewBoxH={750}
  hotAreaW={450}
  hotAreaH={750}
>
  <LongImgTouchSlideX url={pic2} exposedPercent={25} />
</CollapsibleBox>
```

### 示例3: SVG元素（需要自己包裹svg标签）

```tsx
<CollapsibleBox 
  viewBoxW={300}
  viewBoxH={300}
  hotAreaW={300}
  hotAreaH={300}
>
  <svg viewBox="0 0 300 300">
    <rect x="0" y="0" width="300" height="300" fill="blue" />
    <circle cx="150" cy="150" r="80" fill="white" />
  </svg>
</CollapsibleBox>
```

### 示例4: 任何HTML内容

```tsx
<CollapsibleBox 
  viewBoxW={300}
  viewBoxH={200}
  hotAreaW={300}
  hotAreaH={200}
>
  <div style={{ 
    background: 'linear-gradient(45deg, #667eea, #764ba2)', 
    width: '300px', 
    height: '200px', 
    color: 'white' 
  }}>
    点击坍塌
  </div>
</CollapsibleBox>
```

---

## 🏗️ 坍塌原理详解

### 整体结构：双层设计

组件采用**上下两层结构**，像是舞台的"前台"和"后台"：

```
┌─────────────────────────────────┐
│  【顶层展示容器 - 展示层】       │
│  - 展示 children（任何内容）    │  ← 用户看到的内容
│  - height: 0（不占空间）        │     可以是HTML、React组件、SVG等
│  - overflow: visible（内容可见） │
└─────────────────────────────────┘
           ↓ 叠加在一起
┌─────────────────────────────────┐
│  【底层SVG - 交互层】            │
│  - 包含透明热区（rect）         │  ← 控制坍塌的机关
│  - 包含坍塌动画                 │
│  - pointer-events: none         │
└─────────────────────────────────┘
```

### 核心原理：展示层与控制层分离

**顶部展示容器**：
- 就像一个"隐形窗口"（height: 0, overflow: visible）
- 窗口本身高度为0（不占空间）
- 但从窗口"溢出"的内容都能看见
- **children直接放在section中，不受SVG限制**
- 可以接收任何React节点：
  - ✅ HTML元素 (`<img>`, `<div>`...)
  - ✅ React组件 (`<LongImgTouchSlideX>`, `<ClickSwitch>`...)
  - ✅ SVG元素（自己用`<svg>`包裹）
  - ✅ 任何React节点

**底层SVG容器**：
- 负责交互控制（透明热区 + 坍塌动画）
- 通过 pointer-events 控制，只有热区可以响应点击
- 坍塌时影响整体布局，从而让顶部内容消失

---

## 🎬 坍塌机制：三步走

### 第一步：设置"隐形按钮"

```jsx
<rect
  x={hotAreaX}
  y={hotAreaY}
  width={hotAreaWidth}
  height={hotAreaHeight}
  style={{
    pointerEvents: "visiblePainted",  // 可以接收点击
    opacity: 0                         // 完全透明，看不见
  }}
>
```

**作用**：在图片上放一个透明的矩形，用户看不见，但可以点击。
- 就像在图片上贴了一张"隐形贴纸"
- 位置和大小可以自定义（比如只在图片的某个角落）

---

### 第二步：点击触发双重动画

当用户点击这个隐形矩形时，**同时触发两个动画**：

#### 🎬 动画1：SVG宽度瞬间消失

```jsx
<animate
  attributeName="width"      // 改变宽度
  values="100%;0;0"          // 从100%变为0
  keyTimes="0;0.00001;1"     // 几乎瞬间完成
  begin="click"              // 点击时触发
  calcMode="discrete"        // 离散跳变，不平滑过渡
/>
```

**效果**：整个SVG容器的宽度从 100% → 0，**瞬间消失**（像关灯一样）

#### 🎬 动画2：Rect高度平滑缩小

```jsx
<animate
  attributeName="height"     // 改变高度
  values="100%;0%;0%"        // 从100%变为0%
  keyTimes="0;0.0001;1"      // 前0.1秒完成，剩余时间保持
  begin="click"              // 点击时触发
  calcMode="spline"          // 平滑过渡
  keySplines="0.42 0 0.58 1.0; 0.42 0 0.58 1.0"  // 缓动曲线
/>
```

---

### 第三步：内容消失

虽然 `topSvg` 和 `mainSvg` 是兄弟节点，但它们都在同一个 `outerContainer` 内：
- `outerContainer` 有 `overflow: hidden`
- 当 `mainSvg` 宽度变为0时，整个容器的有效区域变小
- 由于布局和层叠关系，顶部的内容也跟着消失

---

## ⏱️ 动画参数详解

### 1. keyTimes - 时间控制的巧妙设计

```jsx
keyTimes="0;0.0001;1"
dur="1000s"
values="100%;0%;0%"
```

这是一个**时间压缩技巧**：

```
总时长 dur="1000s" (1000秒)

时间轴：
0s ───────────► 0.1s ──────────────────────► 1000s
    (keyTime=0)   (keyTime=0.0001)              (keyTime=1)
    
值变化：
100% ─────────► 0% ────────────────────────► 0%
    (瞬间坍塌)     (一直保持坍塌状态)
```

**为什么这样设计？**
- 📊 配合 `dur="1000s"` 和 `values="100%;0%;0%"`
- ⚡ 实际坍塌动画在 **0.1秒** 内完成（0.0001 × 1000s）
- 🔒 剩余 999.9秒 保持在坍塌状态
- ✅ SVG动画需要一个"总时长"来保持状态
- ✅ 通过极小的keyTime值，让动画快速完成，但不会自动恢复
- ✅ `fill="freeze"` + `restart="never"` 确保动画结束后不重置

**如果修改数字：**
- `0.0001` → `0.001`：坍塌变慢，需要1秒完成
- `0.0001` → `0.01`：坍塌更慢，需要10秒完成
- `0.0001` → `0.00001`：坍塌更快，0.01秒完成

---

### 2. keySplines - 缓动曲线

```jsx
keySplines="0.42 0 0.58 1.0; 0.42 0 0.58 1.0"
```

这是 **贝塞尔曲线** 控制点：

**基础概念**：
- 📐 四个数字：`x1 y1 x2 y2`（两个控制点）
- 🎭 `0.42 0 0.58 1.0` = CSS的 `ease-in-out`（慢→快→慢）
- 🎬 让坍塌动作更自然，有"加速→减速"的效果
- 因为有3个关键帧，需要2段曲线（n个帧需要n-1段曲线）
  - 第1段：0.42 0 0.58 1.0（从100%到0%的过渡）
  - 第2段：0.42 0 0.58 1.0（从0%到0%的过渡，实际无变化）

**速度变化（ease-in-out）**：

```
|     ╱‾‾‾╲
|    ╱     ╲
|   ╱       ╲
|  ╱         ╲
| ╱___________╲___
└─────────────────► 时间
  慢→快→慢
```

**常用缓动值**：
- `0 0 1 1` → 线性匀速 ▬▬▬
- `0.42 0 1 1` → ease-in（慢启动）⟋▬▬
- `0 0 0.58 1` → ease-out（慢结束）▬▬⟍
- `0.68 -0.55 0.27 1.55` → 回弹效果 ↗↘↗

---

## 🎨 布局魔法：`height: 0` + `overflow: visible`

### 核心概念

```jsx
<section style={{ height: 0, overflow: "visible" }}>
  {children}  // ← 任何React节点：HTML、React组件、SVG等
</section>
```

**关键点**：children直接放在section中，不需要foreignObject包裹！

---

### 原理详解

#### 1️⃣ `height: 0` 的作用

```
文档流中的空间占用：

┌──────────────────┐
│  其他内容         │
├──────────────────┤
│ [容器 height: 0] │ ← 不占据任何高度！
├──────────────────┤
│  其他内容         │
└──────────────────┘
```

**效果**：这个容器在布局中**不占据任何垂直空间**，就像它不存在一样。

---

#### 2️⃣ `overflow: visible` 的魔法

虽然容器高度为0，但 `overflow: visible` 允许**子元素突破容器边界显示**：

```
实际渲染效果：

                    ┌────────────┐
                    │            │
                    │  children  │ ← 子元素溢出显示
                    │   内容     │   （可以是任何东西）
                    │            │
┌──────────────────┼────────────┼────┐
│                  │            │    │
│  其他内容        └────────────┘    │
├─────────────────────────────────┬──┤
│ [容器 height: 0]                │← │ 容器本身高度为0
├─────────────────────────────────┴──┤
│  其他内容                          │
└────────────────────────────────────┘
```

---

### 为什么要这样设计？

这是为了实现**"幽灵层"效果**：

#### ❌ 如果不用 `height: 0`：

```
┌──────────────────┐
│  顶层展示容器    │ ← 占据空间
├──────────────────┤
│  底层SVG（交互）  │ ← 又占据空间
└──────────────────┘

结果：页面上会有两倍高度的空白！
```

#### ✅ 使用 `height: 0` + `overflow: visible`：

```
┌──────────────────┐
│  顶层展示容器    │ ← 溢出显示，不占空间
│  底层SVG（交互）  │ ← 在同一位置，正常占空间
└──────────────────┘

结果：两层容器完美叠加在同一位置！
```

---

### 为什么能接收任何React节点？

**核心原因**：顶部展示容器是普通的HTML section，不是SVG！

```jsx
<section style={topSvgContainerStyle}>
  {children}  // ← 直接放在普通HTML容器中
</section>
```

**对比传统SVG方案**：

#### ❌ 传统方案：必须用foreignObject

```jsx
<svg>
  <foreignObject>  {/* 必须包裹！ */}
    <img src={pic} />
  </foreignObject>
</svg>
```

#### ✅ CollapsibleBox：直接使用

```jsx
<section>
  <img src={pic} />  {/* 直接放，无需包裹 */}
</section>
```

**为什么不需要foreignObject？**
- foreignObject是用来在SVG中嵌入HTML的
- 但我们的children在section（HTML容器）中，不在SVG中
- section可以直接包含任何HTML/React内容
- 完全的自由和灵活性

**总结**：
- ❌ 不是"撑开"容器（容器确实是0高度）
- ✅ 而是让子元素**"溢出"容器边界**显示
- 🎯 这样既能让内容可见，又不影响布局流
- 🎭 最终实现两层容器完美叠加的效果
- 🚀 children在HTML容器中，可以是任何React节点

---

## 📊 完整布局流程图

```
初始状态：
┌────────────────────────────┐
│  SectionEx（根容器）        │
│  ┌────────────────────────┐│
│  │ section (height: 0)    ││ ← 不占空间，展示层
│  │   ╔═══════════════╗    ││
│  │   ║   children    ║    ││ ← 溢出显示（任何React节点）
│  │   ║ (图片/组件等) ║    ││
│  │   ╚═══════════════╝    ││
│  └────────────────────────┘│
│  ┌────────────────────────┐│
│  │ section (正常高度)     ││ ← 正常占空间，交互层
│  │  ┌──────────────────┐ ││
│  │  │ SVG (交互层)     │ ││ ← 与上方内容重叠
│  │  │  [透明rect热区]  │ ││
│  │  └──────────────────┘ ││
│  └────────────────────────┘│
└────────────────────────────┘
```

---

## 🔄 坍塌的完整流程

1. **初始状态**：
   - 用户看到 children 内容（图片）
   - 透明热区覆盖在指定位置，等待点击

2. **点击瞬间**：
   - 触发 `begin="click"` 事件
   - 两个动画同时启动

3. **0.1秒内**：
   - SVG宽度 100% → 0（瞬间消失）
   - Rect高度 100% → 0%（平滑缩小）
   - 由于容器关系，顶层内容也跟着消失

4. **之后**：
   - 动画保持在最终状态（坍塌）
   - `restart="never"` 防止再次触发
   - 内容永久消失，直到页面刷新

---

## 🎯 Props 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| `viewBoxW` | `number` | `100` | viewBox 宽度（控制层SVG的坐标系统宽度） |
| `viewBoxH` | `number` | `300` | viewBox 高度（控制层SVG的坐标系统高度） |
| `hotAreaX` | `number` | `0` | 触摸热区横坐标 |
| `hotAreaY` | `number` | `0` | 触摸热区纵坐标 |
| `hotAreaW` | `number` | `50` | 触摸热区宽度 |
| `hotAreaH` | `number` | `50` | 触摸热区高度 |
| `children` | `ReactNode` | - | 要展示的内容（任何React节点：HTML、React组件、SVG等） |

---

## 📦 Children 类型支持

CollapsibleBox 可以接收**任何React节点**作为children，完全自由！

### ✅ HTML元素（直接使用，最常用）

```tsx
{/* 图片 */}
<CollapsibleBox viewBoxW={450} viewBoxH={750} hotAreaW={450} hotAreaH={750}>
  <img src={pic1} style={{ width: '100%' }} />
</CollapsibleBox>

{/* div容器 */}
<CollapsibleBox viewBoxW={300} viewBoxH={200} hotAreaW={300} hotAreaH={200}>
  <div style={{ background: 'blue', width: '300px', height: '200px' }}>
    点击坍塌
  </div>
</CollapsibleBox>
```

### ✅ React组件（直接使用）

```tsx
<CollapsibleBox viewBoxW={450} viewBoxH={750} hotAreaW={450} hotAreaH={750}>
  <LongImgTouchSlideX url={pic2} exposedPercent={25} />
</CollapsibleBox>

<CollapsibleBox viewBoxW={450} viewBoxH={750} hotAreaW={450} hotAreaH={750}>
  <ClickSwitch pics={[pic1, pic2, pic3]} />
</CollapsibleBox>
```

### ✅ SVG元素（需要自己包裹`<svg>`标签）

```tsx
<CollapsibleBox viewBoxW={300} viewBoxH={300} hotAreaW={300} hotAreaH={300}>
  <svg viewBox="0 0 300 300">
    <rect x="0" y="0" width="300" height="300" fill="blue" />
    <circle cx="150" cy="150" r="80" fill="white" />
  </svg>
</CollapsibleBox>
```

### ⚠️ 注意事项

1. **不需要foreignObject**：children直接放在HTML容器中，无需包裹
2. **SVG元素需要自己的svg标签**：因为children不在SVG内部，SVG元素需要自己包裹
3. **完全的灵活性**：可以混合使用各种元素和组件

---

## 💡 技术要点总结

这是一个利用以下技术实现的精巧交互效果：

1. **展示层与控制层分离**：
   - 顶部展示容器（HTML section）：接收任何React节点
   - 底部交互层（SVG）：控制坍塌动画
   - 无需foreignObject，完全的灵活性

2. **SVG动画**：`<animate>` 标签实现属性动画
   - 宽度瞬间消失（discrete模式）
   - 高度平滑缩小（spline缓动）

3. **布局关系**：双层结构 + `overflow: hidden` 实现内容消失
   - 两层容器完美叠加在同一位置

4. **时间控制**：`keyTimes` 实现快速动画 + 长时间保持状态
   - 前0.1秒完成坍塌
   - 剩余999.9秒保持坍塌状态

5. **缓动函数**：`keySplines` 实现自然的动画效果
   - ease-in-out曲线，慢→快→慢

6. **CSS魔法**：`height: 0` + `overflow: visible` 实现层叠布局
   - 容器不占空间，但内容溢出显示
   - 实现"幽灵层"效果

🎩✨

