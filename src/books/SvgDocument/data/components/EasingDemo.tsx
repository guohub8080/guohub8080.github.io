import React, { useState } from 'react';
import { Switch, Radio, Slider } from 'antd';
import PresetPreviewDisplayBlock from "./PresetPreviewDisplayBlock.tsx";
import CodeBlock from "./CodeBlock.tsx";
import { H2 } from "./Headings.tsx";
import { genAnimateTranslate } from "../../../../dev/pubComponents/PubUtils/genSvgAnimateTransform/genAnimateTranslate";

interface ExtraParam {
    name: string;
    label: string;
    options: number[];
    defaultValue: number;
}

interface EasingDemoProps {
    title: string;
    description?: string;
    pic: string;
    viewBoxW: number;
    viewBoxH: number;
    imgSize: number;
    moveDistance: number;
    duration: number;
    getKeySplines: (options: { isIn?: boolean; isOut?: boolean; [key: string]: any }) => string;
    functionName: string;
    extraParam?: ExtraParam;
}

/**
 * 缓动效果演示组件
 * 支持动态切换 isIn 和 isOut 参数
 */
const EasingDemo: React.FC<EasingDemoProps> = ({
    title,
    description,
    pic,
    viewBoxW,
    viewBoxH,
    imgSize,
    moveDistance,
    duration,
    getKeySplines,
    functionName,
    extraParam
}) => {
    const [isIn, setIsIn] = useState(false);
    const [isOut, setIsOut] = useState(true);
    const [paramValue, setParamValue] = useState(extraParam?.defaultValue || 0);
    const [animDuration, setAnimDuration] = useState(duration);

    // 生成代码字符串
    const generateCode = () => {
        const options: any = {};
        
        if (isIn || isOut) {
            if (isIn) options.isIn = true;
            if (isOut) options.isOut = true;
        } else {
            options.isIn = false;
            options.isOut = false;
        }
        
        if (extraParam) {
            options[extraParam.name] = paramValue;
        }
        
        const optionsStr = Object.entries(options)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
            
        return `${functionName}({ ${optionsStr} })`;
    };

    return (
        <>
            <H2 style={{ padding: '0 16px', marginTop: '20px', marginBottom: '8px' }}>
                {title}
                {description && <span style={{ color: '#666', fontWeight: 'normal' }}>（{description}）</span>}
            </H2>
            
            <div style={{ padding: '0 16px' }}>
                {/* 控制开关 */}
                <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '8px', 
                marginBottom: '8px',
                fontSize: '14px'
            }}>
                <div style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px'
                    }}>
                        <Switch 
                            size="small"
                            checked={isIn}
                            onChange={setIsIn}
                        />
                        <span>Ease In</span>
                    </div>
                    
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px'
                    }}>
                        <Switch 
                            size="small"
                            checked={isOut}
                            onChange={setIsOut}
                        />
                        <span>Ease Out</span>
                    </div>
                </div>
                
                {/* 额外参数 Radio */}
                {extraParam && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <span style={{ minWidth: '80px' }}>{extraParam.label}:</span>
                        <Radio.Group
                            size="small"
                            value={paramValue}
                            onChange={(e) => setParamValue(e.target.value)}
                            optionType="button"
                            buttonStyle="solid"
                        >
                            {extraParam.options.map(option => (
                                <Radio.Button key={option} value={option}>
                                    {option}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </div>
                )}
                
                {/* 动画时长滑动条 */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <span style={{ minWidth: '80px' }}>时长: {animDuration.toFixed(1)}s</span>
                    <Slider
                        min={0.1}
                        max={10}
                        step={0.1}
                        value={animDuration}
                        onChange={setAnimDuration}
                        style={{ flex: 1, minWidth: '120px' }}
                    />
                </div>
            </div>
            </div>

            {/* 左右往返动画 - 使用 key 强制重新渲染动画 */}
            <div style={{ padding: '0 16px', marginBottom: '5px' }}>
                <PresetPreviewDisplayBlock 
                    viewBoxW={viewBoxW} 
                    viewBoxH={viewBoxH} 
                    maxWidth="100%"
                    key={`translate-${isIn}-${isOut}-${paramValue}-${animDuration}`}
                >
                <image href={pic} width={imgSize} height={imgSize}>
                    {genAnimateTranslate({
                        timeline: [
                            { 
                                timeSpanSec: animDuration, 
                                toValue: { x: moveDistance }, 
                                keySplines: getKeySplines({ 
                                    isIn, 
                                    isOut, 
                                    ...(extraParam ? { [extraParam.name]: paramValue } : {})
                                })
                            },
                            { 
                                timeSpanSec: animDuration, 
                                toValue: { x: 0 }, 
                                keySplines: getKeySplines({ 
                                    isIn, 
                                    isOut,
                                    ...(extraParam ? { [extraParam.name]: paramValue } : {})
                                })
                            }
                        ],
                        loopCount: 0,
                        isRelativeMove: false
                    })}
                </image>
                </PresetPreviewDisplayBlock>
            </div>

            {/* Scale、Opacity 和 Rotate 动画展示 */}
            <div style={{ padding: '0 16px', marginBottom: '5px' }}>
                <PresetPreviewDisplayBlock 
                viewBoxW={viewBoxW} 
                viewBoxH={viewBoxH * 2 + 20} 
                maxWidth="100%"
                key={`scale-opacity-${isIn}-${isOut}-${paramValue}-${animDuration}`}
            >
                {/* 第1个图片 - 缩放到0 */}
                <image 
                    href={pic} 
                    x={(viewBoxW - imgSize * 2 * 4 - 20 * 3 - 15) / 2} 
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
                        keySplines={`${getKeySplines({ isIn, isOut, ...(extraParam ? { [extraParam.name]: paramValue } : {}) })};${getKeySplines({ isIn, isOut, ...(extraParam ? { [extraParam.name]: paramValue } : {}) })}`}
                        dur={`${animDuration * 2}s`}
                        repeatCount="indefinite"
                        calcMode="spline"
                    />
                </image>

                {/* 第2个图片 - 缩放到50% */}
                <image 
                    href={pic} 
                    x={(viewBoxW - imgSize * 2 * 4 - 20 * 3 - 15) / 2 + imgSize * 2 + 20} 
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
                        keySplines={`${getKeySplines({ isIn, isOut, ...(extraParam ? { [extraParam.name]: paramValue } : {}) })};${getKeySplines({ isIn, isOut, ...(extraParam ? { [extraParam.name]: paramValue } : {}) })}`}
                        dur={`${animDuration * 2}s`}
                        repeatCount="indefinite"
                        calcMode="spline"
                    />
                </image>

                {/* 第3个图片 - 透明度 */}
                <image 
                    href={pic} 
                    x={(viewBoxW - imgSize * 2 * 4 - 20 * 3 - 15) / 2 + (imgSize * 2 + 20) * 2} 
                    y={(viewBoxH * 2 + 20 - imgSize * 2) / 2}
                    width={imgSize * 2} 
                    height={imgSize * 2}
                >
                    <animate
                        attributeName="opacity"
                        values="1;0;1"
                        keyTimes="0;0.5;1"
                        keySplines={`${getKeySplines({ isIn, isOut, ...(extraParam ? { [extraParam.name]: paramValue } : {}) })};${getKeySplines({ isIn, isOut, ...(extraParam ? { [extraParam.name]: paramValue } : {}) })}`}
                        dur={`${animDuration * 2}s`}
                        repeatCount="indefinite"
                        calcMode="spline"
                    />
                </image>

                {/* 第4个图片 - 旋转 */}
                <image 
                    href={pic} 
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
                        keySplines={`${getKeySplines({ isIn, isOut, ...(extraParam ? { [extraParam.name]: paramValue } : {}) })};${getKeySplines({ isIn, isOut, ...(extraParam ? { [extraParam.name]: paramValue } : {}) })}`}
                        dur={`${animDuration * 2}s`}
                        repeatCount="indefinite"
                        calcMode="spline"
                    />
                </image>
                </PresetPreviewDisplayBlock>
            </div>

            <div style={{ padding: '0 16px' }}>
                {/* 代码展示 */}
                <CodeBlock code={generateCode()} />
            </div>
        </>
    );
};

export default EasingDemo;


