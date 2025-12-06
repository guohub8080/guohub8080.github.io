import React from "react";
import { DocumentExport } from "../data/svgDocumentLoader.tsx";
import SectionEx from "../../../dev/pubComponents/PureHTML/basicEx/SectionEx.tsx";
import HardCutSwitch from "../../../dev/pubComponents/SVG/C3_MultiDisplay/HardCutSwitch";
import { 
    H1, 
    H2, 
    P, 
    Description 
} from "../data/components/Headings.tsx";
import InfoBox from "../data/components/InfoBox.tsx";
import CodeBlock from "../data/components/CodeBlock.tsx";
import pic1 from "../data/assets/300x300/1.jpg";
import pic2 from "../data/assets/300x300/2.jpg";
import pic3 from "../data/assets/300x300/3.jpg";
import pic4 from "../data/assets/300x300/4.jpg";

const Article = () => {
    const maxWidth = 350;

    return (
        <SectionEx className="multi-display-presets">
            <H1>硬切切换 HardCutSwitch</H1>
            <Description style={{ padding: '0 16px', marginTop: '8px' }}>
                通过不透明度的离散跳变（无过渡）实现图片快速切换，合理配置可模拟 GIF 式逐帧动画
            </Description>

            {/* 1. 基本用法 */}
            <H2 style={{ padding: '0 16px', marginTop: '20px' }}>1. 基本用法</H2>
            <div style={{ padding: '0 16px' }}>
                <P>
                    <code>HardCutSwitch</code> 使用离散不透明度动画（calcMode="discrete"），无需任何缓动，仅根据 <code>stayDuration</code> 控制显示时长。
                </P>
                <InfoBox type="info" style={{ marginTop: '12px' }}>
                    <strong>核心特点：</strong><br/>
                    ✅ 无过渡、瞬时切换（硬切）<br/>
                    ✅ 仅需设置每张图的 <code>stayDuration</code><br/>
                    ✅ 支持任意张数、自动循环<br/>
                    ✅ 易于实现“逐帧”播放效果
                </InfoBox>
            </div>

            {/* 2. 参数说明 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>2. 参数说明</H2>
            <div style={{ padding: '0 16px' }}>
                <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', marginBottom: '12px' }}>
                    <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                                <th style={{ padding: '8px', textAlign: 'left', width: '30%' }}>参数</th>
                                <th style={{ padding: '8px', textAlign: 'left', width: '20%' }}>类型</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '6px', fontFamily: 'monospace' }}>pics</td>
                                <td style={{ padding: '6px', fontSize: '12px', color: '#666' }}>Array</td>
                                <td style={{ padding: '6px', fontSize: '12px' }}>图片配置数组</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '6px', fontFamily: 'monospace' }}>pics[].url</td>
                                <td style={{ padding: '6px', fontSize: '12px', color: '#666' }}>string</td>
                                <td style={{ padding: '6px', fontSize: '12px' }}>图片地址</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '6px', fontFamily: 'monospace' }}>pics[].stayDuration</td>
                                <td style={{ padding: '6px', fontSize: '12px', color: '#666' }}>number</td>
                                <td style={{ padding: '6px', fontSize: '12px' }}>完全显示停留时长（秒，默认 2）</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '6px', fontFamily: 'monospace' }}>viewBoxW</td>
                                <td style={{ padding: '6px', fontSize: '12px', color: '#666' }}>number</td>
                                <td style={{ padding: '6px', fontSize: '12px' }}>画布宽度（可选）</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '6px', fontFamily: 'monospace' }}>viewBoxH</td>
                                <td style={{ padding: '6px', fontSize: '12px', color: '#666' }}>number</td>
                                <td style={{ padding: '6px', fontSize: '12px' }}>画布高度（可选）</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '6px', fontFamily: 'monospace' }}>mp</td>
                                <td style={{ padding: '6px', fontSize: '12px', color: '#666' }}>mpProps</td>
                                <td style={{ padding: '6px', fontSize: '12px' }}>边距样式</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 3. 基本示例 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>3. 基本示例</H2>
            <div style={{ padding: '0 16px' }}>
                <P>三张图片按顺序瞬时切换，形成硬切轮播。</P>
                <div style={{ maxWidth, margin: '0 auto' }}>
                    <HardCutSwitch
                        pics={[
                            { url: pic1, stayDuration: 1.2 },
                            { url: pic2, stayDuration: 1.2 },
                            { url: pic3, stayDuration: 1.2 },
                        ]}
                    />
                </div>
                <CodeBlock code={`<HardCutSwitch
    pics={[
        { url: pic1, stayDuration: 1.2 },
        { url: pic2, stayDuration: 1.2 },
        { url: pic3, stayDuration: 1.2 },
    ]}
/>`} />
            </div>

            {/* 4. 模拟 GIF 式逐帧效果 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>4. 模拟 GIF 式逐帧效果</H2>
            <div style={{ padding: '0 16px' }}>
                <P>
                    将多张序列帧图片（或关键帧）依次硬切显示，可以形成类似 GIF 的逐帧播放效果。
                    合理设置 <code>stayDuration</code> 与图片数量，可控制“帧率”和循环节奏。
                </P>
                <div style={{ maxWidth, margin: '0 auto' }}>
                    <HardCutSwitch
                        pics={[
                            { url: pic1, stayDuration: 0.2 },
                            { url: pic2, stayDuration: 0.2 },
                            { url: pic3, stayDuration: 0.2 },
                        ]}
                    />
                </div>
                <CodeBlock code={`// 以 0.2s 每帧模拟 GIF（稍慢）
<HardCutSwitch
    pics={[
        { url: pic1, stayDuration: 0.2 },
        { url: pic2, stayDuration: 0.2 },
        { url: pic3, stayDuration: 0.2 },
    ]}
/>`} />
                <InfoBox type="info" style={{ marginTop: '12px' }}>
                    <strong>建议：</strong><br/>
                    - 帧越多、每帧时长越短，越接近 GIF 的流畅感。<br/>
                    - 使用同尺寸、同构图的序列帧图片，视觉更稳定。<br/>
                    - 结合网格布局可并行展示多个“逐帧动画”画布。
                </InfoBox>
            </div>

            {/* 5. 使用技巧 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>5. 使用技巧</H2>
            <div style={{ padding: '0 16px', marginBottom: '20px' }}>
                <div style={{ background: '#e8f5e9', padding: '12px', borderRadius: '4px', border: '1px solid #4caf50' }}>
                    <p style={{ fontSize: '14px', margin: 0, marginBottom: '8px', fontWeight: 600 }}>💡 推荐实践</p>
                    <ul style={{ fontSize: '13px', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                        <li><strong>帧率控制：</strong>将 <code>stayDuration</code> 设为 0.05–0.2 秒可模拟 5–20 FPS 效果</li>
                        <li><strong>节奏设计：</strong>混合不同的 <code>stayDuration</code> 可表现“停顿—闪动—停顿”等节奏</li>
                        <li><strong>一致尺寸：</strong>序列帧尺寸一致，避免切换时抖动</li>
                        <li><strong>循环时长：</strong>总时长 = 所有 <code>stayDuration</code> 之和</li>
                    </ul>
                </div>
            </div>
        </SectionEx>
    );
};

const preset: DocumentExport = {
    title: "硬切切换 HardCutSwitch",
    jsx: <Article />
};

export default preset;


