import React, { useState } from "react";
import { DocumentExport } from "../data/svgDocumentLoader.tsx";
import SectionEx from "../../../dev/pubComponents/PureHTML/basicEx/SectionEx.tsx";
import { genAnimateTranslate } from "../../../dev/pubComponents/PubUtils/genSvgAnimateTransform/genAnimateTranslate";
import { genAnimateScale } from "../../../dev/pubComponents/PubUtils/genSvgAnimateTransform/genAnimateScale";
import { 
    getLinearBezier, 
    getEaseBezier, 
    getPowerBezier, 
    getSineBezier, 
    getExpoBezier, 
    getCircleBezier
} from "../../../dev/pubComponents/PubUtils/getBezier";
import { 
    CodeBlock, 
    PresetPreviewDisplayBlock, 
    EasingDemo,
    ControlPanel,
    ControlRow,
    Section,
    H1, 
    H2, 
    Description 
} from "../data/components";
import pic1 from "../data/assets/1.png";
import { Slider } from "antd";

const Article = () => {
    const viewBoxW = 375;
    const viewBoxH = 30;
    const imgSize = 30; // 图片宽高
    const moveDistance = 345; // 移动距离
    const duration = 2; // 动画时长
    
    const [linearDuration, setLinearDuration] = useState(duration);

    return (
        <SectionEx>
            <H1>缓动函数 KeySplines 示例</H1>
            <Section>
                <Description style={{ marginTop: '8px' }}>
                    缓动函数控制动画的速度变化，让动画更自然流畅
                </Description>
            </Section>

            {/* 示例1: Linear 线性 */}
            <H2 style={{ padding: '0 16px', marginTop: '20px' }}>1. Linear - 线性（匀速）</H2>
                
            <Section>
                {/* 动画时长滑动条 */}
                <ControlRow label={`时长: ${linearDuration.toFixed(1)}s`} labelWidth="80px">
                    <Slider
                        min={0.1}
                        max={10}
                        step={0.1}
                        value={linearDuration}
                        onChange={setLinearDuration}
                        style={{ flex: 1, minWidth: '120px' }}
                    />
                </ControlRow>
                
                {/* 左右往返动画 */}
                <div style={{ marginBottom: '5px' }}>
                    <PresetPreviewDisplayBlock viewBoxW={viewBoxW} viewBoxH={viewBoxH} maxWidth="100%" key={`linear-translate-${linearDuration}`}>
                    <image href={pic1} width={imgSize} height={imgSize}>
                        {genAnimateTranslate({
                            timeline: [
                                { timeSpanSec: linearDuration, toValue: { x: moveDistance }, keySplines: getLinearBezier() },
                                { timeSpanSec: linearDuration, toValue: { x: 0 }, keySplines: getLinearBezier() }
                            ],
                            loopCount: 0,
                            isRelativeMove: false
                        })}
                    </image>
                    </PresetPreviewDisplayBlock>
                </div>
                
                {/* Scale、Opacity 和 Rotate 动画展示 */}
                <div style={{ marginBottom: '5px' }}>
                    <PresetPreviewDisplayBlock viewBoxW={viewBoxW} viewBoxH={viewBoxH * 2 + 20} maxWidth="100%" key={`linear-scale-${linearDuration}`}>
                    {/* 第1个图片 - 缩放到0 */}
                    <image 
                        href={pic1} 
                        x={(viewBoxW - imgSize * 2 * 4 - 20 * 3) / 2} 
                        y={(viewBoxH * 2 + 20 - imgSize * 2) / 2}
                        width={imgSize * 2} 
                        height={imgSize * 2}
                        style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                    >
                        <animateTransform
                            attributeName="transform"
                            type="scale"
                            values={`1;0;1`}
                            keyTimes="0;0.5;1"
                            keySplines={`${getLinearBezier()};${getLinearBezier()}`}
                            dur={`${linearDuration * 2}s`}
                            repeatCount="indefinite"
                            calcMode="spline"
                        />
                    </image>

                    {/* 第2个图片 - 缩放到50% */}
                    <image 
                        href={pic1} 
                        x={(viewBoxW - imgSize * 2 * 4 - 20 * 3) / 2 + imgSize * 2 + 20} 
                        y={(viewBoxH * 2 + 20 - imgSize * 2) / 2}
                        width={imgSize * 2} 
                        height={imgSize * 2}
                        style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                    >
                        <animateTransform
                            attributeName="transform"
                            type="scale"
                            values={`1;0.5;1`}
                            keyTimes="0;0.5;1"
                            keySplines={`${getLinearBezier()};${getLinearBezier()}`}
                            dur={`${linearDuration * 2}s`}
                            repeatCount="indefinite"
                            calcMode="spline"
                        />
                    </image>

                    {/* 第3个图片 - 透明度 */}
                    <image 
                        href={pic1} 
                        x={(viewBoxW - imgSize * 2 * 4 - 20 * 3) / 2 + (imgSize * 2 + 20) * 2} 
                        y={(viewBoxH * 2 + 20 - imgSize * 2) / 2}
                        width={imgSize * 2} 
                        height={imgSize * 2}
                    >
                        <animate
                            attributeName="opacity"
                            values="1;0;1"
                            keyTimes="0;0.5;1"
                            keySplines={`${getLinearBezier()};${getLinearBezier()}`}
                            dur={`${linearDuration * 2}s`}
                            repeatCount="indefinite"
                            calcMode="spline"
                        />
                    </image>

                    {/* 第4个图片 - 旋转 */}
                    <image 
                        href={pic1} 
                        x={(viewBoxW - imgSize * 2 * 4 - 20 * 3 - 15) / 2 + (imgSize * 2 + 20) * 3 + 15} 
                        y={(viewBoxH * 2 + 20 - imgSize * 2) / 2 + 7.5}
                        width={45} 
                        height={45}
                        style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                    >
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            values={`0;360;0`}
                            keyTimes="0;0.5;1"
                            keySplines={`${getLinearBezier()};${getLinearBezier()}`}
                            dur={`${linearDuration * 2}s`}
                            repeatCount="indefinite"
                            calcMode="spline"
                        />
                    </image>
                    </PresetPreviewDisplayBlock>
                </div>
                
                <CodeBlock code={`getLinearBezier()`} />
            </Section>

            {/* 示例2: Ease - 基础缓动 */}
            <EasingDemo
                title="2. Ease - 基础缓动"
                description="最常用的缓动效果"
                pic={pic1}
                viewBoxW={viewBoxW}
                viewBoxH={viewBoxH}
                imgSize={imgSize}
                moveDistance={moveDistance}
                duration={duration}
                getKeySplines={(opts) => getEaseBezier(opts)}
                functionName="getEaseBezier"
            />

            {/* 示例3: Power - 强力缓动 */}
            <EasingDemo
                title="3. Power - 强力缓动"
                description="可调节 power 值"
                pic={pic1}
                viewBoxW={viewBoxW}
                viewBoxH={viewBoxH}
                imgSize={imgSize}
                moveDistance={moveDistance}
                duration={duration}
                getKeySplines={(opts) => getPowerBezier({ 
                    power: (opts.power as 1 | 2 | 3 | 4 | 5) || 3, 
                    isIn: opts.isIn, 
                    isOut: opts.isOut 
                })}
                functionName="getPowerBezier"
                extraParam={{
                    name: 'power',
                    label: 'Power',
                    options: [1, 2, 3, 4, 5],
                    defaultValue: 3
                }}
            />

            {/* 示例4: Circle - 圆形缓动 */}
            <EasingDemo
                title="4. Circle - 圆形缓动"
                description="圆形曲线，平滑自然"
                pic={pic1}
                viewBoxW={viewBoxW}
                viewBoxH={viewBoxH}
                imgSize={imgSize}
                moveDistance={moveDistance}
                duration={duration}
                getKeySplines={(opts) => getCircleBezier(opts)}
                functionName="getCircleBezier"
            />

            {/* 示例5: Expo - 指数缓动 */}
            <EasingDemo
                title="5. Expo - 指数缓动"
                description="极快的速度变化"
                pic={pic1}
                viewBoxW={viewBoxW}
                viewBoxH={viewBoxH}
                imgSize={imgSize}
                moveDistance={moveDistance}
                duration={duration}
                getKeySplines={(opts) => getExpoBezier(opts)}
                functionName="getExpoBezier"
            />

            {/* 示例6: Sine - 正弦缓动 */}
            <div style={{ marginBottom: '20px' }}>
                <EasingDemo
                    title="6. Sine - 正弦缓动"
                    description="最柔和的速度变化"
                    pic={pic1}
                    viewBoxW={viewBoxW}
                    viewBoxH={viewBoxH}
                    imgSize={imgSize}
                    moveDistance={moveDistance}
                    duration={duration}
                    getKeySplines={(opts) => getSineBezier(opts)}
                    functionName="getSineBezier"
                />
            </div>
        </SectionEx>
    );
};

const preset: DocumentExport = {
  title: "缓动KeySplines",
  jsx: <Article />
};

export default preset;

