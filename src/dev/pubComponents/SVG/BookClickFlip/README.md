# BookClickFlip - 图书翻页组件

## 📖 简介

模拟3D翻页效果的组件，点击时页面会像真实书页一样翻过去。支持N页无限叠加，逐层点击翻页。

## 🎨 效果原理

### 三层结构

```
┌─────────────────────────────┐
│ 第N页（顶层）                │ 👈 第1次点击
│ 点击后翻页消失               │
└─────────────────────────────┘
┌─────────────────────────────┐
│ 第2页                        │ 👈 第2次点击
│ 点击后翻页消失               │
└─────────────────────────────┘
┌─────────────────────────────┐
│ 第1页（底层）                │
│ 始终可见，最后显示            │
└─────────────────────────────┘
```

### 动画流程

1. **0-3秒**：同时进行4个变换
   - `skewY(0° → 30°)` - 倾斜，模拟3D透视
   - `scale(1,1 → 0,1)` - 横向收缩
   - `translate(0,0 → 0,0)` - 平移（占位，可扩展）
2. **1-3秒**：`opacity(1 → 0)` - 延迟1秒后开始淡出
3. **3秒后**：`visibility: hidden` - 完全隐藏

### 视觉效果

```
正常页面     倾斜+收缩     几乎消失      完全隐藏
┌────┐       ┌──╱         ┆╱            (露出下层)
│    │  -->  │ ╱    -->   ╱      -->    
│    │       │╱           ╱             
└────┘       └─           ╱              
```

## 🔧 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| `pics` | `string[]` | 3张测试图 | 页面图片URL数组，**第一个元素是底层** |
| `skewDegree` | `number` | `30` | 倾斜角度（度），建议 20-40 |
| `duration` | `number` | `3` | 翻页动画总时长（秒） |
| `fadeStartDelay` | `number` | `1` | 淡出动画延迟开始时间（秒） |
| `viewBoxW` | `number` | 自动 | ViewBox 宽度 |
| `viewBoxH` | `number` | 自动 | ViewBox 高度 |
| `mp` | `mpProps` | - | margin/padding 配置 |

## 📝 使用示例

### 基础用法（3页）

```tsx
<BookClickFlip 
  pics={[
    "https://example.com/page1.jpg",  // 底层
    "https://example.com/page2.jpg",  // 中间层
    "https://example.com/page3.jpg",  // 顶层
  ]}
/>
```

### 多页书籍（N页）

```tsx
<BookClickFlip 
  pics={[
    "page1.jpg",  // 第1页（底层）
    "page2.jpg",  // 第2页
    "page3.jpg",  // 第3页
    "page4.jpg",  // 第4页
    "page5.jpg",  // 第5页
    "page6.jpg",  // 第6页（顶层）
  ]}
/>
```

### 自定义动画参数

```tsx
<BookClickFlip 
  pics={["page1.jpg", "page2.jpg", "page3.jpg"]}
  skewDegree={40}          // 更大的倾斜角度
  duration={2}             // 更快的翻页速度
  fadeStartDelay={0.5}     // 更早开始淡出
/>
```

### 慢速优雅翻页

```tsx
<BookClickFlip 
  pics={["page1.jpg", "page2.jpg", "page3.jpg"]}
  skewDegree={25}          // 轻微倾斜
  duration={4}             // 慢速翻页
  fadeStartDelay={2}       // 延迟淡出
/>
```

### 自定义尺寸

```tsx
<BookClickFlip 
  pics={["page1.jpg", "page2.jpg"]}
  viewBoxW={600}
  viewBoxH={900}
/>
```

## 🎯 技术要点

### 1. additive="sum" - 变换叠加

所有变换同时作用，不会互相覆盖：

```tsx
最终效果 = skewY(30°) + scale(0,1) + translate(0,0)
```

### 2. 渲染顺序很重要

```tsx
// ✅ 正确：底层在前，顶层在后
pics={[
  "底层.jpg",   // index=0
  "中间.jpg",   // index=1
  "顶层.jpg",   // index=2（最后渲染，在最上层）
]}

// ❌ 错误：会导致顶层被遮挡
```

### 3. 热区自动失效

每一页的透明热区在点击后立即隐藏，防止重复触发：

```tsx
<set attributeName="visibility" to="hidden" begin="click" />
```

### 4. 底层页面处理

第一页（`index === 0`）没有翻页动画，只有热区失效逻辑，用户点击后无反应。

## 💡 参数调优建议

### skewDegree（倾斜角度）

| 值 | 效果 | 适用场景 |
|----|------|----------|
| `15-20` | 轻微倾斜 | 优雅、低调的翻页 |
| `25-35` | 适中倾斜 | 平衡真实感和流畅度 |
| `40-50` | 强烈倾斜 | 夸张、戏剧化效果 |

### duration（动画时长）

| 值 | 效果 | 适用场景 |
|----|------|----------|
| `1-2秒` | 快速翻页 | 信息密集型内容 |
| `2-3秒` | 标准速度 | 通用场景 |
| `4-5秒` | 慢速优雅 | 艺术展示、高端品牌 |

### fadeStartDelay（淡出延迟）

| 值 | 效果 |
|----|------|
| `0秒` | 立即淡出（与形变同时开始） |
| `duration/3` | 前1/3清晰，后2/3淡出 |
| `duration/2` | 前半清晰，后半淡出（推荐） |
| `duration*2/3` | 前2/3清晰，最后瞬间淡出 |

## ⚠️ 注意事项

### 1. 页数限制

- **推荐：** 3-10页
- **最多：** 理论无限，但太多页会：
  - 增加初始渲染时间
  - 占用更多内存
  - 降低动画流畅度

### 2. 性能优化

```tsx
// ❌ 避免：一次加载过多高清图片
<BookClickFlip pics={[...Array(50)].map((_, i) => `highres_${i}.jpg`)} />

// ✅ 推荐：分批加载或使用懒加载
<BookClickFlip pics={firstBatch} />
```

### 3. 图片尺寸

- 建议所有页面使用**相同尺寸**的图片
- 如果尺寸不同，组件会以第一张图片的尺寸为准

### 4. 点击响应

- 只有当前可见的顶层才能被点击
- 点击后该层立即失效，防止重复触发
- 底层（第1页）点击后无反应

## 🎨 常见用法场景

### 电子书阅读器

```tsx
<BookClickFlip 
  pics={bookPages}
  duration={2}
  fadeStartDelay={0.8}
/>
```

### 相册展示

```tsx
<BookClickFlip 
  pics={photoAlbum}
  skewDegree={35}
  duration={3}
/>
```

### 产品介绍

```tsx
<BookClickFlip 
  pics={[
    "封面.jpg",
    "特性1.jpg",
    "特性2.jpg",
    "特性3.jpg",
    "购买页.jpg"
  ]}
  skewDegree={25}
/>
```

### 故事卡片

```tsx
<BookClickFlip 
  pics={storyCards}
  duration={4}
  fadeStartDelay={2}
  skewDegree={20}
/>
```

## 🔄 扩展方向

### 支持的扩展（未来可实现）

1. **双向翻页** - 添加"上一页"按钮
2. **自动翻页** - 添加定时器自动播放
3. **任意内容** - 支持 `ReactNode` 而不仅是图片URL
4. **翻页音效** - 添加翻页声音
5. **页码指示器** - 显示当前第几页
6. **手势滑动** - 支持触摸滑动翻页

## 📚 相关组件

- `Carousel` - 轮播图（自动播放）
- `ClickSwitch` - 点击切换（淡入淡出）
- `Poker` - 扑克牌滑动效果

