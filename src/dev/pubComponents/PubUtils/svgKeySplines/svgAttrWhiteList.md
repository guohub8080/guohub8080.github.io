# SVG 动画属性白名单

定义了支持的 SVG 动画元素及其可动画属性，用于校验和约束动画配置的合法性。

## 使用方法

```typescript
import { 
  SVG_ANIMATION_WHITELIST,
  WHITELIST_BY_ELEMENT,
  isAttrInWhitelist,
  isElementAttrValid,
  getAttrInfo,
  getSupportedAttrs
} from './svgAttrWhiteList';

// 检查属性是否在白名单中
isAttrInWhitelist('opacity');  // true

// 检查元素-属性组合是否有效
isElementAttrValid('animate', 'opacity');  // true
isElementAttrValid('animate', 'translate');  // false

// 获取属性详细信息
const info = getAttrInfo('animate', 'opacity');
// { id: 5, element: 'animate', name: 'opacity', description: '...' }

// 获取指定元素支持的所有属性
getSupportedAttrs('animate');
// ['x', 'y', 'width', 'height', 'opacity', ...]
```

## 白名单列表

### 1. `<animate>` 元素

用于对 SVG 元素的属性进行基础动画控制。

| 序号 | 属性名 | 说明 |
|------|--------|------|
| 1 | `x` | 控制简单几何体 x 轴方向移动，创意应用如柱状图等 |
| 2 | `y` | 控制简单几何体 y 轴方向移动，创意应用如柱状图等 |
| 3 | `width` | 控制简单几何体宽度变化，创意应用如伸长式图文（宽度自适应） |
| 4 | `height` | 控制简单几何体高度变化，创意应用如伸长式图文、预占位等 |
| 5 | `opacity` | 控制透明度变化，数值为 0 到 1 |
| 6 | `d` | 控制贝塞尔曲线补间行为，但表现具有随机性 |
| 7 | `points` | 控制多边形补间行为，但表现具有随机性 |
| 8 | `stroke-width` | 描边宽度、描边端点和描边偏移量，创意应用如遮罩动画、饼/分图、进度线等 |
| 9 | `stroke-linecap` | 描边宽度、描边端点和描边偏移量，创意应用如遮罩动画、饼/分图、进度线等 |
| 10 | `stroke-dashoffset` | 描边宽度、描边端点和描边偏移量，创意应用如遮罩动画、饼/分图、进度线等 |
| 11 | `fill` | 控制填充色过渡变化 |

#### 使用示例

```xml
<!-- 透明度动画 -->
<rect width="100" height="100" fill="blue">
  <animate attributeName="opacity" 
           values="0;1;0" 
           keyTimes="0;0.5;1"
           dur="2s" 
           repeatCount="indefinite"/>
</rect>

<!-- 位置动画 -->
<circle cx="50" cy="50" r="20" fill="red">
  <animate attributeName="x" 
           values="0;100;0" 
           dur="3s" 
           repeatCount="indefinite"/>
</circle>
```

### 2. `<set>` 元素

用于设置属性值，无过渡效果。

| 序号 | 属性名 | 说明 |
|------|--------|------|
| 12 | `visibility` | 控制可见性效果的表达，数值包括 visible \| hidden \| collapse \| inherit，创意应用如防误触等 |

#### 使用示例

```xml
<!-- 延迟显示 -->
<rect width="100" height="100" fill="green" visibility="hidden">
  <set attributeName="visibility" 
       to="visible" 
       begin="2s"/>
</rect>
```

### 3. `<animateTransform>` 元素

用于对 SVG 元素的变换属性进行动画控制。

| 序号 | 属性名 | 说明 |
|------|--------|------|
| 13 | `translate` | 控制路径和编组的位移 |
| 14 | `scale` | 控制路径和编组的 x、y 轴缩放，创意应用如伪翻转等 |
| 15 | `rotate` | 控制路径和编组的旋转 |
| 16 | `skewX` | 控制路径和编组的 x 轴倾斜，创意应用如台历翻阅等 |
| 17 | `skewY` | 控制路径和编组的 y 轴倾斜，创意应用如书籍翻阅等 |

#### 使用示例

```xml
<!-- 旋转动画 -->
<rect width="50" height="50" fill="orange" x="25" y="25">
  <animateTransform attributeName="transform"
                    type="rotate"
                    values="0 50 50;360 50 50"
                    dur="2s"
                    repeatCount="indefinite"/>
</rect>

<!-- 缩放动画 -->
<circle cx="50" cy="50" r="20" fill="purple">
  <animateTransform attributeName="transform"
                    type="scale"
                    values="1;1.5;1"
                    dur="1s"
                    repeatCount="indefinite"/>
</circle>

<!-- 位移动画 -->
<g>
  <animateTransform attributeName="transform"
                    type="translate"
                    values="0,0;100,0;0,0"
                    dur="3s"
                    repeatCount="indefinite"/>
  <rect width="30" height="30" fill="cyan"/>
</g>
```

