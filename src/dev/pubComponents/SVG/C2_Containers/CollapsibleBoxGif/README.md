# CollapsibleBoxGif - GIF 控制盒子

## 🎬 这是什么？

`CollapsibleBoxGif` 是一个神奇的"GIF 播放器"。它的核心能力是：

**让 GIF 播放一次后自动消失** ⏱️

---

## 🤔 为什么需要"控制"GIF？

### GIF 的天生缺陷

GIF 图片有个致命问题：**一旦加载，就会无限循环播放** 🔄

```
普通 GIF 的行为：
┌─────────────────────────────────────┐
│  👋 (挥手动画)                       │
│  循环1 → 循环2 → 循环3 → ...无限循环  │
│  ❌ 无法停止                          │
└─────────────────────────────────────┘
```

这在很多场景下是不合适的：
- ❌ 用户想看一次完整动画，然后看到最终画面
- ❌ 动画循环太多次，显得廉价、吵闹
- ❌ 浪费用户注意力

### 我们的解决方案

```
CollapsibleBoxGif 的行为：
┌─────────────────────────────────────┐
│  👋 (挥手动画 - 播放1次)              │
│  ⏱️  2秒后...                        │
│  💥 盒子坍塌 → GIF消失                │
│  🖼️  显示静态图片（可选）              │
└─────────────────────────────────────┘
```

---

## 🎯 "控制"的原理

### 核心思想：物理控制，而非软件控制

我们不是真正"停止"GIF（浏览器不支持），而是**把整个 GIF 从 DOM 中移除** 🗑️

就像：
- 你想停止一台音响 🔊
- 但音响没有停止键
- **那就直接拔掉电源插头** 🔌💥

### 技术实现

#### 1. 时间线演示

```
时刻 0s (用户点击)
┌──────────────────────────────────┐
│                                  │
│   🎬 GIF 开始播放                 │
│   (children 区域)                │
│                                  │
└──────────────────────────────────┘
      🖱️ 用户点击了热区
      ⬇️ 触发两个动画


时刻 0.1s (GIF 播放中)
┌──────────────────────────────────┐
│   🏃 GIF 播放中... (第0.5圈)      │
└──────────────────────────────────┘
                                    [新图片在屏幕外等待]
                                    (foreignObject x=2250，看不见)


时刻 1.0s (GIF 继续播放)
┌──────────────────────────────────┐
│   🏃💨 GIF 播放中... (第1圈完成)  │
└──────────────────────────────────┘
                                    [新图片仍在等待]


时刻 2.0s (达到 gifDuration)
┌──────────────────────────────────┐
│   💥 宽度坍塌！整个盒子消失        │
│   🖼️  新图片瞬间移入并显示         │
└──────────────────────────────────┘
      GIF 被移除 DOM = "停止播放"
```

#### 2. 代码层面的魔法

```tsx
<CollapsibleBoxGif 
  gifDuration={2}  // ⏱️ 关键参数：给 GIF 留 2 秒播放时间
  afterSwitchImgUrl="final.jpg"  // 🖼️ 2秒后显示的图片
>
  <img src="animation.gif" />  {/* 🎬 GIF 动画 */}
</CollapsibleBoxGif>
```

**内部发生了什么：**

```html
<!-- children 区域：用户看到的 GIF -->
<section style="height: 0; overflow: visible;">
  <img src="animation.gif" />  <!-- 🎬 正在播放 -->
</section>

<!-- 控制层：两个关键动画 -->
<svg>
  <!-- ⏱️ 动画1：延迟坍塌 -->
  <animate
    attributeName="width"
    begin="click+2s"  <!-- 2秒后才执行 -->
    values="100%;0;0"  <!-- 宽度变为0 = 整个容器消失 -->
  />

  <g>
    <!-- 🚀 动画2：立即平移 -->
    <animateTransform
      begin="click"  <!-- 立即执行 -->
      values="0 0; -2250 0; -2250 0"  <!-- 把新图片从屏幕外移入 -->
    />

    <!-- 🖼️ 新图片（初始在屏幕外 x=2250） -->
    <foreignObject x="2250">
      <svg style="background-image: url('final.jpg')" />
    </foreignObject>
  </g>
</svg>
```

---

## 🆚 与 CollapsibleBoxFade 的区别

### CollapsibleBoxFade（淡入淡出版）

```
时间线：
0s: 用户点击
    ⬇️
0-0.5s: opacity 从 0 → 1 (淡入动画)
    ⬇️
0.5s: 新图片完全显示
    ⬇️
0.5s: 整个盒子坍塌
```

**特点：**
- ✨ 有优雅的淡入效果
- ⏱️ `duration` = 淡入动画时长（默认0.5秒）
- 🎯 适合场景：图片切换、内容替换

**核心代码：**
```html
<g opacity="0">  <!-- 初始透明 -->
  <animate
    attributeName="opacity"
    values="0;1"  <!-- 淡入 -->
    dur="0.5s"
  />
</g>
```

