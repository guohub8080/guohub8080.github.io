import React from "react";
import { DocumentExport } from "../data/svgDocumentLoader.tsx";
import SectionEx from "../../../dev/pubComponents/PureHTML/basicEx/SectionEx.tsx";
import SvgEx from "../../../dev/pubComponents/PureHTML/basicEx/SvgEx.tsx";
import getImgSizeByDefault from "../../../dev/pubComponents/PubUtils/common/getImgSizeByDefault.tsx";
import {
    CodeBlock,
    PresetPreviewDisplayBlock,
    InfoBox,
    Section,
    H1,
    H2,
    Description
} from "../data/components";
import pic1 from "../data/assets/1.png";

const Article = () => {
    // 示例1: 手动指定宽高
    const manualSize = getImgSizeByDefault(pic1, 300, 200);

    // 示例2: 只指定宽度
    const widthOnlySize = getImgSizeByDefault(pic1, 375);

    // 示例3: 自动获取（不指定宽高）
    const autoSize = getImgSizeByDefault(pic1);

    return (
        <SectionEx>
            <H1>getImgSizeByDefault - 图片尺寸获取</H1>
            <Description style={{ padding: '0 16px', marginTop: '8px' }}>
                SVG 动画组件通常需要统一尺寸的图片。手动测量每张图片并填入宽高既低效又容易出错，
                此工具可自动获取图片尺寸，或使用手动指定的值覆盖。
            </Description>
            
            <div style={{ padding: '0 16px', marginTop: '12px', fontSize: '14px', lineHeight: '1.8', color: '#666' }}>
                <p>💡 <strong>设计理念</strong></p>
                <p>• 多数组件默认以<strong>第一张图</strong>为基准获取尺寸</p>
                <p>• 优先使用手动指定的 <code>viewBoxW</code> 或 <code>viewBoxH</code>（覆盖自动获取）</p>
                <p>• 避免重复的手动测量工作，提高开发效率</p>
            </div>

            {/* 函数签名 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>函数签名</H2>
            <Section>
                <CodeBlock language="typescript">{`getImgSizeByDefault(url: string, w?: number, h?: number): { w: number, h: number }`}</CodeBlock>
                
                <InfoBox type="warning">
                    <strong>⚠️ 重要：这是一个响应式 Hook 函数</strong>
                    <p style={{ marginTop: '8px', marginBottom: 0 }}>
                        内部使用了 <code>useMemo</code> 和异步图片加载。当图片加载完成时，
                        返回的 <code>{`{ w, h }`}</code> 会自动更新，触发组件重新渲染。
                    </p>
                </InfoBox>
            </Section>

            {/* 参数说明 */}
            <H2 style={{ padding: '0 16px', marginTop: '20px' }}>参数说明</H2>
            <Section>
                <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#333' }}>
                    <p><code>url</code>: 图片 URL 地址</p>
                    <p><code>w</code>: 可选，指定宽度（优先级高于自动获取）</p>
                    <p><code>h</code>: 可选，指定高度（优先级高于自动获取）</p>
                </div>
            </Section>

            {/* 工作原理 */}
            <H2 style={{ padding: '0 16px', marginTop: '20px' }}>工作原理（响应式更新）</H2>
            <Section>
                <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#333' }}>
                    <p>1. <strong>优先使用指定值</strong>：如果提供了 w 或 h，直接返回指定的值</p>
                    <p>2. <strong>异步加载图片</strong>：如果没有提供，会在后台异步加载图片</p>
                    <p>3. <strong>响应式更新</strong>：图片加载完成后，返回值会自动更新为实际尺寸</p>
                    <p>4. <strong>触发重渲染</strong>：由于使用了 <code>useMemo</code>，值更新会触发组件重新渲染</p>
                </div>

                <CodeBlock language="typescript">{`// 内部实现简化版
const getImgSizeByDefault = (url, w?, h?) => {
    const imgSizeAutoGet = getImgSizeAsync(url); // 异步获取
    
    const imgSize = useMemo(() => {
        if (w || h) return { w, h };  // 优先返回指定值
        
        // 当 imgSizeAutoGet 更新时，useMemo 会重新计算
        if (imgSizeAutoGet.isSuccess) {
            return { w: imgSizeAutoGet.w, h: imgSizeAutoGet.h };
        }
        
        return { w: 0, h: 0 };  // 初始值
    }, [imgSizeAutoGet, w, h]);
    
    return imgSize;  // 响应式返回值
}`}</CodeBlock>
            </Section>

            {/* 示例1: 手动指定宽高 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>示例1：手动指定宽高</H2>
            <Section>
                <Description>
                    明确知道需要的尺寸时，直接指定宽高（最常用）
                </Description>

                <CodeBlock language="typescript">{`const canvasSize = getImgSizeByDefault(pic1, 300, 200);
// 返回: { w: 300, h: 200 }`}</CodeBlock>

                <PresetPreviewDisplayBlock>
                    <SvgEx viewBox={`0 0 ${manualSize.w} ${manualSize.h}`} width="100%">
                        <image href={pic1} width={manualSize.w} height={manualSize.h} />
                        <text x={manualSize.w / 2} y={manualSize.h / 2} textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
                            {manualSize.w} × {manualSize.h}
                        </text>
                    </SvgEx>
                </PresetPreviewDisplayBlock>
            </Section>

            {/* 示例2: 只指定宽度 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>示例2：只指定宽度</H2>
            <Section>
                <Description>
                    只提供宽度时，高度会被设为 0（需要配合其他逻辑处理）
                </Description>

                <CodeBlock language="typescript">{`const canvasSize = getImgSizeByDefault(pic1, 375);
// 返回: { w: 375, h: 0 }`}</CodeBlock>

                <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                    结果：w = {widthOnlySize.w}, h = {widthOnlySize.h}
                </div>
            </Section>

            {/* 示例3: 自动获取 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>示例3：自动获取图片尺寸（响应式更新）</H2>
            <Section>
                <Description>
                    不提供宽高时，会异步加载图片。加载完成后自动更新返回值
                </Description>

                <CodeBlock language="typescript">{`const canvasSize = getImgSizeByDefault(pic1);
// 初始值: { w: 0, h: 0 }
// 图片加载后自动更新为: { w: 实际宽度, h: 实际高度 }
// 更新时会触发组件重新渲染`}</CodeBlock>

                <div style={{ fontSize: '14px', color: '#666', marginTop: '12px', lineHeight: '1.8' }}>
                    <p><strong>渲染流程：</strong></p>
                    <p>1. 初次渲染：<code>canvasSize = {`{ w: 0, h: 0 }`}</code></p>
                    <p>2. 异步加载图片...</p>
                    <p>3. 加载完成后：<code>canvasSize</code> 自动更新为实际尺寸</p>
                    <p>4. 触发组件重新渲染，显示正确尺寸</p>
                </div>

                <PresetPreviewDisplayBlock>
                    {autoSize.w > 0 ? (
                        <SvgEx viewBox={`0 0 ${autoSize.w} ${autoSize.h}`} width="100%">
                            <image href={pic1} width={autoSize.w} height={autoSize.h} />
                            <text x={autoSize.w / 2} y={autoSize.h / 2} textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
                                自动获取: {autoSize.w} × {autoSize.h}
                            </text>
                        </SvgEx>
                    ) : (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                            正在加载图片尺寸...（初始值 w=0, h=0）
                        </div>
                    )}
                </PresetPreviewDisplayBlock>
            </Section>

            {/* 实际应用场景 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>实际应用场景</H2>
            <Section>
                <Description>
                    在组件中动态设置 SVG viewBox（以第一张图为基准）
                </Description>

                <CodeBlock language="typescript">{`const AnyPush = (props: {
    pics?: { url: string }[]
    viewBoxW?: number  // 手动指定宽度（覆盖自动获取）
    viewBoxH?: number  // 手动指定高度（覆盖自动获取）
}) => {
    // 关键逻辑：
    // 1. 使用第一张图的 URL 作为基准
    // 2. 如果提供了 viewBoxW/H，优先使用（覆盖）
    // 3. 否则自动获取第一张图的实际尺寸
    const canvasSize = getImgSizeByDefault(
        props.pics?.[0]?.url,
        props.viewBoxW,
        props.viewBoxH
    );

    return (
        <SvgEx 
            viewBox={\`0 0 \${canvasSize.w} \${canvasSize.h}\`}
            width="100%"
        >
            {/* 所有图片都会按这个 viewBox 尺寸显示 */}
        </SvgEx>
    );
}`}</CodeBlock>

                <div style={{ fontSize: '14px', color: '#666', marginTop: '12px', lineHeight: '1.8' }}>
                    <p><strong>使用示例：</strong></p>
                    <CodeBlock language="typescript">{`// 场景1: 自动获取第一张图尺寸