### 4. `<animateMotion>` 元素

用于沿路径的运动动画。

| 序号 | 属性名 | 说明 |
|------|--------|------|
| 28 | `path` | 单行/复杂的轨迹动画，可通过 rotate 定义朝向，创意应用如轨迹飞行等 |

#### 使用示例

```xml
<!-- 沿路径运动 -->
<circle r="10" fill="red">
  <animateMotion dur="5s" 
                 repeatCount="indefinite"
                 path="M 0,0 Q 50,100 100,0 T 200,0"
                 rotate="auto"/>
</circle>

<!-- 沿圆形路径运动 -->
<rect width="20" height="20" fill="blue">
  <animateMotion dur="4s"
                 repeatCount="indefinite"
                 path="M 100,100 m -50,0 a 50,50 0 1,0 100,0 a 50,50 0 1,0 -100,0"
                 rotate="auto-reverse"/>
</rect>
```

## 数据类型

### SvgAnimationElement

支持的 SVG 动画元素类型：

```typescript
type SvgAnimationElement = 'animate' | 'set' | 'animateTransform' | 'animateMotion';
```

### SvgAnimationAttr

动画属性配置项：

```typescript
interface SvgAnimationAttr {
  id: number;           // 序号
  element: SvgAnimationElement;  // 元素类型
  name: string;         // 属性名
  description: string;  // 备注说明
}
```

## API 参考

### 常量导出

#### `SVG_ANIMATION_WHITELIST`

完整的白名单数组，包含所有支持的动画属性配置。

```typescript
const SVG_ANIMATION_WHITELIST: readonly SvgAnimationAttr[];
```

#### `WHITELIST_BY_ELEMENT`

按元素类型分组的白名单索引，用于快速查找某个元素支持的所有属性。

```typescript
const WHITELIST_BY_ELEMENT: {
  animate: readonly SvgAnimationAttr[];
  set: readonly SvgAnimationAttr[];
  animateTransform: readonly SvgAnimationAttr[];
  animateMotion: readonly SvgAnimationAttr[];
};
```

### 工具函数

#### `isAttrInWhitelist(attrName: string): boolean`

检查属性名是否在白名单中（不区分元素类型）。

**参数：**
- `attrName` - 属性名

**返回：**
- `boolean` - 是否在白名单中

**示例：**
```typescript
isAttrInWhitelist('opacity');  // true
isAttrInWhitelist('invalid');  // false
```

---

#### `isElementAttrValid(element: SvgAnimationElement, attrName: string): boolean`

检查元素-属性组合是否在白名单中。

**参数：**
- `element` - 元素类型
- `attrName` - 属性名

**返回：**
- `boolean` - 是否在白名单中

**示例：**
```typescript
isElementAttrValid('animate', 'opacity');          // true
isElementAttrValid('animateTransform', 'scale');   // true
isElementAttrValid('animate', 'translate');        // false - translate只能用于animateTransform
```

---

#### `getAttrInfo(element: SvgAnimationElement, attrName: string): SvgAnimationAttr | undefined`

获取属性的详细信息。

**参数：**
- `element` - 元素类型
- `attrName` - 属性名

**返回：**
- `SvgAnimationAttr | undefined` - 属性配置项，如果不存在则返回 undefined

**示例：**
```typescript
const info = getAttrInfo('animate', 'opacity');
// {
//   id: 5,
//   element: 'animate',
//   name: 'opacity',
//   description: '控制透明度变化，数值为 0 到 1'
// }
```

---

#### `getSupportedAttrs(element: SvgAnimationElement): string[]`

获取指定元素支持的所有属性名。

**参数：**
- `element` - 元素类型

**返回：**
- `string[]` - 属性名数组

**示例：**
```typescript
getSupportedAttrs('animate');
// ['x', 'y', 'width', 'height', 'opacity', 'd', 'points', 
//  'stroke-width', 'stroke-linecap', 'stroke-dashoffset', 'fill']

getSupportedAttrs('animateTransform');
// ['translate', 'scale', 'rotate', 'skewX', 'skewY']
```

## 注意事项

1. **属性兼容性**：不同的 SVG 元素支持的属性不同，使用前请确认兼容性
2. **数值格式**：不同属性对值的格式要求不同（如 `opacity` 为 0-1，`d` 为路径字符串）
3. **性能考虑**：复杂路径动画（`d`、`points`）可能影响性能
4. **浏览器支持**：某些属性在旧版浏览器中可能不支持

## 相关文档

- [genSvgKeysByTimeStamp](README.md) - 时间轴动画配置转换器
- [MDN - SVG Animation](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animate)
- [SVG Specification](https://www.w3.org/TR/SVG11/animate.html)

