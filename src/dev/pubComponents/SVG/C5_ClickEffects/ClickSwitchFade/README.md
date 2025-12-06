# ClickSwitchFade - 点击淡出切换组件

## 📝 组件说明

点击屏幕后，当前图片淡出消失，显示下一层图片。支持多张图片依次切换，可自定义每张图片的切换速度、贝塞尔曲线和点击热区。

## ✨ 特性

- ✅ **点击淡出动画**：点击后当前图片淡出，平滑过渡到下一张
- ✅ **自定义热区**：每张图片可设置独立的点击区域
- ✅ **缓动曲线控制**：支持自定义贝塞尔曲线，控制淡出动画效果
- ✅ **灵活的底层处理**：可选择最后一张图片是否保持显示
- ✅ **防止重复点击**：点击后热区立即失效，避免多次触发

## 🎯 使用场景

- 故事性内容展示（一页一页翻阅）
- 教程引导（点击查看下一步）
- 图片集浏览（点击切换下一张）
- 广告轮播（点击查看详情）

## 📦 基本用法

### 简单示例

```tsx
import ClickSwitchFade from "@pubSVG/C5_ClickEffects/ClickSwitchFade";

// 最简单的用法：3张图片依次切换
<ClickSwitchFade 
    pics={[
        { url: "图片1.jpg" },
        { url: "图片2.jpg" },
        { url: "图片3.jpg" }
    ]}
/>
```

### 自定义切换速度

```tsx
// 整体设置切换时长为 1 秒
<ClickSwitchFade 
    switchDuration={1}
    pics={[
        { url: "图片1.jpg" },
        { url: "图片2.jpg" }
    ]}
/>

// 为每张图片单独设置时长
<ClickSwitchFade 
    pics={[
        { url: "图片1.jpg", duration: 0.3 },  // 快速淡出
        { url: "图片2.jpg", duration: 1.5 }   // 慢速淡出
    ]}
/>
```

### 自定义缓动曲线

```tsx
import { getEaseBezier } from "@pubUtils/getBezier";

<ClickSwitchFade 
    pics={[
        { 
            url: "图片1.jpg", 
            keySplines: getEaseBezier({ isIn: true, isOut: true }) // ease-in-out
        },
        { 
            url: "图片2.jpg", 
            keySplines: getEaseBezier({ isIn: true, isOut: false }) // ease-in
        }
    ]}
/>
```

### 自定义点击热区

```tsx
// 只允许点击图片的中心区域
<ClickSwitchFade 
    viewBoxW={750}
    viewBoxH={1334}
    pics={[
        { 
            url: "图片1.jpg",
            hotArea: {
                x: 225,      // 热区 x 坐标
                y: 417,      // 热区 y 坐标
                w: 300,      // 热区宽度
                h: 500       // 热区高度
            }
        }
    ]}
/>
```

### 控制最后一张图片

```tsx
// 最后一张图片点击后也消失（全部消失）
<ClickSwitchFade 
    isLastImgMaintained={false}
    pics={[
        { url: "图片1.jpg" },
        { url: "图片2.jpg" },
        { url: "图片3.jpg" }
    ]}
/>

// 最后一张图片保持显示（默认行为）
<ClickSwitchFade 
    isLastImgMaintained={true}
    pics={[
        { url: "图片1.jpg" },
        { url: "图片2.jpg" },
        { url: "图片3.jpg" }  // 这张会一直显示
    ]}
/>
```

## 📋 Props 说明

### 主组件 Props (ClickSwitchFade)

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `pics` | `PicConfig[]` | `[占位图]` | 图片配置数组 |
| `switchDuration` | `number` | `0.5` | 默认切换时长（秒） |
| `viewBoxW` | `number` | 自动计算 | ViewBox 宽度 |
| `viewBoxH` | `number` | 自动计算 | ViewBox 高度 |
| `isLastImgMaintained` | `boolean` | `true` | 最后一张图片是否保持显示 |
| `mp` | `mpProps` | - | margin/padding 配置 |

### PicConfig 配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `url` | `string` | **必填** | 图片 URL |
| `duration` | `number` | `switchDuration` | 该图片的淡出时长（秒） |
| `keySplines` | `string` | `"0 0 1 1"` | 贝塞尔曲线（linear） |
| `hotArea` | `HotAreaConfig` | 全屏 | 点击热区配置 |

### HotAreaConfig 配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `x` | `number` | `0` | 热区左上角 x 坐标 |
| `y` | `number` | `0` | 热区左上角 y 坐标 |
| `w` | `number` | `viewBoxW` | 热区宽度 |
| `h` | `number` | `viewBoxH` | 热区高度 |

## 🔧 实现原理

### 1. 图层堆叠

