# Container180 - 180° 旋转容器

## 🎯 这是什么？

`Container180` 是一个**180° 旋转容器**，将内部内容旋转 180 度显示（上下颠倒），实现镜像或倒置效果。

---

## 🤔 核心原理

### 技术实现

```tsx
<section style={{ transform: 'rotate(180deg)', transformOrigin: 'center' }}>
  {children}
</section>
```

### 关键样式

```css
transform: rotate(180deg)      /* 旋转 180 度 */
transform-origin: center       /* 以中心点为旋转轴 */
```

### 效果演示

```
原始内容：
┌─────────────┐
│    ╱╲       │
│   ╱  ╲      │
│  ╱____╲     │
│  三角形      │
└─────────────┘

旋转 180° 后：
┌─────────────┐
│  ▔▔▔▔▔▔     │
│   ╲    ╱    │
│    ╲  ╱     │
│     ╲╱      │
│  倒三角形    │
└─────────────┘
```

---

## 💡 为什么需要它？

### 场景需求

有时我们需要将内容**上下翻转**显示：

1. **镜像效果**：创建倒影或镜像
2. **倒置分隔线**：分隔线朝向相反
3. **装饰图案**：特殊的视觉效果
4. **对称设计**：上下对称的布局

---

## 🎨 使用场景

### 场景1：倒置的分隔线

```tsx
// 正常的分隔线
<hr style={{ 
  borderStyle: 'solid',
  borderWidth: '1px 0 0',
  borderColor: 'rgba(0,0,0,0.1)'
}} />

// 倒置的分隔线
<Container180>
  <hr style={{ 
    borderStyle: 'solid',
    borderWidth: '1px 0 0',
    borderColor: 'rgba(0,0,0,0.1)'
  }} />
</Container180>
```

**效果：**
```
正常分隔线：
─────────────  ← 线在上方

倒置分隔线：
_____________  ← 线在下方（视觉上）
```

---

### 场景2：镜像图片效果

```tsx
<div>
  {/* 原图 */}
  <img src="landscape.jpg" style={{ width: '100%' }} />
  
  {/* 倒影 */}
  <Container180>
    <img 
      src="landscape.jpg" 
      style={{ 
        width: '100%',
        opacity: 0.3,
        filter: 'blur(2px)'
      }} 
    />
  </Container180>
</div>
```

**效果：**
```
┌──────────────┐
│   🏔️ 山景     │ ← 原图
├──────────────┤
│   🏔️ 山景     │ ← 倒影（倒置 + 半透明）
└──────────────┘
```

---

### 场景3：对称装饰图案

```tsx
<div>
  {/* 顶部装饰 */}
  <img src="decoration-top.svg" />
  
  <div style={{ padding: '20px' }}>
    <h2>内容区域</h2>
    <p>正文内容...</p>
  </div>
  
  {/* 底部装饰（与顶部对称） */}
  <Container180>
    <img src="decoration-top.svg" />
  </Container180>
</div>
```

**效果：**
```
    ╱╲╱╲╱╲      ← 顶部装饰
┌──────────────┐
│ 内容区域      │
│ 正文内容...   │
└──────────────┘
    ╲╱╲╱╲╱      ← 底部装饰（倒置）
```

---

### 场景4：倒置的文字效果

```tsx
<Container180>
  <h1>Hello World</h1>
</Container180>
```

**效果：**
```
plɹoM ollǝH  ← 上下颠倒的文字
```

---

## 🔧 `transform-origin: center` 的作用

### 什么是 transform-origin？

`transform-origin` 定义了**旋转的中心点**。

### 不同的旋转中心点

```css
/* 以左上角为中心旋转 */
transform-origin: top left;

/* 以中心为中心旋转（默认） */
transform-origin: center;  /* 或 50% 50% */

/* 以右下角为中心旋转 */
transform-origin: bottom right;
```

### 对比效果

```
transform-origin: top left (左上角):
  ┌─────┐              ╱
  │  A  │   rotate →  ╱ A
  └─────┘            ╱
  ↑ 旋转中心


transform-origin: center (中心):
  ┌─────┐
  │  A  │   rotate →  ▔▔▔▔▔
  └─────┘              ∀
        ↑ 旋转中心
        

transform-origin: bottom right (右下角):
  ┌─────┐            ╲
  │  A  │   rotate →  ╲ A
  └─────┘              ╲
        ↑ 旋转中心
```

**`Container180` 使用 `center`**，确保内容**在原位置上下翻转**，不会偏移。

