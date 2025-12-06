# BlurSwitch - 虚焦切换组件

## 📖 简介

模拟相机对焦效果的图片切换组件，点击时会经历：**清晰 → 失焦（模糊）→ 重新对焦（清晰）** 的过程。

## 🎨 效果原理

### 三层叠加结构

```
┌─────────────────────────────────────────┐
│ 第3层（最上层 - 可点击）                  │
│ [图片1][图片2在右边屏幕外]                │
│ 点击时：淡出→平移→淡入                    │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 第2层（模糊遮罩层）                       │
│ backdrop-filter: blur(10px)              │
│ 创造模糊玻璃效果                         │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 第1层（底层）                            │
│ 清晰图片（零高度叠层）                    │
└─────────────────────────────────────────┘
```

### 动画流程

1. **0-1秒**：顶层图片淡出（opacity: 1 → 0），透过模糊遮罩看到模糊效果
2. **1秒**：瞬间平移，将图片2移到屏幕内
3. **1-2秒**：顶层图片淡入（opacity: 0 → 1），遮挡模糊层，显示清晰图片2

## 🔧 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| `beforeUrl` | `string` | 测试图 | 切换前的图片 URL |
| `afterUrl` | `string` | 测试图 | 切换后的图片 URL |
| `blurAmount` | `number` | `10` | 模糊程度（px） |
| `fadeDuration` | `number` | `2` | 淡入淡出总时长（秒） |
| `viewBoxW` | `number` | 自动 | ViewBox 宽度 |
| `viewBoxH` | `number` | 自动 | ViewBox 高度 |
| `mp` | `mpProps` | - | margin/padding 配置 |

## 📝 使用示例

### 基础用法

```tsx
<BlurSwitch 
  beforeUrl="https://example.com/photo1.jpg"
  afterUrl="https://example.com/photo2.jpg"
/>
```

### 自定义模糊程度

```tsx
<BlurSwitch 
  beforeUrl="https://example.com/photo1.jpg"
  afterUrl="https://example.com/photo2.jpg"
  blurAmount={20}  // 更强的模糊效果
/>
```

### 调整动画速度

```tsx
<BlurSwitch 
  beforeUrl="https://example.com/photo1.jpg"
  afterUrl="https://example.com/photo2.jpg"
  fadeDuration={3}  // 3秒的淡入淡出
/>
```

### 自定义尺寸

```tsx
<BlurSwitch 
  beforeUrl="https://example.com/photo1.jpg"
  afterUrl="https://example.com/photo2.jpg"
  viewBoxW={800}
  viewBoxH={600}
/>
```

## 🎯 技术要点

### 1. backdrop-filter 的作用

```css
backdrop-filter: blur(10px);
```

- 模糊**背后的内容**，不是元素本身
- 创造"透过模糊玻璃看"的效果
- 关键：必须配合 `pointer-events: none` 让点击穿透

### 2. foreignObject 的用途

- 创建横向排列的双图布局
- 图片2初始位置在 `x="100%"`（屏幕外）
- 平移时从右侧滑入

### 3. 双旋转技巧

```
section: rotate(180deg)
  └─ section: rotate(180deg)
      └─ 图片正常显示（180° × 2 = 360°）
```

作用：控制叠层顺序和点击事件传递

### 4. 动画时序设计

- 淡出淡入总时长：`fadeDuration` 秒
- 平移发生时间：`fadeDuration / 2` 秒（恰好在最透明时）
- 确保图片切换发生在模糊期间，用户看不到

## ⚠️ 注意事项

1. **浏览器兼容性**：`backdrop-filter` 需要较新的浏览器
   - Chrome 76+
   - Safari 9+（需要 `-webkit-` 前缀）
   - Firefox 103+

2. **性能考虑**：模糊滤镜会消耗 GPU 资源，不建议在页面上放置过多

3. **单次切换**：动画设置了 `restart="never"`，只能点击一次。如需重复切换，需要修改动画逻辑

## 🎨 扩展建议

### 支持多图切换

可以扩展为多张图片循环切换：

```tsx
// 未来可以支持
pics={[
  "image1.jpg",
  "image2.jpg",
  "image3.jpg",
]}
```

### 自定义贝塞尔曲线

添加缓动函数支持，使淡入淡出更自然

### 双向切换

添加方向参数，支持从左右任意方向切换

## 📚 相关组件

- `ClickSwitch` - 基础点击切换（淡入淡出）
- `FilterImg` - 静态滤镜效果

