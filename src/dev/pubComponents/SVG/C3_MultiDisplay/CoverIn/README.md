# CoverIn 组件

层层覆盖组件，多张图片依次滑入覆盖，形成层层刷新的效果。

## 核心特性

- 支持任意数量的图片
- 每张图可独立控制滑入方向、滑入时长、停留时长
- 两组动画无缝衔接，实现平滑的无限循环效果

## 使用示例

```tsx
<CoverIn pics={[
  { url: pic1, direction: "L", stayDuration: 0 },
  { url: pic2, direction: "R", stayDuration: 0 },
  { url: pic3, direction: "B", stayDuration: 0 },
  { url: pic4, direction: "T", stayDuration: 0 },
]} />
```

## 动画流程

假设有 n 张图片（以 4 张图为例说明）：

### 第一轮（一次性，`repeatCount="1"`）

1. **图1静止显示**：只显示，不飞入，持续时间为 `图1.stayDuration`
2. **图2飞入 + 停留**：经过 `coverInDuration` 飞入，停留 `stayDuration`
3. **图3飞入 + 停留**：经过 `coverInDuration` 飞入，停留 `stayDuration`
4. **图4飞入 + 停留**：经过 `coverInDuration` 飞入，停留 `stayDuration`

**第一轮总时长** = `图1.stayDuration + 图2.(coverIn+last) + 图3.(coverIn+last) + 图4.(coverIn+last)`

### 第二轮开始（无限循环，`repeatCount="indefinite"`）

1. **图1飞入 + 停留**：经过 `coverInDuration` 飞入，停留 `stayDuration`
2. **图2飞入 + 停留**：经过 `coverInDuration` 飞入，停留 `stayDuration`
3. **图3飞入 + 停留**：经过 `coverInDuration` 飞入，停留 `stayDuration`
4. **图4飞入 + 停留**：经过 `coverInDuration` 飞入，停留 `stayDuration`
5. 回到步骤 1，无限循环

**循环总时长** = `图1.(coverIn+last) + 图2.(coverIn+last) + 图3.(coverIn+last) + 图4.(coverIn+last)`

**第二轮开始时间** = `firstRoundDuration`（第一轮结束后立即开始）

## 两层动画设计巧思

### 为什么需要两组动画？

最初的设计尝试用一组动画实现循环，但遇到了一个核心问题：

**问题场景**：当所有 `stayDuration=0` 时，最后一张图（图4）滑入完成后立即到达循环末尾，需要瞬间重置回初始位置。这时：
- 第一张图（图1）在循环开始时是"静止显示"的
- 第二轮开始时，图1 需要"飞入"
- 如果用同一组动画，图1 既要在开始时静止，又要在循环时飞入，逻辑冲突

### 两组动画方案

通过分离成两组独立的动画，完美解决了这个问题：

#### 第一组动画（一次性）

```tsx
// 初始静止图（图1）
<CoverInPicOne
  groupType="initialStatic"
  animationMode="once"
  // 在 图1.stayDuration 结束时淡出
/>

// 第一轮滑入图（图2/3/4）
{firstRoundSlides.map((pic, index) => (
  <CoverInPicOne
    groupType="loopSlide"
    animationMode="once"
    timeOffset={initialStatic.stayDuration} // 从图1的stayDuration后开始
  />
))}
```

**特点**：
- `repeatCount="1"`：只运行一次
- `begin="0s"`：从 0 秒开始
- `duration={firstRoundDuration}`：第一轮的总时长
- 图1 静止显示后淡出
- 图2/3/4 依次滑入，滑入完成后停留在最终位置

#### 第二组动画（循环）

```tsx
// 循环滑入图（图1/2/3/4）
{loopSlides.map((pic, index) => (
  <CoverInPicOne
    groupType="loopSlide"
    animationMode="loop"
    firstRoundDuration={firstRoundDuration} // 用于计算begin时间
  />
))}
```

**特点**：
- `repeatCount="indefinite"`：无限循环
- `begin="${firstRoundDuration}s"`：从第一轮结束后开始
- `duration={loopDuration}`：循环的总时长
- 所有图（包括图1）都是飞入的，每轮结束时重置位置

### 关键设计点

#### 1. 时间衔接

```
时间轴：
0s                    firstRoundDuration        firstRoundDuration + loopDuration
|------ 第一组动画 ------|------ 第二组动画（第1轮）------|------ 第二组动画（第2轮）------|...
```

两组动画在 `firstRoundDuration` 时刻无缝衔接，视觉上完全流畅。

#### 2. timeOffset 的作用

