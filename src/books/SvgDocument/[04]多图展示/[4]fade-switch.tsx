import React from "react";
import { DocumentExport } from "../data/svgDocumentLoader.tsx";
import SectionEx from "../../../dev/pubComponents/PureHTML/basicEx/SectionEx.tsx";
import FadeSwitch from "../../../dev/pubComponents/SVG/C3_MultiDisplay/FadeSwitch";
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
import pic5 from "../data/assets/300x300/5.jpg";
import pic6 from "../data/assets/300x300/6.jpg";

const Article = () => {
    // 统一设置画布最大宽度
    const maxWidth = 350;

    return (
        <SectionEx className="multi-display-presets">
            <H1>渐变切换 FadeSwitch</H1>
            <Description style={{ padding: '0 16px', marginTop: '8px' }}>
                多张图片通过淡入淡出效果平滑切换，营造柔和的视觉过渡
            </Description>

            {/* 1. 基本用法 */}
            <H2 style={{ padding: '0 16px', marginTop: '20px' }}>1. 基本用法</H2>
            <div style={{ padding: '0 16px' }}>
                <P>
                    <code>FadeSwitch</code> 组件实现图片的淡入淡出切换，图片叠加在同一位置通过opacity变化实现平滑过渡。
                </P>
                <InfoBox type="info" style={{ marginTop: '12px' }}>
                    <strong>核心特点：</strong><br/>
                    ✅ 图片淡入淡出切换<br/>
                    ✅ 所有图片叠加在同一位置<br/>
                    ✅ 每张图片独立配置淡入时长和停留时长<br/>
                    ✅ 平滑的视觉过渡效果<br/>
                    ✅ 自动循环播放
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
                                <td style={{ padding: '6px', fontFamily: 'monospace' }}>pics[].fadeDuration</td>
                                <td style={{ padding: '6px', fontSize: '12px', color: '#666' }}>number</td>
                                <td style={{ padding: '6px', fontSize: '12px' }}>淡入淡出时长（秒，默认 0.5，内部最小值 0.0001）</td>
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
                <P>最简单的用法，使用默认的淡入淡出时长</P>
                <div style={{ maxWidth, margin: '0 auto' }}>
                    <FadeSwitch
                        pics={[
                            { url: pic1 },
                            { url: pic2 },
                            { url: pic3 },
                        ]}
                    />
                </div>
                <CodeBlock code={`<FadeSwitch
    pics={[
        { url: pic1 },
        { url: pic2 },
        { url: pic3 },
    ]}
/>`} />
            </div>

            {/* 4. 自定义时长 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>4. 自定义时长</H2>
            <div style={{ padding: '0 16px' }}>
                <P>每张图片可以设置不同的淡入时长和停留时长</P>
                <div style={{ maxWidth, margin: '0 auto' }}>
                    <FadeSwitch
                        pics={[
                            { url: pic1, fadeDuration: 0.8, stayDuration: 1.5 },
                            { url: pic2, fadeDuration: 0.5, stayDuration: 2 },
                            { url: pic3, fadeDuration: 1, stayDuration: 1 },
                        ]}
                    />
                </div>
                <CodeBlock code={`<FadeSwitch
    pics={[
        { url: pic1, fadeDuration: 0.8, stayDuration: 1.5 },
        { url: pic2, fadeDuration: 0.5, stayDuration: 2 },
        { url: pic3, fadeDuration: 1, stayDuration: 1 },
    ]}
/>`} />
            </div>

            {/* 5. 快速切换效果 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>5. 快速切换效果</H2>
            <div style={{ padding: '0 16px' }}>
                <P>缩短淡入时长和停留时长，实现快速切换</P>
                <div style={{ maxWidth, margin: '0 auto' }}>
                    <FadeSwitch
                        pics={[
                            { url: pic4, fadeDuration: 0.3, stayDuration: 0.5 },
                            { url: pic5, fadeDuration: 0.3, stayDuration: 0.5 },
                            { url: pic6, fadeDuration: 0.3, stayDuration: 0.5 },
                        ]}
                    />
                </div>
                <CodeBlock code={`<FadeSwitch
    pics={[
        { url: pic4, fadeDuration: 0.3, stayDuration: 0.5 },
        { url: pic5, fadeDuration: 0.3, stayDuration: 0.5 },
        { url: pic6, fadeDuration: 0.3, stayDuration: 0.5 },
    ]}
/>`} />
            </div>

            {/* 6. 田字格多画布 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>6. 田字格多画布组合</H2>
            <div style={{ padding: '0 16px' }}>
                <P>四个画布组成田字格布局，各自使用不同的时长和图片数量</P>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: 0, 
                    maxWidth: maxWidth * 2,
                    margin: '0 auto' 
                }}>
                    {/* 左上 - 3张图 */}
                    <FadeSwitch
                        pics={[
                            { url: pic1, fadeDuration: 0.5, stayDuration: 1 },
                            { url: pic2, fadeDuration: 0.7, stayDuration: 1.2 },
                            { url: pic3, fadeDuration: 0.4, stayDuration: 0.8 },
                        ]}
                    />
                    {/* 右上 - 4张图 */}
                    <FadeSwitch
                        pics={[
                            { url: pic4, fadeDuration: 0.6, stayDuration: 1.5 },
                            { url: pic5, fadeDuration: 0.9, stayDuration: 0.7 },
                            { url: pic6, fadeDuration: 0.5, stayDuration: 1.3 },
                            { url: pic1, fadeDuration: 0.8, stayDuration: 1 },
                        ]}
                    />
                    {/* 左下 - 2张图 */}
                    <FadeSwitch
                        pics={[
                            { url: pic2, fadeDuration: 1, stayDuration: 2 },
                            { url: pic3, fadeDuration: 0.4, stayDuration: 1.5 },
                        ]}
                    />
                    {/* 右下 - 5张图 */}
                    <FadeSwitch
                        pics={[
                            { url: pic4, fadeDuration: 0.3, stayDuration: 0.8 },
                            { url: pic5, fadeDuration: 0.8, stayDuration: 0.9 },
                            { url: pic6, fadeDuration: 0.6, stayDuration: 1.1 },
                            { url: pic1, fadeDuration: 0.9, stayDuration: 0.7 },
                            { url: pic2, fadeDuration: 0.5, stayDuration: 1.2 },
                        ]}
                    />
                </div>
                <CodeBlock code={`// 田字格布局 - 每个画布独立设置
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0 }}>
    {/* 左上：3张图 */}
    <FadeSwitch pics={[
        { url: pic1, fadeDuration: 0.5, stayDuration: 1 },
        { url: pic2, fadeDuration: 0.7, stayDuration: 1.2 },
        { url: pic3, fadeDuration: 0.4, stayDuration: 0.8 }
    ]} />
    
    {/* 右上：4张图 */}
    <FadeSwitch pics={[/* ... */]} />
    
    {/* 左下：2张图 */}
    <FadeSwitch pics={[/* ... */]} />
    
    {/* 右下：5张图 */}
    <FadeSwitch pics={[/* ... */]} />
</div>`} />
            </div>

            {/* 7. 使用技巧 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>7. 使用技巧</H2>
            <div style={{ padding: '0 16px', marginBottom: '20px' }}>
                <div style={{ background: '#e8f5e9', padding: '12px', borderRadius: '4px', border: '1px solid #4caf50' }}>
                    <p style={{ fontSize: '14px', margin: 0, marginBottom: '8px', fontWeight: 600 }}>💡 推荐实践</p>
                    <ul style={{ fontSize: '13px', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                        <li><strong>淡入时长：</strong>建议 0.3-1 秒，过短会显得生硬，过长会显得拖沓</li>
                        <li><strong>停留时长：</strong>根据内容调整，文字内容建议 1.5-3 秒，纯图建议 0.8-1.5 秒</li>
                        <li><strong>图片数量：</strong>建议 3-5 张，过多会让循环时间过长</li>
                        <li><strong>循环衔接：</strong>组件内置 Ghost 层，确保循环首尾无缝</li>
                        <li><strong>缓动效果：</strong>内置 ease-in-out 曲线，提供平滑的渐变效果</li>
                    </ul>
                </div>

                <div style={{ background: '#fff3cd', padding: '12px', borderRadius: '4px', marginTop: '12px', border: '1px solid #ffc107' }}>
                    <p style={{ fontSize: '14px', margin: 0, marginBottom: '8px', fontWeight: 600 }}>⚠️ 注意事项</p>
                    <ul style={{ fontSize: '13px', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                        <li>所有图片叠加在同一位置，通过 opacity 控制显示</li>
                        <li>每张图的完整周期：保持 → 淡出 → 等待（下一张图在这一段淡入）</li>
                        <li>淡入和淡出使用相同的时长（fadeDuration），内部最小值 0.0001</li>
                        <li>如果只提供一张图片，会自动复制一份形成两张图的切换</li>
                        <li>总循环时长 = 所有图片的 (fadeDuration + stayDuration) 之和</li>
                    </ul>
                </div>
            </div>
        </SectionEx>
    );
};

const preset: DocumentExport = {
    title: "渐变切换 FadeSwitch",
    jsx: <Article />
};

export default preset;