### CollapsibleBoxGif（GIF控制版）

```
时间线：
0s: 用户点击
    ⬇️
0-2s: GIF 播放（无任何遮挡）
    ⬇️
2s: 整个盒子坍塌
    ⬇️
2s: 新图片瞬间显示（无淡入）
```

**特点：**
- 🚫 **没有** opacity 动画
- ⏱️ `gifDuration` = GIF 播放时长（默认2秒）
- 🎯 适合场景：GIF 动画控制

**核心代码：**
```html
<g>  <!-- 注意：没有 opacity="0" -->
  <!-- 没有 opacity 动画！ -->
  <!-- GIF 可以正常显示，不会被遮挡 -->
</g>
```

---

## 🎨 实际使用场景

### 场景1：产品介绍动画

```tsx
<CollapsibleBoxGif 
  viewBoxW={450} 
  viewBoxH={450}
  gifDuration={3}  // GIF 动画需要3秒播放完
  afterSwitchImgUrl="/product-final.jpg"
>
  <img src="/product-animation.gif" />
</CollapsibleBoxGif>
```

**用户体验：**
1. 👆 用户点击 → 看到产品动画（3秒）
2. ⏰ 3秒后 → 动画消失，展示产品实拍图
3. ✅ 完美！既有动态吸引力，又有静态展示

---

### 场景2：游戏角色技能展示

```tsx
<CollapsibleBoxGif 
  viewBoxW={600} 
  viewBoxH={400}
  gifDuration={2.5}  // 技能动画2.5秒
  afterSwitchImgUrl="/skill-icon.png"
>
  <img src="/skill-animation.gif" />
</CollapsibleBoxGif>
```

**用户体验：**
1. 🎮 点击技能 → 播放技能特效 GIF
2. 💥 2.5秒后 → 特效消失，显示技能图标
3. 🎯 清晰直观，不会无限循环干扰

---

### 场景3：教程引导动画

```tsx
<CollapsibleBoxGif 
  viewBoxW={300} 
  viewBoxH={500}
  gifDuration={4}  // 教程动画4秒
  afterSwitchImgUrl="/tutorial-complete.jpg"
>
  <img src="/how-to-use.gif" />
</CollapsibleBoxGif>
```

**用户体验：**
1. 📖 点击"查看教程" → 播放操作示范 GIF
2. ✅ 4秒后 → 显示"已完成"标识
3. 👍 用户看一次就够，不会重复骚扰

---

## 🔧 参数调优指南

### gifDuration 怎么设置？

**公式：**
```
gifDuration = GIF总帧数 × 每帧延迟 × 想播放的圈数
```

**示例：**

1. **GIF 信息：** 30帧，每帧0.05秒
   - 一圈时长 = 30 × 0.05 = 1.5秒
   - 播放1圈：`gifDuration={1.5}`
   - 播放2圈：`gifDuration={3}`

2. **不知道 GIF 时长？**
   - 用工具查看：Photoshop、GIMP、在线 GIF 分析器
   - 或者凭感觉：短动画1-2秒，长动画3-5秒

### afterSwitchImgUrl 的最佳实践

1. **建议提供**：否则会显示占位图
2. **最好是 GIF 的最后一帧**：视觉连贯
3. **尺寸一致**：避免跳变

---

## 🎭 与 CollapsibleBox 家族的定位

```
CollapsibleBox (基础版)
├─ 特点：简单粗暴，点击坍塌
├─ 场景：临时内容隐藏
└─ 动画：无淡入淡出，纯坍塌

CollapsibleBoxFade (淡入版)
├─ 特点：优雅过渡，淡入淡出
├─ 场景：图片切换、内容替换
└─ 动画：opacity 淡入 + 坍塌

CollapsibleBoxGif (GIF控制版)  ⬅️ 你在这里
├─ 特点：GIF 播放控制，无遮挡
├─ 场景：动画播放、教程展示
└─ 动画：无 opacity，纯坍塌 + 延迟
```

---

## 💡 总结

### 核心原理
**通过物理移除 GIF 元素来"停止"播放**

### 三个关键
1. ⏱️ `gifDuration`：控制 GIF 播放多久
2. 🖼️ `afterSwitchImgUrl`：GIF 消失后显示什么
3. 🚫 无 opacity 动画：让 GIF 正常显示，不被遮挡

### 适用场景
- ✅ 产品演示动画
- ✅ 游戏技能展示
- ✅ 教程引导动画
- ✅ 任何需要"播放一次就停"的 GIF

### 不适用场景
- ❌ 需要淡入淡出效果（用 `CollapsibleBoxFade`）
- ❌ 需要循环播放（直接用 `<img>`）
- ❌ 需要视频控制（用 `<video>`）

---

**享受你的 GIF 控制之旅！** 🎬✨