---

## 📊 对比：不同旋转角度

### 0° - 正常显示

```tsx
<div>
  <p>Hello</p>
</div>
```

**效果：**
```
Hello  ← 正常
```

---

### 90° - 顺时针旋转

```tsx
<div style={{ transform: 'rotate(90deg)' }}>
  <p>Hello</p>
</div>
```

**效果：**
```
H
e
l
l
o  ← 竖排（顺时针）
```

---

### 180° - 上下颠倒

```tsx
<Container180>
  <p>Hello</p>
</Container180>
```

**效果：**
```
ollǝH  ← 倒置
```

---

### 270° - 逆时针旋转

```tsx
<div style={{ transform: 'rotate(270deg)' }}>
  <p>Hello</p>
</div>
```

**效果：**
```
o
l
l
e
H  ← 竖排（逆时针）
```

---

## 📝 参数说明

```tsx
type Props = {
  children?: ReactNode  // 要旋转的内容
  mp?: mpProps          // 边距配置（mt, mb, ml, mr）
}
```

### children - 内容

可以是任何 React 元素：

```tsx
// 文本
<Container180>
  <p>倒置的文字</p>
</Container180>

// 图片
<Container180>
  <img src="image.png" />
</Container180>

// SVG
<Container180>
  <svg viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="40" fill="red" />
  </svg>
</Container180>

// 分隔线
<Container180>
  <hr style={{ borderTop: '1px solid #ccc' }} />
</Container180>

// 多个元素
<Container180>
  <div>
    <h2>标题</h2>
    <p>内容</p>
  </div>
</Container180>
```

---

### mp - 边距配置

控制容器的外边距：

```tsx
// 添加上边距
<Container180 mp={{ mt: 20 }}>
  <img src="decoration.png" />
</Container180>

// 添加下边距
<Container180 mp={{ mb: 10 }}>
  <hr />
</Container180>

// 组合使用
<Container180 mp={{ mt: 15, mb: 15 }}>
  <div>内容</div>
</Container180>
```

---

## 🎨 实际案例

### 案例1：卡片的镜像倒影

```tsx
function CardWithReflection() {
  return (
    <div>
      {/* 原卡片 */}
      <div className="card" style={{
        background: 'linear-gradient(to bottom, #667eea, #764ba2)',
        padding: '20px',
        borderRadius: '10px',
        color: 'white'
      }}>
        <h2>Beautiful Card</h2>
        <p>This is a stunning card design</p>
      </div>
      
      {/* 倒影效果 */}
      <Container180>
        <div className="card" style={{
          background: 'linear-gradient(to bottom, #667eea, #764ba2)',
          padding: '20px',
          borderRadius: '10px',
          color: 'white',
          opacity: 0.2,
          filter: 'blur(4px)',
          marginTop: '-10px'
        }}>
          <h2>Beautiful Card</h2>
          <p>This is a stunning card design</p>
        </div>
      </Container180>
    </div>
  );
}
```

**效果：**
```
┌──────────────────┐
│ Beautiful Card   │ ← 原卡片（清晰）
│ This is a...     │
└──────────────────┘
┌──────────────────┐
│ ...si sihT       │ ← 倒影（模糊 + 半透明）
│   draC lufituaeB │
└──────────────────┘
```

---

### 案例2：对称的装饰边框

```tsx
function DecoratedSection() {
  const border = (
    <svg width="100%" height="20" viewBox="0 0 100 20">
      <path d="M0,10 Q25,0 50,10 T100,10" 
            stroke="currentColor" 
            fill="none" />
    </svg>
  );
  
  return (
    <div>
      {/* 顶部边框 */}
      {border}
      
      <div style={{ padding: '30px', background: '#f5f5f5' }}>
        <h2>装饰区域</h2>
        <p>内容区域...</p>
      </div>
      
      {/* 底部边框（倒置） */}
      <Container180>
        {border}
      </Container180>
    </div>
  );
}
```

**效果：**
```
  ∿∿∿∿∿∿∿∿∿      ← 顶部波浪线
┌──────────────┐
│ 装饰区域      │
│ 内容区域...   │
└──────────────┘
  ∽∽∽∽∽∽∽∽∽      ← 底部波浪线（倒置）
```

---

### 案例3：特殊的分隔线效果

