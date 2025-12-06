import React from "react";
import { DocumentExport } from "../data/svgDocumentLoader.tsx";
import SectionEx from "../../../dev/pubComponents/PureHTML/basicEx/SectionEx.tsx";
import {
  CodeBlock,
  Section,
  H1,
  H2,
  P,
  Description
} from "../data/components";

const Article = () => {
  return (
    <SectionEx>
      <H1>SVG 动画参数指南</H1>
      <Section>
        <Description style={{ marginTop: '8px' }}>
          介绍通用参数 additive、freeze、动画如何重播，以及各 gen 函数的推荐设置
        </Description>
      </Section>

      <H2 style={{ marginTop: '20px' }}>additive（叠加）</H2>
      <Section>
        <P>控制该动画是否与元素现有的 transform/属性动画进行叠加。</P>
        <ul style={{ marginLeft: 20 }}>
          <li><strong>sum</strong>：与现有变换叠加（推荐用于 transform 类动画的组合，例如多段 translate/scale/rotate 同时进行）。</li>
          <li><strong>默认建议</strong>：库内部在需要组合变换时会启用 <code>additive="sum"</code>。调用方通常无需显式设置。</li>
        </ul>
        <CodeBlock code={`// 多段变换组合时使用 additive="sum"
<animateTransform type="translate" additive="sum" ... />
<animateTransform type="scale"      additive="sum" ... />
<animateTransform type="translate" additive="sum" ... />`} />
      </Section>

      <H2 style={{ marginTop: '20px' }}>freeze（保留最终状态）</H2>
      <Section>
        <P>控制动画结束后元素是否保持在最后一帧的状态。</P>
        <P style={{ marginTop: 8 }}>
          可用元素：<code>animate</code>、<code>animateTransform</code>、<code>animateMotion</code>、<code>set</code> 均支持 <code>fill</code> 属性（<code>freeze</code>/<code>remove</code>）。
        </P>
        <ul style={{ marginLeft: 20 }}>
          <li><strong>false</strong>（默认）：动画结束后回到原始状态，适合循环或往返动效。</li>
          <li><strong>true</strong>：动画结束后停留在最后一帧，适合一次性入场或状态切换。</li>
        </ul>
        <ul style={{ marginLeft: 20, marginTop: 6 }}>
          <li>
            与 <code>loopCount</code> 的关系：当 <code>loopCount: 0</code>（无限循环）时，动画不会结束，<code>freeze</code> 自然也不会生效；
            想定格需使用有限播放（通常 1 次）+ <code>freeze: true</code>。
          </li>
          <li>
            本库取舍：入场/状态切换推荐 <code>loopCount: 1, freeze: true</code>；呼吸/闪烁/旋转等循环推荐 <code>loopCount: 0</code>（无需 <code>freeze</code>）。
          </li>
        </ul>
        <CodeBlock code={`// 一次性入场后保持
{genAnimateScale({
  timeline: [{ timeSpanSec: 0.6, toValue: 1.2 }],
  freeze: true
})}`} />
      </Section>

      <H2 style={{ marginTop: '20px' }}>动画如何重新开始播放</H2>
      <Section>
        <P>常见的三种重播方式：</P>
        <ol style={{ marginLeft: 20 }}>
          <li><strong>React 重新挂载</strong>：给包含动画的节点设置随参数变化的 <code>key</code>，变更时强制重新渲染，动画从头开始。</li>
          <li><strong>事件触发</strong>：设置 <code>begin="click"</code> 或库参数 <code>isBeginWithClick: true</code>，点击后重播。</li>
          <li><strong>脚本触发</strong>：给动画元素设置 <code>id</code> 并在脚本中调用 <code>document.getElementById(id).beginElement()</code>。</li>
        </ol>
        <CodeBlock code={`// 方式1：React key 变更
<g key={
  [dur, easing, loopCount].join('-')
}>
  {genAnimateTranslate({...})}
</g>

// 方式2：点击触发
{genAnimateScale({ timeline: [...], isBeginWithClick: true })}

// 方式3：脚本触发（需要 id）
<animateTransform id="scaleAnim" begin="indefinite" ... />
// 脚本：document.getElementById('scaleAnim')?.beginElement();`} />
      </Section>

      <H2 style={{ marginTop: '20px' }}>微信公众号编辑器环境（不支持 id）</H2>
      <Section>
        <P>在部分平台（如公众号编辑器）中无法使用 <code>id</code> 和脚本重播，推荐以下两种方式：</P>
        <ul style={{ marginLeft: 20 }}>
          <li>
            <strong>变更 key 重新挂载</strong>：通过 React 的 <code>key</code> 强制重新渲染，动画从头开始；无需 <code>id</code> 或脚本权限。
          </li>
          <li>
            <strong>点击触发</strong>：使用 <code>isBeginWithClick: true</code>，用户点击目标元素即可播放/重播。
          </li>
        </ul>
        <CodeBlock code={`// 无 id 环境：推荐 1）变更 key 重播
<g key={
  [dur, easing, loopCount, version].join('-')
}>
  {genAnimateScale({ timeline: [...], loopCount: 1, freeze: true })}
</g>
// 变更 version 触发重播

// 或 2）点击触发（无需 id）
{genAnimateScale({ timeline: [...], isBeginWithClick: true, loopCount: 1 })}`} />
      </Section>

      <H2 style={{ marginTop: '20px' }}>推荐设置（各 gen* 函数）</H2>
      <Section>
        <ul style={{ marginLeft: 20, lineHeight: 1.9 }}>
          <li><strong>genAnimateTranslate</strong>：
            <ul style={{ marginLeft: 18 }}>
              <li>循环动效：<code>loopCount: 0</code>；过渡动效：<code>loopCount: 1</code></li>
              <li>与其他变换组合：内部已处理叠加；调用方一般不必设置 <code>additive</code></li>
              <li>需要停在终点：<code>freeze: true</code></li>
            </ul>
          </li>
          <li><strong>genAnimateScale</strong>：
            <ul style={{ marginLeft: 18 }}>
              <li>任意原点缩放：无需额外样式；库内部以 translate-scale-translate 组合保证原点正确</li>
              <li>简单中心缩放：也可用 <code>getCenterScaleStyle()</code> 辅助 CSS 原点</li>
              <li>呼吸/脉动：<code>loopCount: 0</code>；一次性放大入场：<code>freeze: true</code></li>
            </ul>
          </li>
          <li><strong>genAnimateRotate</strong>：
            <ul style={{ marginLeft: 18 }}>
              <li>围绕任意点旋转：与缩放类似，优先传入 <code>elementBounds</code> 或使用相应 origin 方案</li>
              <li>无缝旋转（转圈）：通常 <code>loopCount: 0</code> + 线性缓动</li>
            </ul>
          </li>
          <li><strong>genAnimateOpacity</strong>（如有）：
            <ul style={{ marginLeft: 18 }}>
              <li>淡入后保持：<code>freeze: true</code></li>
              <li>循环闪烁：<code>loopCount: 0</code></li>
            </ul>
          </li>
        </ul>
        <CodeBlock code={`// 常见模板：呼吸缩放
{genAnimateScale({
  initScale: 1,
  timeline: [
    { timeSpanSec: 1.2, toValue: 1.15, keySplines: getEaseBezier({ isIn: true, isOut: true }) },
    { timeSpanSec: 1.2, toValue: 1 }
  ],
  loopCount: 0
})}`} />
      </Section>
    </SectionEx>
  );
};

const preset: DocumentExport = {
  title: "SVG 动画参数指南",
  jsx: <Article />
};

export default preset;