第一轮的滑入图（图2/3/4）需要从 `图1.stayDuration` 时刻才开始动画，通过 `timeOffset` 参数实现：

```typescript
// 计算滑入开始时间
let slideInStartTime = defaultTo(timeOffset, 0); // 从timeOffset开始
for (let i = 0; i < currentIndex; i++) {
    slideInStartTime += allSlides[i].coverInDuration + allSlides[i].stayDuration;
}
```

#### 3. keyTimes 的严格递增

SVG 动画的 `keyTimes` 必须严格递增（`0 ≤ t1 < t2 < ... < 1`），否则会报错。

当某张图的滑入结束时间接近或等于总时长时，需要动态调整：

```typescript
const rawKeyTime3 = slideInEndTime / duration;
// 确保 keyTime3 < keyTime4
keyTime3 = rawKeyTime3 >= keyTime4 ? keyTime4 - 0.00001 : rawKeyTime3;
```

这样避免了硬编码的魔法数字，能适应任意参数组合。

#### 4. 第一轮 vs 循环的差异

|  | 第一轮（once） | 循环（loop） |
|---|---|---|
| **图1** | 静止显示（不飞入） | 飞入 |
| **图2/3/4** | 飞入 | 飞入 |
| **结束时** | 停留在最终位置 | 重置回初始位置 |
| **repeatCount** | 1 | indefinite |
| **values** | 4个关键点（无重置） | 5个关键点（有重置） |

### 优势总结

1. **逻辑清晰**：第一轮和循环的行为分离，各自独立
2. **无缝衔接**：两组动画在时间上精确对接，视觉流畅
3. **灵活性高**：支持任意参数组合，包括所有 `stayDuration=0` 的极端情况
4. **可维护性强**：代码结构清晰，易于理解和修改

## 参数说明

### CoverIn Props

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `pics` | `PicConfig[]` | `[]` | 图片配置数组 |
| `viewBoxW` | `number` | `auto` | SVG viewBox 宽度 |
| `viewBoxH` | `number` | `auto` | SVG viewBox 高度 |
| `mp` | `mpProps` | `{}` | margin/padding 配置 |

### PicConfig

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `url` | `string` | 必填 | 图片URL |
| `coverInDuration` | `number` | `0.5` | 滑入时长（秒） |
| `stayDuration` | `number` | `0.5` | 停留时长（秒） |
| `direction` | `"T" \| "B" \| "L" \| "R"` | `"B"` | 滑入方向：T-从下往上, B-从上往下, L-从右往左, R-从左往右 |

## 常见问题

### Q: 为什么第一张图在第一轮不飞入？

A: 这是设计特性。第一张图作为初始画面，直接静止显示更自然。从第二轮开始，所有图（包括图1）都会飞入，形成统一的循环效果。

### Q: 当所有 stayDuration=0 时，会不会出现跳跃？

A: 不会。通过两组动画的设计和 keyTimes 的动态调整，即使所有停留时间为0，图片也会平滑滑入，不会跳跃或闪烁。

### Q: 可以只有1张图吗？

A: 可以。组件会自动处理：
- 第一轮：图1静止显示
- 第二轮：图1飞入，循环

### Q: 第一轮和第二轮的总时长不同，会不会有问题？

A: 不会。两组动画的 `duration` 是独立的：
- 第一组：`duration={firstRoundDuration}`
- 第二组：`duration={loopDuration}`，`begin="${firstRoundDuration}s"`

通过精确的时间计算，确保无缝衔接。

## 技术细节

### SVG animateTransform

使用 `<animateTransform>` 实现滑入动画：

```tsx
<animateTransform
  attributeName="transform"
  type="translate"
  values="0 0;0 0;0 -500;0 -500;0 0"  // 初始→等待→滑入→保持→重置
  keyTimes="0;0.25;0.5;0.99999;1"     // 对应时间点
  begin="${firstRoundDuration}s"
  dur="${loopDuration}s"
  calcMode="spline"
  keySplines="0.8 0 0.2 1;..."        // 缓动曲线
  repeatCount="indefinite"
/>
```

### SVG animate（opacity）

初始静止图使用 `<animate>` 实现淡出：

```tsx
<animate
  attributeName="opacity"
  values="1;1;0"                      // 显示→等待→淡出
  keyTimes="0;0.5;0.51"               // 对应时间点
  dur="${firstRoundDuration}s"
  repeatCount="1"
  fill="freeze"
/>
```

## 相关组件

- **CoverOut**: 图片滑出效果，与 CoverIn 相反
- **Carousel**: 传统轮播效果
- **TouchSlide**: 支持触摸滑动的图片展示