```tsx
function StyledDivider() {
  return (
    <Container180>
      <hr style={{
        borderStyle: 'solid',
        borderWidth: '2px 0 0',
        borderColor: '#333',
        transform: 'scale(1, 0.5)',  // 缩小高度
        transformOrigin: '0 0'
      }} />
    </Container180>
  );
}
```

**说明：**
- `transform: scale(1, 0.5)` - 将线条高度缩小到原来的 0.5 倍
- 配合 `Container180` 的旋转，实现特殊的分隔线效果

---

## 🆚 与其他容器的区别

### BottomAlignedContainer（底部对齐容器）

```tsx
<BottomAlignedContainer>
  <img src="image.jpg" />
</BottomAlignedContainer>
```

**特点：**
- 双层 180° 旋转
- 内容底部对齐到容器位置
- 容器高度为 0

---

### Container180（180° 旋转容器）

```tsx
<Container180>
  <img src="image.jpg" />
</Container180>
```

**特点：**
- 单层 180° 旋转
- 内容上下颠倒
- 容器正常占用空间

---

## 🚀 最佳实践

### 1. 用于装饰性内容

```tsx
// ✅ 推荐：装饰图案
<Container180>
  <img src="decoration.svg" alt="" />
</Container180>

// ⚠️ 注意：文字会倒置
<Container180>
  <h1>标题</h1>  {/* 文字会上下颠倒，难以阅读 */}
</Container180>
```

---

### 2. 镜像效果配合透明度

```tsx
// ✅ 推荐：镜像 + 半透明 + 模糊
<Container180>
  <img 
    src="image.jpg"
    style={{
      opacity: 0.3,
      filter: 'blur(2px)'
    }}
  />
</Container180>

// ❌ 不推荐：仅旋转
<Container180>
  <img src="image.jpg" />  {/* 看起来只是倒置，不像镜像 */}
</Container180>
```

---

### 3. 配合边距控制间距

```tsx
// ✅ 推荐：添加边距
<div>
  <img src="top.png" />
  <Container180 mp={{ mt: 20 }}>
    <img src="top.png" />
  </Container180>
</div>

// ❌ 不好：没有间距
<div>
  <img src="top.png" />
  <Container180>
    <img src="top.png" />
  </Container180>
</div>
```

---

## ⚠️ 注意事项

### 1. 文字会倒置

```tsx
// ⚠️ 文字会上下颠倒，难以阅读
<Container180>
  <p>This text will be upside down</p>
</Container180>

// 结果：
// uʍop ǝpᴉsdn ǝq llᴉʍ ʇxǝʇ sᴉɥ⊥
```

**建议：** 仅用于不需要阅读的装饰性文字，或特殊效果。

---

### 2. 可能影响布局

```tsx
// ⚠️ 旋转后内容可能超出容器
<Container180>
  <div style={{ height: '100px' }}>
    高内容
  </div>
</Container180>
```

**解决：** 使用 `overflow: hidden` 或调整容器尺寸。

---

### 3. 动画和过渡

如果要添加旋转动画，需要考虑性能：

```tsx
// ✅ 使用 CSS 过渡
<div style={{
  transform: isFlipped ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 0.3s ease'
}}>
  {children}
</div>

// ⚠️ 频繁旋转可能影响性能
```

---

## 🎯 总结

**Container180 的本质：**

> "简单粗暴的 180° 旋转，让内容上下颠倒"

### 核心价值

1. ✅ **实现简单**：一行 CSS 搞定
2. ✅ **用途广泛**：镜像、倒置、装饰
3. ✅ **通用性强**：可包含任何内容
4. ✅ **性能优良**：纯 CSS，无需 JS

### 适用场景

| 场景 | 推荐指数 | 说明 |
|------|---------|------|
| **倒置分隔线** | ⭐⭐⭐⭐⭐ | 改变分隔线方向 |
| **镜像效果** | ⭐⭐⭐⭐⭐ | 创建倒影 |
| **对称装饰** | ⭐⭐⭐⭐ | 上下对称的图案 |
| **特殊效果** | ⭐⭐⭐ | 创意设计 |

### 不适用场景

- ❌ 需要阅读的文字内容
- ❌ 复杂的交互元素
- ❌ 需要保持方向的内容（如图标、logo）

---

## 🔗 相关组件

| 组件 | 旋转角度 | 用途 |
|------|---------|------|
| **Container180** | 180° | 上下颠倒 |
| Container90 | 90° | 顺时针竖排 |
| Container270 | 270° | 逆时针竖排 |

---

**Enjoy your flipped content!** 🔄✨