<AnyPush pics={[
    { url: "pic1.jpg" },  // 作为基准
    { url: "pic2.jpg" },
]} />

// 场景2: 手动指定统一尺寸（推荐）
<AnyPush 
    viewBoxW={375} 
    viewBoxH={667}
    pics={[
        { url: "pic1.jpg" },
        { url: "pic2.jpg" },
    ]} 
/>`}</CodeBlock>
                </div>
            </Section>

            {/* 最佳实践 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px', marginBottom: '24px' }}>最佳实践与注意事项</H2>
            <Section style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#333' }}>
                    <p>✅ <strong>推荐做法</strong>：手动指定 viewBoxW/H（性能最好，避免响应式更新）</p>
                    <p>📐 <strong>核心价值</strong>：统一所有图片尺寸，无需逐个测量</p>
                    <p>🎯 <strong>设计模式</strong>：以第一张图为基准，其他图自动适配</p>
                    <p>⚠️ <strong>异步特性</strong>：这是响应式 Hook，返回值会随图片加载完成而自动更新</p>
                    <p>🔄 <strong>渲染影响</strong>：自动获取时，初次渲染为 <code>{`{ w: 0, h: 0 }`}</code>，加载后触发重渲染</p>
                    <p>💡 <strong>性能优化</strong>：内部使用 <code>useMemo</code> 缓存，避免不必要的重复计算</p>
                </div>
            </Section>
        </SectionEx>
    );
};

const preset: DocumentExport = {
    title: "图片尺寸自动获取",
    jsx: <Article />
};

export default preset;