图片按照 **倒序渲染**，形成从下到上的图层：

```
┌─────────────────┐
│   图片 1 (顶层)  │ ← 最先点击，淡出后显示图片 2
├─────────────────┤
│   图片 2 (中层)  │ ← 再次点击，淡出后显示图片 3
├─────────────────┤
│   图片 3 (底层)  │ ← 最后一张，保持显示（可选）
└─────────────────┘
```

### 2. 淡出动画

每一层使用 SVG `<animate>` 实现淡出：

```svg
<animate 
    attributeName="opacity" 
    begin="click"           <!-- 点击触发 -->
    dur="0.5s"             <!-- 0.5秒淡出 -->
    values="1;0"           <!-- 从不透明到透明 -->
    keySplines="0.42 0 0.58 1"  <!-- 缓动曲线 -->
    calcMode="spline"
    fill="freeze"          <!-- 保持最终状态 -->
/>
```

### 3. 热区控制

每层图片包含一个透明矩形作为热区：

- **点击前**：`opacity: 0`（透明）+ `pointerEvents: painted`（可点击）
- **点击后**：
  - 立即移出视野（`x` 移动到屏幕外）
  - 设置为 `visibility: hidden`
  - 防止重复点击触发动画

### 4. 最底层特殊处理

根据 `isLastImgMaintained` 参数：

- **`true`（默认）**：最底层图片无动画，永久显示
- **`false`**：所有图片都可点击消失

## 🎨 高级用法

### 示例 1：故事讲解（逐步展开）

```tsx
<ClickSwitchFade 
    switchDuration={0.8}
    pics={[
        { 
            url: "封面.jpg",
            duration: 0.3  // 快速切换到正文
        },
        { 
            url: "第一章.jpg",
            keySplines: getEaseBezier({ isIn: true, isOut: true })
        },
        { 
            url: "第二章.jpg",
            keySplines: getEaseBezier({ isIn: true, isOut: true })
        },
        { 
            url: "结尾.jpg"
        }
    ]}
/>
```

### 示例 2：局部热区点击

```tsx
// 只有点击按钮区域才能切换
<ClickSwitchFade 
    viewBoxW={750}
    viewBoxH={1334}
    pics={[
        { 
            url: "页面1.jpg",
            hotArea: {
                x: 275,      // 按钮位置
                y: 1100,
                w: 200,      // 按钮大小
                h: 80
            }
        },
        { 
            url: "页面2.jpg",
            hotArea: {
                x: 275,
                y: 1100,
                w: 200,
                h: 80
            }
        }
    ]}
/>
```

### 示例 3：全部消失效果

```tsx
// 所有图片点击后都消失，最后露出底色
<ClickSwitchFade 
    isLastImgMaintained={false}
    pics={[
        { url: "倒计时3.jpg" },
        { url: "倒计时2.jpg" },
        { url: "倒计时1.jpg" }
    ]}
/>
```

## ⚠️ 注意事项

### 1. ViewBox 尺寸

- 默认使用**第一张图片**的真实尺寸作为 ViewBox
- 建议所有图片使用**相同尺寸**，避免显示异常
- 如需强制指定，使用 `viewBoxW` 和 `viewBoxH` 参数

### 2. 点击热区

- 默认热区为**全屏**，点击任意位置都会触发
- 自定义热区时，确保热区在 ViewBox 范围内
- 热区坐标系统与 ViewBox 一致（左上角为原点）

### 3. 动画时长

- 单张图片的 `duration` 会覆盖全局 `switchDuration`
- 建议时长范围：0.3 ~ 2 秒
- 过短会显得生硬，过长会影响用户体验

### 4. 性能优化

- 图片数量建议控制在 **10 张以内**
- 大尺寸图片会影响加载速度
- 所有图片会同时加载（无懒加载）

## 🆚 与其他组件对比

| 组件 | 切换方式 | 动画效果 | 适用场景 |
|------|---------|----------|----------|
| `ClickSwitchFade` | 点击淡出 | 平滑淡出 | 故事讲解、教程引导 |
| `BlurSwitch` | 点击位移+模糊 | 虚焦切换 | 相机对焦效果 |
| `CoverInClick` | 点击滑入 | 新图滑入覆盖 | 页面切换 |
| `Carousel` | 自动轮播 | 连续滚动 | 广告展示 |

## 🔗 相关组件

- `ClickSwitchLayer` - 单个图层组件（内部使用）
- `BlurSwitch` - 虚焦切换组件
- `CoverInClick` - 滑入覆盖组件

## 📝 更新日志

### v1.0.0
- ✅ 基础点击淡出功能
- ✅ 自定义热区支持
- ✅ 贝塞尔曲线控制
- ✅ 防重复点击机制

