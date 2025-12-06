import React, { useState } from "react";
import { DocumentExport } from "../data/svgDocumentLoader.tsx";
import SectionEx from "../../../dev/pubComponents/PureHTML/basicEx/SectionEx.tsx";
import { genAnimateTranslate } from "../../../dev/pubComponents/PubUtils/genSvgAnimateTransform/genAnimateTranslate";
import {
    getEaseBezier,
    getLinearBezier,
    getPowerBezier,
    getCircleBezier,
    getExpoBezier,
    getSineBezier
} from "../../../dev/pubComponents/PubUtils/getBezier";
import {
    CodeBlock,
    PresetPreviewDisplayBlock,
    ControlPanel,
    ControlRow,
    InfoBox,
    Section,
    H1,
    H2,
    P,
    Description
} from "../data/components";
import pic1 from "../data/assets/1.png";
import { Slider, Select, Switch, Radio } from "antd";

const Article = () => {
    const viewBoxW = 375;
    const viewBoxH = 50; // 平移动画画布高度（通用默认）
    const imgSize = 30; // 图片尺寸（通用默认）
    const imgY = (viewBoxH - imgSize) / 2; // 垂直居中（通用默认）
    const moveDistance = 345; // 移动距离（375 - 30）（通用默认）

    // 横向往返专用：画布与图片尺寸比例 4:1（画布宽:图片宽）
    const imgSizeX = Math.floor(viewBoxW / 4);
    const viewBoxHX = Math.max(50, imgSizeX + 20); // 留出上下 10px 余量
    const imgYX = (viewBoxHX - imgSizeX) / 2; // 根据横向画布高度重新居中
    const moveDistanceX = viewBoxW - imgSizeX; // 从头移动到尾

    // 垂直往返专用：放大图片并增加画布高度
    const imgSizeY = Math.floor(viewBoxW / 4);
    const amplitudeY = Math.max(40, Math.floor(imgSizeY * 0.5));
    const viewBoxHY2 = imgSizeY + amplitudeY + 20; // 上下各 10px 余量
    const imgYY = 10; // 顶部留白

    // 对角线专用：放大图片并计算对角位移
    const imgSizeD = Math.floor(viewBoxW / 4);
    const amplitudeDy = Math.max(50, Math.floor(imgSizeD * 0.6));
    const viewBoxHD = imgSizeD + amplitudeDy + 20; // 上下各 10px 余量
    const startXD = 10;
    const startYD = 10;
    const moveDistanceDX = viewBoxW - imgSizeD - startXD; // 贴右侧边缘

    // 方形路径专用：放大图片、设置路径边距与画布高度
    const paddingS = 20;
    const imgSizeS = Math.floor(viewBoxW / 4);
    const moveDistanceSX = viewBoxW - imgSizeS - paddingS * 2; // 左右各 padding
    const moveDistanceSY = Math.max(70, Math.floor(imgSizeS * 0.7));
    const viewBoxHS = imgSizeS + moveDistanceSY + paddingS * 2; // 上下各 padding
    const startXS = paddingS;
    const startYS = paddingS;

    // 交互式参数控制
    // 替换为横向往返距离，确保从画布左边到右边
    // 注：仅用于第一个“水平平移”示例
    const [translateDuration, setTranslateDuration] = useState(2);
    const [easingType, setEasingType] = useState<'linear' | 'ease' | 'power' | 'circle' | 'expo' | 'sine'>('ease');
    const [easeIn, setEaseIn] = useState(true);
    const [easeOut, setEaseOut] = useState(true);
    const [powerValue, setPowerValue] = useState<1 | 2 | 3 | 4 | 5>(3);

    // 示例2（垂直）独立控制
    const [translateDurationY, setTranslateDurationY] = useState(2);
    const [easingTypeY, setEasingTypeY] = useState<'linear' | 'ease' | 'power' | 'circle' | 'expo' | 'sine'>('ease');
    const [easeInY, setEaseInY] = useState(true);
    const [easeOutY, setEaseOutY] = useState(true);
    const [powerValueY, setPowerValueY] = useState<1 | 2 | 3 | 4 | 5>(3);

    // 示例3（对角线）独立控制
    const [translateDurationD, setTranslateDurationD] = useState(2);
    const [easingTypeD, setEasingTypeD] = useState<'linear' | 'ease' | 'power' | 'circle' | 'expo' | 'sine'>('ease');
    const [easeInD, setEaseInD] = useState(true);
    const [easeOutD, setEaseOutD] = useState(true);
    const [powerValueD, setPowerValueD] = useState<1 | 2 | 3 | 4 | 5>(3);

    // 示例4（方形路径）独立控制
    const [translateDurationS, setTranslateDurationS] = useState(2);
    const [easingTypeS, setEasingTypeS] = useState<'linear' | 'ease' | 'power' | 'circle' | 'expo' | 'sine'>('ease');
    const [easeInS, setEaseInS] = useState(true);
    const [easeOutS, setEaseOutS] = useState(true);
    const [powerValueS, setPowerValueS] = useState<1 | 2 | 3 | 4 | 5>(3);

    // 示例5（多段平移/弹跳）独立控制
    const [translateDurationB, setTranslateDurationB] = useState(1); // 基础段时长
    const [easingTypeB, setEasingTypeB] = useState<'linear' | 'ease' | 'power' | 'circle' | 'expo' | 'sine'>('power');
    const [easeInB, setEaseInB] = useState(true);
    const [easeOutB, setEaseOutB] = useState(false);
    const [powerValueB, setPowerValueB] = useState<1 | 2 | 3 | 4 | 5>(2);

    // 根据缓动类型获取 keySplines
    const getKeySplines = () => {
        switch (easingType) {
            case 'linear':
                return getLinearBezier();
            case 'ease':
                return getEaseBezier({ isIn: easeIn, isOut: easeOut });
            case 'power':
                return getPowerBezier({ power: powerValue, isIn: easeIn, isOut: easeOut });
            case 'circle':
                return getCircleBezier({ isIn: easeIn, isOut: easeOut });
            case 'expo':
                return getExpoBezier({ isIn: easeIn, isOut: easeOut });
            case 'sine':
                return getSineBezier({ isIn: easeIn, isOut: easeOut });
            default:
                return getLinearBezier();
        }
    };

    const getKeySplinesY = () => {
        switch (easingTypeY) {
            case 'linear':
                return getLinearBezier();
            case 'ease':
                return getEaseBezier({ isIn: easeInY, isOut: easeOutY });
            case 'power':
                return getPowerBezier({ power: powerValueY, isIn: easeInY, isOut: easeOutY });
            case 'circle':
                return getCircleBezier({ isIn: easeInY, isOut: easeOutY });
            case 'expo':
                return getExpoBezier({ isIn: easeInY, isOut: easeOutY });
            case 'sine':
                return getSineBezier({ isIn: easeInY, isOut: easeOutY });
            default:
                return getLinearBezier();
        }
    };

    const getKeySplinesD = () => {
        switch (easingTypeD) {
            case 'linear':
                return getLinearBezier();
            case 'ease':
                return getEaseBezier({ isIn: easeInD, isOut: easeOutD });
            case 'power':
                return getPowerBezier({ power: powerValueD, isIn: easeInD, isOut: easeOutD });
            case 'circle':
                return getCircleBezier({ isIn: easeInD, isOut: easeOutD });
            case 'expo':
                return getExpoBezier({ isIn: easeInD, isOut: easeOutD });
            case 'sine':
                return getSineBezier({ isIn: easeInD, isOut: easeOutD });
            default:
                return getLinearBezier();
        }
    };

    const getKeySplinesS = () => {
        switch (easingTypeS) {
            case 'linear':
                return getLinearBezier();
            case 'ease':
                return getEaseBezier({ isIn: easeInS, isOut: easeOutS });
            case 'power':
                return getPowerBezier({ power: powerValueS, isIn: easeInS, isOut: easeOutS });
            case 'circle':
                return getCircleBezier({ isIn: easeInS, isOut: easeOutS });
            case 'expo':
                return getExpoBezier({ isIn: easeInS, isOut: easeOutS });
            case 'sine':
                return getSineBezier({ isIn: easeInS, isOut: easeOutS });
            default:
                return getLinearBezier();
        }
    };

    const getKeySplinesB = () => {
        switch (easingTypeB) {
            case 'linear':
                return getLinearBezier();
            case 'ease':
                return getEaseBezier({ isIn: easeInB, isOut: easeOutB });
            case 'power':
                return getPowerBezier({ power: powerValueB, isIn: easeInB, isOut: easeOutB });
            case 'circle':
                return getCircleBezier({ isIn: easeInB, isOut: easeOutB });
            case 'expo':
                return getExpoBezier({ isIn: easeInB, isOut: easeOutB });
            case 'sine':
                return getSineBezier({ isIn: easeInB, isOut: easeOutB });
            default:
                return getLinearBezier();
        }
    };

    // 生成代码字符串
    const generateKeySplineCode = () => {
        switch (easingType) {
            case 'linear':
                return 'getLinearBezier()';
            case 'ease':
                return `getEaseBezier({ isIn: ${easeIn}, isOut: ${easeOut} })`;
            case 'power':
                return `getPowerBezier({ power: ${powerValue}, isIn: ${easeIn}, isOut: ${easeOut} })`;
            case 'circle':
                return `getCircleBezier({ isIn: ${easeIn}, isOut: ${easeOut} })`;
            case 'expo':
                return `getExpoBezier({ isIn: ${easeIn}, isOut: ${easeOut} })`;
            case 'sine':
                return `getSineBezier({ isIn: ${easeIn}, isOut: ${easeOut} })`;
            default:
                return 'getLinearBezier()';
        }
    };

    const generateKeySplineCodeY = () => {
        switch (easingTypeY) {
            case 'linear':
                return 'getLinearBezier()';
            case 'ease':
                return `getEaseBezier({ isIn: ${easeInY}, isOut: ${easeOutY} })`;
            case 'power':
                return `getPowerBezier({ power: ${powerValueY}, isIn: ${easeInY}, isOut: ${easeOutY} })`;
            case 'circle':
                return `getCircleBezier({ isIn: ${easeInY}, isOut: ${easeOutY} })`;
            case 'expo':
                return `getExpoBezier({ isIn: ${easeInY}, isOut: ${easeOutY} })`;
            case 'sine':
                return `getSineBezier({ isIn: ${easeInY}, isOut: ${easeOutY} })`;
            default:
                return 'getLinearBezier()';
        }
    };

    const generateKeySplineCodeD = () => {
        switch (easingTypeD) {
            case 'linear':
                return 'getLinearBezier()';
            case 'ease':
                return `getEaseBezier({ isIn: ${easeInD}, isOut: ${easeOutD} })`;
            case 'power':
                return `getPowerBezier({ power: ${powerValueD}, isIn: ${easeInD}, isOut: ${easeOutD} })`;
            case 'circle':
                return `getCircleBezier({ isIn: ${easeInD}, isOut: ${easeOutD} })`;
            case 'expo':
                return `getExpoBezier({ isIn: ${easeInD}, isOut: ${easeOutD} })`;
            case 'sine':
                return `getSineBezier({ isIn: ${easeInD}, isOut: ${easeOutD} })`;
            default:
                return 'getLinearBezier()';
        }
    };

    const generateKeySplineCodeS = () => {
        switch (easingTypeS) {
            case 'linear':
                return 'getLinearBezier()';
            case 'ease':
                return `getEaseBezier({ isIn: ${easeInS}, isOut: ${easeOutS} })`;
            case 'power':
                return `getPowerBezier({ power: ${powerValueS}, isIn: ${easeInS}, isOut: ${easeOutS} })`;
            case 'circle':
                return `getCircleBezier({ isIn: ${easeInS}, isOut: ${easeOutS} })`;
            case 'expo':
                return `getExpoBezier({ isIn: ${easeInS}, isOut: ${easeOutS} })`;
            case 'sine':
                return `getSineBezier({ isIn: ${easeInS}, isOut: ${easeOutS} })`;
            default:
                return 'getLinearBezier()';
        }
    };

    const generateKeySplineCodeB = () => {
        switch (easingTypeB) {
            case 'linear':
                return 'getLinearBezier()';
            case 'ease':
                return `getEaseBezier({ isIn: ${easeInB}, isOut: ${easeOutB} })`;
            case 'power':
                return `getPowerBezier({ power: ${powerValueB}, isIn: ${easeInB}, isOut: ${easeOutB} })`;
            case 'circle':
                return `getCircleBezier({ isIn: ${easeInB}, isOut: ${easeOutB} })`;
            case 'expo':
                return `getExpoBezier({ isIn: ${easeInB}, isOut: ${easeOutB} })`;
            case 'sine':
                return `getSineBezier({ isIn: ${easeInB}, isOut: ${easeOutB} })`;
            default:
                return 'getLinearBezier()';
        }
    };

    return (
        <SectionEx>
            <H1>平移动画 Translate</H1>
            <Section>
                <Description style={{ marginTop: '8px' }}>
                    通过改变元素的位置来实现移动效果，支持 X、Y 方向独立或组合平移
                </Description>
            </Section>

            {/* isRelativeMove 参数说明 */}
            <H2 style={{ marginTop: '20px' }}>参数说明：isRelativeMove（增量模式）</H2>
            
            <Section>
                <InfoBox type="info" style={{ marginTop: '12px' }}>
                    <strong>默认值：true（增量模式，推荐）</strong>
                    <p style={{ marginTop: '8px', marginBottom: 0 }}>
                        timeline 中的 <code>toValue</code> 表示相对于<strong>上一阶段</strong>的增量位移
                    </p>
                </InfoBox>

                <div style={{ marginTop: '16px' }}>
                    <CodeBlock language="typescript">{`// 增量模式（isRelativeMove: true，默认）
genAnimateTranslate({
    initValue: { x: 0, y: 0 },
    timeline: [
        { toValue: { x: 100, y: 0 }, timeSpanSec: 1 },  // 向右移动 100
        { toValue: { x: 0, y: 0 }, timeSpanSec: 1 },    // 保持不动（增量为0）
        { toValue: { x: 50, y: 0 }, timeSpanSec: 1 }    // 再向右移动 50（总共150）
    ],
    isRelativeMove: true  // 默认值，可省略
});

// 累积模式（isRelativeMove: false）
genAnimateTranslate({
    initValue: { x: 0, y: 0 },
    timeline: [
        { toValue: { x: 100, y: 0 }, timeSpanSec: 1 },  // 移动到绝对位置 x=100
        { toValue: { x: 100, y: 0 }, timeSpanSec: 1 },  // 保持在 x=100
        { toValue: { x: 150, y: 0 }, timeSpanSec: 1 }   // 移动到绝对位置 x=150
    ],
    isRelativeMove: false
});`}</CodeBlock>
                </div>

                <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#333', marginTop: '12px' }}>
                    <p><strong>两种模式对比：</strong></p>
                    <p>• <strong>增量模式（true）</strong>：每个阶段的 toValue 是相对位移，更直观易用</p>
                    <p>• <strong>累积模式（false）</strong>：每个阶段的 toValue 是绝对坐标，需要手动累加</p>
                    <p><strong>💡 推荐使用默认的增量模式</strong>，代码更清晰，维护更容易</p>
                </div>
            </Section>

            {/* 示例1: 水平平移 - 交互式 */}
            <H2 style={{ marginTop: '20px' }}>1. 水平平移（左 → 右 → 左，交互式）</H2>

            <Section style={{ marginTop: '16px' }}>
                <P style={{ marginBottom: '8px' }}>水平往返平移</P>

                {/* 参数控制器 */}
                <ControlPanel>
                    <ControlRow label={`时长: ${translateDuration.toFixed(1)}s`}>
                        <Slider
                            min={0.5}
                            max={5}
                            step={0.1}
                            value={translateDuration}
                            onChange={setTranslateDuration}
                            style={{ flex: 1, minWidth: '120px' }}
                        />
                    </ControlRow>
                    <ControlRow label="缓动函数:">
                        <Select
                            value={easingType}
                            onChange={setEasingType}
                            style={{ flex: 1 }}
                            options={[
                                { value: 'linear', label: 'Linear（线性）' },
                                { value: 'ease', label: 'Ease（基础缓动）' },
                                { value: 'power', label: 'Power（强力缓动）' },
                                { value: 'circle', label: 'Circle（圆形缓动）' },
                                { value: 'expo', label: 'Expo（指数缓动）' },
                                { value: 'sine', label: 'Sine（正弦缓动）' }
                            ]}
                        />
                    </ControlRow>
                    {easingType !== 'linear' && (
                        <ControlRow style={{ marginBottom: easingType === 'power' ? '8px' : '0' }}>
                            <div style={{ flex: 1, display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <span>Ease In</span>
                                <Switch size="small" checked={easeIn} onChange={setEaseIn} />
                                <span>Ease Out</span>
                                <Switch size="small" checked={easeOut} onChange={setEaseOut} />
                            </div>
                        </ControlRow>
                    )}
                    {easingType === 'power' && (
                        <ControlRow label="Power:">
                            <Radio.Group
                                size="small"
                                value={powerValue}
                                onChange={(e) => setPowerValue(e.target.value)}
                                optionType="button"
                                buttonStyle="solid"
                            >
                                <Radio.Button value={1}>1</Radio.Button>
                                <Radio.Button value={2}>2</Radio.Button>
                                <Radio.Button value={3}>3</Radio.Button>
                                <Radio.Button value={4}>4</Radio.Button>
                                <Radio.Button value={5}>5</Radio.Button>
                            </Radio.Group>
                        </ControlRow>
                    )}
                </ControlPanel>

                <PresetPreviewDisplayBlock
                    viewBoxW={viewBoxW}
                    viewBoxH={viewBoxHX}
                    maxWidth={"100%"}
                    width={"100%"}
                    key={`translate-x-${translateDuration}-${easingType}-${easeIn}-${easeOut}-${powerValue}`}
                >
                    <image
                        href={pic1}
                        x={0}
                        y={imgYX}
                        width={imgSizeX}
                        height={imgSizeX}
                    >
                        {genAnimateTranslate({
                            timeline: [
                                {
                                    timeSpanSec: translateDuration,
                                    toValue: { x: moveDistanceX },
                                    keySplines: getKeySplines()
                                },
                                {
                                    timeSpanSec: translateDuration,
                                    toValue: { x: 0 },
                                    keySplines: getKeySplines()
                                }
                            ],
                            loopCount: 0,
                            isRelativeMove: false  // 累积模式：toValue 是绝对坐标
                        })}
                    </image>
                </PresetPreviewDisplayBlock>
                <CodeBlock code={`genAnimateTranslate({
    timeline: [
        { 
            timeSpanSec: ${translateDuration.toFixed(1)}, 
            toValue: { x: ${moveDistanceX} }, 
            keySplines: ${generateKeySplineCode()} 
        },
        { 
            timeSpanSec: ${translateDuration.toFixed(1)}, 
            toValue: { x: 0 }, 
            keySplines: ${generateKeySplineCode()} 
        }
    ],
    loopCount: 0,
    isRelativeMove: false  // 为false时，toValue 是绝对坐标
})`} />
            </Section>

            {/* 示例2: 垂直平移 */}
            <H2 style={{ marginTop: '24px' }}>2. 垂直平移（上下浮动）</H2>

            <Section style={{ marginTop: '16px' }}>
                <P style={{ marginBottom: '8px' }}>垂直往返平移</P>
                <ControlPanel>
                    <ControlRow label={`时长: ${translateDurationY.toFixed(1)}s`}>
                        <Slider min={0.5} max={5} step={0.1} value={translateDurationY} onChange={setTranslateDurationY} style={{ flex: 1, minWidth: '120px' }} />
                    </ControlRow>
                    <ControlRow label="缓动函数:">
                        <Select value={easingTypeY} onChange={setEasingTypeY} style={{ flex: 1 }}
                            options={[
                                { value: 'linear', label: 'Linear（线性）' },
                                { value: 'ease', label: 'Ease（基础缓动）' },
                                { value: 'power', label: 'Power（强力缓动）' },
                                { value: 'circle', label: 'Circle（圆形缓动）' },
                                { value: 'expo', label: 'Expo（指数缓动）' },
                                { value: 'sine', label: 'Sine（正弦缓动）' }
                            ]}
                        />
                    </ControlRow>
                    {easingTypeY !== 'linear' && (
                        <ControlRow>
                            <div style={{ flex: 1, display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <span>Ease In</span>
                                <Switch size="small" checked={easeInY} onChange={setEaseInY} />
                                <span>Ease Out</span>
                                <Switch size="small" checked={easeOutY} onChange={setEaseOutY} />
                            </div>
                        </ControlRow>
                    )}
                    {easingTypeY === 'power' && (
                        <ControlRow label="Power:">
                            <Radio.Group size="small" value={powerValueY} onChange={(e) => setPowerValueY(e.target.value)} optionType="button" buttonStyle="solid">
                                <Radio.Button value={1}>1</Radio.Button>
                                <Radio.Button value={2}>2</Radio.Button>
                                <Radio.Button value={3}>3</Radio.Button>
                                <Radio.Button value={4}>4</Radio.Button>
                                <Radio.Button value={5}>5</Radio.Button>
                            </Radio.Group>
                        </ControlRow>
                    )}
                </ControlPanel>
                <PresetPreviewDisplayBlock
                        maxWidth={"100%"}
                        width={"100%"}
                    viewBoxW={viewBoxW}
                    viewBoxH={viewBoxHY2}
                    key={`translate-y-${translateDuration}-${easingType}-${easeIn}-${easeOut}-${powerValue}`}
                >
                    <image
                        href={pic1}
                        x={(viewBoxW - imgSizeY) / 2}
                        y={imgYY}
                        width={imgSizeY}
                        height={imgSizeY}
                    >
                        {genAnimateTranslate({
                            timeline: [
                                {
                                    timeSpanSec: translateDurationY,
                                    toValue: { y: amplitudeY },
                                    keySplines: getKeySplinesY()
                                },
                                {
                                    timeSpanSec: translateDurationY,
                                    toValue: { y: 0 },
                                    keySplines: getKeySplinesY()
                                }
                            ],
                            loopCount: 0,
                            isRelativeMove: false  // 累积模式
                        })}
                    </image>
                </PresetPreviewDisplayBlock>
                <CodeBlock code={`genAnimateTranslate({
    timeline: [
        { 
            timeSpanSec: ${translateDurationY.toFixed(1)}, 
            toValue: { y: ${amplitudeY} }, 
            keySplines: ${generateKeySplineCodeY()} 
        },
        { 
            timeSpanSec: ${translateDurationY.toFixed(1)}, 
            toValue: { y: 0 }, 
            keySplines: ${generateKeySplineCodeY()} 
        }
    ],
    loopCount: 0,
    isRelativeMove: false  // 累积模式
})`} />
            </Section>

            {/* 示例3: 对角线平移 */}
            <H2 style={{ marginTop: '24px' }}>3. 对角线平移（X + Y 组合）</H2>

            <Section style={{ marginTop: '16px' }}>
                <P style={{ marginBottom: '8px' }}>同时沿 X、Y 方向移动</P>
                <ControlPanel>
                    <ControlRow label={`时长: ${translateDurationD.toFixed(1)}s`}>
                        <Slider min={0.5} max={5} step={0.1} value={translateDurationD} onChange={setTranslateDurationD} style={{ flex: 1, minWidth: '120px' }} />
                    </ControlRow>
                    <ControlRow label="缓动函数:">
                        <Select value={easingTypeD} onChange={setEasingTypeD} style={{ flex: 1 }}
                            options={[
                                { value: 'linear', label: 'Linear（线性）' },
                                { value: 'ease', label: 'Ease（基础缓动）' },
                                { value: 'power', label: 'Power（强力缓动）' },
                                { value: 'circle', label: 'Circle（圆形缓动）' },
                                { value: 'expo', label: 'Expo（指数缓动）' },
                                { value: 'sine', label: 'Sine（正弦缓动）' }
                            ]}
                        />
                    </ControlRow>
                    {easingTypeD !== 'linear' && (
                        <ControlRow>
                            <div style={{ flex: 1, display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <span>Ease In</span>
                                <Switch size="small" checked={easeInD} onChange={setEaseInD} />
                                <span>Ease Out</span>
                                <Switch size="small" checked={easeOutD} onChange={setEaseOutD} />
                            </div>
                        </ControlRow>
                    )}
                    {easingTypeD === 'power' && (
                        <ControlRow label="Power:">
                            <Radio.Group size="small" value={powerValueD} onChange={(e) => setPowerValueD(e.target.value)} optionType="button" buttonStyle="solid">
                                <Radio.Button value={1}>1</Radio.Button>
                                <Radio.Button value={2}>2</Radio.Button>
                                <Radio.Button value={3}>3</Radio.Button>
                                <Radio.Button value={4}>4</Radio.Button>
                                <Radio.Button value={5}>5</Radio.Button>
                            </Radio.Group>
                        </ControlRow>
                    )}
                </ControlPanel>
                <PresetPreviewDisplayBlock
                    viewBoxW={viewBoxW}
                    viewBoxH={viewBoxHD}
                    maxWidth={"100%"}
                    width={"100%"}
                    key={`translate-xy-${translateDuration}-${easingType}-${easeIn}-${easeOut}-${powerValue}`}
                >
                    <image
                        href={pic1}
                        x={startXD}
                        y={startYD}
                        width={imgSizeD}
                        height={imgSizeD}
                    >
                        {genAnimateTranslate({
                            timeline: [
                                {
                                    timeSpanSec: translateDurationD,
                                    toValue: { x: moveDistanceDX, y: amplitudeDy },
                                    keySplines: getKeySplinesD()
                                },
                                {
                                    timeSpanSec: translateDurationD,
                                    toValue: { x: 0, y: 0 },
                                    keySplines: getKeySplinesD()
                                }
                            ],
                            loopCount: 0,
                            isRelativeMove: false  // 累积模式
                        })}
                    </image>
                </PresetPreviewDisplayBlock>
                <CodeBlock code={`genAnimateTranslate({
    timeline: [
        { 
            timeSpanSec: ${translateDurationD.toFixed(1)}, 
            toValue: { x: ${moveDistanceDX}, y: ${amplitudeDy} }, 
            keySplines: ${generateKeySplineCodeD()} 
        },
        { 
            timeSpanSec: ${translateDurationD.toFixed(1)}, 
            toValue: { x: 0, y: 0 }, 
            keySplines: ${generateKeySplineCodeD()} 
        }
    ],
    loopCount: 0,
    isRelativeMove: false  // 累积模式
})`} />
            </Section>

            {/* 示例4: 方形路径 */}
            <H2 style={{ marginTop: '24px' }}>4. 方形路径（四个方向）</H2>

            <Section style={{ marginTop: '16px' }}>
                <P style={{ marginBottom: '8px' }}>顺时针沿方形路径移动</P>
                <ControlPanel>
                    <ControlRow label={`时长: ${translateDurationS.toFixed(1)}s`}>
                        <Slider min={0.5} max={5} step={0.1} value={translateDurationS} onChange={setTranslateDurationS} style={{ flex: 1, minWidth: '120px' }} />
                    </ControlRow>
                    <ControlRow label="缓动函数:">
                        <Select value={easingTypeS} onChange={setEasingTypeS} style={{ flex: 1 }}
                            options={[
                                { value: 'linear', label: 'Linear（线性）' },
                                { value: 'ease', label: 'Ease（基础缓动）' },
                                { value: 'power', label: 'Power（强力缓动）' },
                                { value: 'circle', label: 'Circle（圆形缓动）' },
                                { value: 'expo', label: 'Expo（指数缓动）' },
                                { value: 'sine', label: 'Sine（正弦缓动）' }
                            ]}
                        />
                    </ControlRow>
                    {easingTypeS !== 'linear' && (
                        <ControlRow>
                            <div style={{ flex: 1, display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <span>Ease In</span>
                                <Switch size="small" checked={easeInS} onChange={setEaseInS} />
                                <span>Ease Out</span>
                                <Switch size="small" checked={easeOutS} onChange={setEaseOutS} />
                            </div>
                        </ControlRow>
                    )}
                    {easingTypeS === 'power' && (
                        <ControlRow label="Power:">
                            <Radio.Group size="small" value={powerValueS} onChange={(e) => setPowerValueS(e.target.value)} optionType="button" buttonStyle="solid">
                                <Radio.Button value={1}>1</Radio.Button>
                                <Radio.Button value={2}>2</Radio.Button>
                                <Radio.Button value={3}>3</Radio.Button>
                                <Radio.Button value={4}>4</Radio.Button>
                                <Radio.Button value={5}>5</Radio.Button>
                            </Radio.Group>
                        </ControlRow>
                    )}
                </ControlPanel>
                <PresetPreviewDisplayBlock
                    viewBoxW={viewBoxW}
                    viewBoxH={viewBoxHS}
                    maxWidth={"100%"}
                    width={"100%"}
                    key={`translate-square-${translateDuration}-${easingType}-${easeIn}-${easeOut}-${powerValue}`}
                >
                    <image
                        href={pic1}
                        x={startXS}
                        y={startYS}
                        width={imgSizeS}
                        height={imgSizeS}
                    >
                        {genAnimateTranslate({
                            timeline: [
                                {
                                    timeSpanSec: translateDurationS * 0.5,
                                    toValue: { x: moveDistanceSX, y: 0 },
                                    keySplines: getKeySplinesS()
                                },
                                {
                                    timeSpanSec: translateDurationS * 0.5,
                                    toValue: { x: moveDistanceSX, y: moveDistanceSY },
                                    keySplines: getKeySplinesS()
                                },
                                {
                                    timeSpanSec: translateDurationS * 0.5,
                                    toValue: { x: 0, y: moveDistanceSY },
                                    keySplines: getKeySplinesS()
                                },
                                {
                                    timeSpanSec: translateDurationS * 0.5,
                                    toValue: { x: 0, y: 0 },
                                    keySplines: getKeySplinesS()
                                }
                            ],
                            loopCount: 0,
                            isRelativeMove: false  // 累积模式
                        })}
                    </image>
                </PresetPreviewDisplayBlock>
                <CodeBlock code={`genAnimateTranslate({
    timeline: [
        { timeSpanSec: ${(translateDurationS * 0.5).toFixed(1)}, toValue: { x: ${moveDistanceSX}, y: 0 }, keySplines: ${generateKeySplineCodeS()} },
        { timeSpanSec: ${(translateDurationS * 0.5).toFixed(1)}, toValue: { x: ${moveDistanceSX}, y: ${moveDistanceSY} }, keySplines: ${generateKeySplineCodeS()} },
        { timeSpanSec: ${(translateDurationS * 0.5).toFixed(1)}, toValue: { x: 0, y: ${moveDistanceSY} }, keySplines: ${generateKeySplineCodeS()} },
        { timeSpanSec: ${(translateDurationS * 0.5).toFixed(1)}, toValue: { x: 0, y: 0 }, keySplines: ${generateKeySplineCodeS()} }
    ],
    loopCount: 0,
    isRelativeMove: false  // 累积模式
})`} />
            </Section>

            {/* 示例5: 弹跳效果 */}
            <H2 style={{ marginTop: '24px' }}>5. 多段平移（模拟弹跳）</H2>

            <Section style={{ marginTop: '16px', marginBottom: '20px' }}>
                <P style={{ marginBottom: '8px' }}>多个连续的平移动作</P>
                <ControlPanel>
                    <ControlRow label={`基础段时长: ${translateDurationB.toFixed(1)}s`}>
                        <Slider min={0.2} max={2} step={0.1} value={translateDurationB} onChange={setTranslateDurationB} style={{ flex: 1, minWidth: '120px' }} />
                    </ControlRow>
                    <ControlRow label="缓动函数:">
                        <Select value={easingTypeB} onChange={setEasingTypeB} style={{ flex: 1 }}
                            options={[
                                { value: 'linear', label: 'Linear（线性）' },
                                { value: 'ease', label: 'Ease（基础缓动）' },
                                { value: 'power', label: 'Power（强力缓动）' },
                                { value: 'circle', label: 'Circle（圆形缓动）' },
                                { value: 'expo', label: 'Expo（指数缓动）' },
                                { value: 'sine', label: 'Sine（正弦缓动）' }
                            ]}
                        />
                    </ControlRow>
                    {easingTypeB !== 'linear' && (
                        <ControlRow>
                            <div style={{ flex: 1, display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <span>Ease In</span>
                                <Switch size="small" checked={easeInB} onChange={setEaseInB} />
                                <span>Ease Out</span>
                                <Switch size="small" checked={easeOutB} onChange={setEaseOutB} />
                            </div>
                        </ControlRow>
                    )}
                    {easingTypeB === 'power' && (
                        <ControlRow label="Power:">
                            <Radio.Group size="small" value={powerValueB} onChange={(e) => setPowerValueB(e.target.value)} optionType="button" buttonStyle="solid">
                                <Radio.Button value={1}>1</Radio.Button>
                                <Radio.Button value={2}>2</Radio.Button>
                                <Radio.Button value={3}>3</Radio.Button>
                                <Radio.Button value={4}>4</Radio.Button>
                                <Radio.Button value={5}>5</Radio.Button>
                            </Radio.Group>
                        </ControlRow>
                    )}
                </ControlPanel>
                <PresetPreviewDisplayBlock
                    viewBoxW={viewBoxW}
                    viewBoxH={viewBoxHX}
                    maxWidth={"100%"}
                    width={"100%"}
                >
                    <image
                        href={pic1}
                        x={0}
                        y={imgYX}
                        width={imgSizeX}
                        height={imgSizeX}
                    >
                        {genAnimateTranslate({
                            timeline: [
                                { timeSpanSec: translateDurationB * 0.5, toValue: { x: Math.floor(moveDistanceX * 0.28) }, keySplines: getKeySplinesB() },
                                { timeSpanSec: translateDurationB * 0.3, toValue: { x: Math.floor(moveDistanceX * 0.22) }, keySplines: getLinearBezier() },
                                { timeSpanSec: translateDurationB * 0.5, toValue: { x: Math.floor(moveDistanceX * 0.6) }, keySplines: getKeySplinesB() },
                                { timeSpanSec: translateDurationB * 0.3, toValue: { x: Math.floor(moveDistanceX * 0.52) }, keySplines: getLinearBezier() },
                                { timeSpanSec: translateDurationB * 0.5, toValue: { x: Math.floor(moveDistanceX * 0.88) }, keySplines: getKeySplinesB() },
                                { timeSpanSec: translateDurationB * 0.3, toValue: { x: Math.floor(moveDistanceX * 0.8) }, keySplines: getLinearBezier() }
                            ],
                            loopCount: 0,
                            isRelativeMove: false  // 累积模式
                        })}
                    </image>
                </PresetPreviewDisplayBlock>
                <CodeBlock code={`genAnimateTranslate({
    timeline: [
        { timeSpanSec: ${(translateDurationB * 0.5).toFixed(1)}, toValue: { x: ${Math.floor(moveDistanceX * 0.28)} }, keySplines: ${generateKeySplineCodeB()} },
        { timeSpanSec: ${(translateDurationB * 0.3).toFixed(1)}, toValue: { x: ${Math.floor(moveDistanceX * 0.22)} }, keySplines: getLinearBezier() },
        { timeSpanSec: ${(translateDurationB * 0.5).toFixed(1)}, toValue: { x: ${Math.floor(moveDistanceX * 0.6)} }, keySplines: ${generateKeySplineCodeB()} },
        { timeSpanSec: ${(translateDurationB * 0.3).toFixed(1)}, toValue: { x: ${Math.floor(moveDistanceX * 0.52)} }, keySplines: getLinearBezier() },
        { timeSpanSec: ${(translateDurationB * 0.5).toFixed(1)}, toValue: { x: ${Math.floor(moveDistanceX * 0.88)} }, keySplines: ${generateKeySplineCodeB()} },
        { timeSpanSec: ${(translateDurationB * 0.3).toFixed(1)}, toValue: { x: ${Math.floor(moveDistanceX * 0.8)} }, keySplines: getLinearBezier() }
    ],
    loopCount: 0,
    isRelativeMove: false  // 累积模式
})`} />
            </Section>
        </SectionEx>
    );
};

const preset: DocumentExport = {
  title: "平移动画 Translate",
  jsx: <Article />
};

export default preset;
