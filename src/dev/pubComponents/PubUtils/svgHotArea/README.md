# SVG 热区数据结构

提供热区的数据结构定义和辅助函数。

## 数据结构

### HotAreaConfig - 热区配置

```typescript
interface HotAreaConfig {
    x: number  // X 坐标
    y: number  // Y 坐标
    w: number  // 宽度
    h: number  // 高度
}
```

### ViewBoxSize - 视图尺寸

```typescript
interface ViewBoxSize {
    viewBoxW: number  // ViewBox 宽度
    viewBoxH: number  // ViewBox 高度
}
```

## 辅助函数

### 预设热区配置

提供常用的热区配置生成函数：

```typescript
import {
    getFullScreenHotArea,
    getNullHotArea,
    getLeftHalfHotArea,
    getRightHalfHotArea,
    getTopHalfHotArea,
    getBottomHalfHotArea,
    getTopLeftHotArea,
    getBottomLeftHotArea,
    getTopRightHotArea,
    getBottomRightHotArea,
} from '@/dev/utils/svgHotArea'

const size = { viewBoxW: 450, viewBoxH: 750 }

// 全屏热区
const fullScreen = getFullScreenHotArea(size)
// { x: 0, y: 0, w: 450, h: 750 }

// 无热区
const nullHotArea = getNullHotArea()
// { x: 0, y: 0, w: 0, h: 0 }

// 左半屏热区
const leftHalf = getLeftHalfHotArea(size)
// { x: 0, y: 0, w: 225, h: 750 }

// 右半屏热区
const rightHalf = getRightHalfHotArea(size)
// { x: 225, y: 0, w: 225, h: 750 }

// 上半屏热区
const topHalf = getTopHalfHotArea(size)
// { x: 0, y: 0, w: 450, h: 375 }

// 下半屏热区
const bottomHalf = getBottomHalfHotArea(size)
// { x: 0, y: 375, w: 450, h: 375 }

// 左上角热区（四分之一屏）
const topLeft = getTopLeftHotArea(size)
// { x: 0, y: 0, w: 225, h: 375 }

// 左下角热区（四分之一屏）
const bottomLeft = getBottomLeftHotArea(size)
// { x: 0, y: 375, w: 225, h: 375 }

// 右上角热区（四分之一屏）
const topRight = getTopRightHotArea(size)
// { x: 225, y: 0, w: 225, h: 375 }

// 右下角热区（四分之一屏）
const bottomRight = getBottomRightHotArea(size)
// { x: 225, y: 375, w: 225, h: 375 }
```


## 使用示例

### 基本用法

```typescript
import type { HotAreaConfig } from '@/dev/utils/svgHotArea'

// 手动定义热区
const config: HotAreaConfig = {
    x: 0,
    y: 0,
    w: 450,
    h: 375,
}
```

### 使用预设函数

```typescript
import { getTopHalfHotArea } from '@/dev/utils/svgHotArea'

// 使用预设函数
const topHotArea = getTopHalfHotArea({ viewBoxW: 450, viewBoxH: 750 })
// { x: 0, y: 0, w: 450, h: 375 }
```

### 配合 HotArea 组件使用

```tsx
import HotArea from '@pubSVG/C6_Advanced/HotArea'
import { getFullScreenHotArea } from '@/dev/utils/svgHotArea'

const hotAreaConfig = getFullScreenHotArea({ viewBoxW: 450, viewBoxH: 750 })

<svg viewBox="0 0 450 750">
  <HotArea 
    viewBoxW={450} 
    viewBoxH={750}
    {...hotAreaConfig}
  >
    <image href="..." />
  </HotArea>
</svg>
```

