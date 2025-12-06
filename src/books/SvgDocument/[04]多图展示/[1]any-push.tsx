import React from "react";
import { DocumentExport } from "../data/svgDocumentLoader.tsx";
import SectionEx from "../../../dev/pubComponents/PureHTML/basicEx/SectionEx.tsx";
import AnyPush from "../../../dev/pubComponents/SVG/C3_MultiDisplay/AnyPush";
import { 
    H1, 
    H2, 
    P, 
    Description 
} from "../data/components/Headings.tsx";
import InfoBox from "../data/components/InfoBox.tsx";
import CodeBlock from "../data/components/CodeBlock.tsx";
import { getEaseBezier, getPowerBezier, getLinearBezier } from "../../../dev/pubComponents/PubUtils/getBezier";
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
            <H1>推入切换 AnyPush</H1>
            <Description style={{ padding: '0 16px', marginTop: '8px' }}>
                图片推入式切换效果，新图片从指定方向推入，将旧图片推出画面
            </Description>

            {/* 1. 基本用法 */}
            <H2 style={{ padding: '0 16px', marginTop: '20px' }}>1. 基本用法</H2>
            <div style={{ padding: '0 16px' }}>
                <P>
                    <code>AnyPush</code> 组件实现图片的推入式切换，支持左、右、上、下四个方向。
                </P>
                <InfoBox type="info" style={{ marginTop: '12px' }}>
                    <strong>核心特点：</strong><br/>
                    ✅ 支持四个方向推入（L/R/T/B）<br/>
                    ✅ 每张图片独立配置切换时长和停留时长<br/>
                    ✅ 自定义贝塞尔曲线控制动画缓动<br/>
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
                                <td style={{ padding: '6px', fontFamily: 'monospace' }}>pics[].direction</td>
                                <td style={{ padding: '6px', fontSize: '12px', color: '#666' }}>L|R|T|B</td>
                                <td style={{ padding: '6px', fontSize: '12px' }}>推入方向（默认 R）</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '6px', fontFamily: 'monospace' }}>pics[].switchDuration</td>
                                <td style={{ padding: '6px', fontSize: '12px', color: '#666' }}>number</td>
                                <td style={{ padding: '6px', fontSize: '12px' }}>切换时长（秒，默认 0.5）</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '6px', fontFamily: 'monospace' }}>pics[].stayDuration</td>
                                <td style={{ padding: '6px', fontSize: '12px', color: '#666' }}>number</td>
                                <td style={{ padding: '6px', fontSize: '12px' }}>停留时长（秒，默认 0.5）</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '6px', fontFamily: 'monospace' }}>pics[].keySplines</td>
                                <td style={{ padding: '6px', fontSize: '12px', color: '#666' }}>string</td>
                                <td style={{ padding: '6px', fontSize: '12px' }}>贝塞尔曲线（默认 ease-in-out）</td>
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
                <P>默认从右侧推入，可通过 direction 参数设置方向（L/R/T/B）</P>
                <div style={{ maxWidth, margin: '0 auto' }}>
                    <AnyPush
                        pics={[
                            { url: pic1 },
                            { url: pic2 },
                            { url: pic3 },
                        ]}
                    />
                </div>
                <CodeBlock code={`<AnyPush
    pics={[
        { url: pic1 },
        { url: pic2 },
        { url: pic3 },
    ]}
/>`} />
            </div>

            {/* 4. 跑马灯效果 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>4. 跑马灯效果</H2>
            <div style={{ padding: '0 16px' }}>
                <P>当所有图片使用相同的方向、相同的时长、停留时间为0和线性缓动时，可实现完全覆盖的跑马灯效果</P>
                <InfoBox type="success" style={{ marginTop: '12px' }}>
                    <strong>跑马灯要点：</strong><br/>
                    ✅ 所有图片使用相同的 direction<br/>
                    ✅ 所有图片使用相同的 switchDuration<br/>
                    ✅ stayDuration 设置为 0（无停留，连续播放）<br/>
                    ✅ 使用 getLinearBezier() 线性缓动<br/>
                    ✅ 效果：图片匀速连续推入，形成流畅的跑马灯
                </InfoBox>
                <div style={{ maxWidth, margin: '0 auto', marginTop: '12px' }}>
                    <AnyPush
                        pics={[
                            { url: pic1, direction: "R", switchDuration: 0.5, stayDuration: 0, keySplines: getLinearBezier() },
                            { url: pic2, direction: "R", switchDuration: 0.5, stayDuration: 0, keySplines: getLinearBezier() },
                            { url: pic3, direction: "R", switchDuration: 0.5, stayDuration: 0, keySplines: getLinearBezier() },
                            { url: pic4, direction: "R", switchDuration: 0.5, stayDuration: 0, keySplines: getLinearBezier() },
                            { url: pic5, direction: "R", switchDuration: 0.5, stayDuration: 0, keySplines: getLinearBezier() },
                        ]}
                    />
                </div>
                <CodeBlock code={`// 跑马灯效果：相同方向 + 相同时长 + 停留为0 + 线性缓动
<AnyPush
    pics={[
        { url: pic1, direction: "R", switchDuration: 0.5, stayDuration: 0, keySplines: getLinearBezier() },
        { url: pic2, direction: "R", switchDuration: 0.5, stayDuration: 0, keySplines: getLinearBezier() },
        { url: pic3, direction: "R", switchDuration: 0.5, stayDuration: 0, keySplines: getLinearBezier() },
        { url: pic4, direction: "R", switchDuration: 0.5, stayDuration: 0, keySplines: getLinearBezier() },
        { url: pic5, direction: "R", switchDuration: 0.5, stayDuration: 0, keySplines: getLinearBezier() },
    ]}
/>`} />
            </div>

            {/* 5. 综合应用 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>5. 综合应用</H2>
            <div style={{ padding: '0 16px' }}>
                <P>结合方向、时长、缓动函数的完整示例</P>
                <div style={{ maxWidth, margin: '0 auto' }}>
                    <AnyPush
                        pics={[
                            { 
                                url: pic1, 
                                direction: "R",
                                switchDuration: 0.8,
                                stayDuration: 1.2,
                                keySplines: getEaseBezier({ isIn: true, isOut: true })
                            },
                            { 
                                url: pic2, 
                                direction: "B",
                                switchDuration: 0.6,
                                stayDuration: 1,
                                keySplines: getPowerBezier({ power: 2, isIn: true, isOut: true })
                            },
                            { 
                                url: pic3, 
                                direction: "L",
                                switchDuration: 0.7,
                                stayDuration: 1.5,
                                keySplines: getEaseBezier({ isIn: false, isOut: true })
                            },
                            { 
                                url: pic4, 
                                direction: "T",
                                switchDuration: 0.5,
                                stayDuration: 0.8,
                                keySplines: getLinearBezier()
                            },
                            { 
                                url: pic5, 
                                direction: "R",
                                switchDuration: 1,
                                stayDuration: 1,
                                keySplines: getPowerBezier({ power: 4, isIn: true, isOut: false })
                            },
                            { 
                                url: pic6, 
                                direction: "B",
                                switchDuration: 0.4,
                                stayDuration: 1.3,
                                keySplines: getEaseBezier({ isIn: true, isOut: false })
                            },
                        ]}
                    />
                </div>
                <CodeBlock code={`<AnyPush
    pics={[
        { url: pic1, direction: "R", switchDuration: 0.8, stayDuration: 1.2, keySplines: getEaseBezier({ isIn: true, isOut: true }) },
        { url: pic2, direction: "B", switchDuration: 0.6, stayDuration: 1, keySplines: getPowerBezier({ power: 2, isIn: true, isOut: true }) },
        { url: pic3, direction: "L", switchDuration: 0.7, stayDuration: 1.5, keySplines: getEaseBezier({ isIn: false, isOut: true }) },
        // ... 更多配置
    ]}
/>`} />
            </div>

            {/* 6. 田字格多画布 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>6. 田字格多画布组合</H2>
            <div style={{ padding: '0 16px' }}>
                <P>四个画布组成田字格布局，各自使用不同的方向、时长、图片数量和缓动函数</P>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: 0, 
                    maxWidth: maxWidth * 2,
                    margin: '0 auto' 
                }}>
                    {/* 左上 - 3张图，各自随机方向和时长 */}
                    <AnyPush
                        pics={[
                            { url: pic1, direction: "R", switchDuration: 0.5, stayDuration: 0.8, keySplines: getLinearBezier() },
                            { url: pic2, direction: "B", switchDuration: 0.7, stayDuration: 1.1, keySplines: getEaseBezier({ isIn: true, isOut: false }) },
                            { url: pic3, direction: "L", switchDuration: 0.4, stayDuration: 0.9, keySplines: getPowerBezier({ power: 2, isIn: false, isOut: true }) },
                        ]}
                    />
                    {/* 右上 - 4张图，各自随机方向和时长 */}
                    <AnyPush
                        pics={[
                            { url: pic4, direction: "T", switchDuration: 0.6, stayDuration: 1.2, keySplines: getEaseBezier({ isIn: true, isOut: true }) },
                            { url: pic5, direction: "R", switchDuration: 0.9, stayDuration: 0.7, keySplines: getLinearBezier() },
                            { url: pic6, direction: "B", switchDuration: 0.5, stayDuration: 1.4, keySplines: getPowerBezier({ power: 3, isIn: true, isOut: false }) },
                            { url: pic1, direction: "L", switchDuration: 0.8, stayDuration: 1.0, keySplines: getEaseBezier({ isIn: false, isOut: true }) },
                        ]}
                    />
                    {/* 左下 - 2张图，各自随机方向和时长 */}
                    <AnyPush
                        pics={[
                            { url: pic2, direction: "T", switchDuration: 1.0, stayDuration: 0.6, keySplines: getPowerBezier({ power: 4, isIn: true, isOut: true }) },
                            { url: pic3, direction: "R", switchDuration: 0.4, stayDuration: 1.5, keySplines: getLinearBezier() },
                        ]}
                    />
                    {/* 右下 - 5张图，各自随机方向和时长 */}
                    <AnyPush
                        pics={[
                            { url: pic4, direction: "L", switchDuration: 0.3, stayDuration: 1.3, keySplines: getEaseBezier({ isIn: true, isOut: false }) },
                            { url: pic5, direction: "T", switchDuration: 0.8, stayDuration: 0.9, keySplines: getPowerBezier({ power: 2, isIn: false, isOut: true }) },
                            { url: pic6, direction: "R", switchDuration: 0.6, stayDuration: 1.1, keySplines: getLinearBezier() },
                            { url: pic1, direction: "B", switchDuration: 0.9, stayDuration: 0.7, keySplines: getEaseBezier({ isIn: true, isOut: true }) },
                            { url: pic2, direction: "L", switchDuration: 0.5, stayDuration: 1.2, keySplines: getEaseBezier({ isIn: false, isOut: true }) },
                        ]}
                    />
                </div>
                <CodeBlock code={`// 田字格布局 - 每张图片都有独立的随机方向、时长和缓动
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0 }}>
    {/* 左上：3张图 */}
    <AnyPush pics={[
        { url: pic1, direction: "R", switchDuration: 0.5, ... },  // 右
        { url: pic2, direction: "B", switchDuration: 0.7, ... },  // 下
        { url: pic3, direction: "L", switchDuration: 0.4, ... }   // 左
    ]} />
    
    {/* 右上：4张图 */}
    <AnyPush pics={[
        { url: pic4, direction: "T", switchDuration: 0.6, ... },  // 上
        { url: pic5, direction: "R", switchDuration: 0.9, ... },  // 右
        { url: pic6, direction: "B", switchDuration: 0.5, ... },  // 下
        { url: pic1, direction: "L", switchDuration: 0.8, ... }   // 左
    ]} />
    
    {/* 左下：2张图 */}
    <AnyPush pics={[
        { url: pic2, direction: "T", switchDuration: 1.0, ... },  // 上
        { url: pic3, direction: "R", switchDuration: 0.4, ... }   // 右
    ]} />
    
    {/* 右下：5张图 */}
    <AnyPush pics={[
        { url: pic4, direction: "L", switchDuration: 0.3, ... },  // 左
        { url: pic5, direction: "T", switchDuration: 0.8, ... },  // 上
        { url: pic6, direction: "R", switchDuration: 0.6, ... },  // 右
        { url: pic1, direction: "B", switchDuration: 0.9, ... },  // 下
        { url: pic2, direction: "L", switchDuration: 0.5, ... }   // 左
    ]} />
</div>`} />
            </div>

            {/* 7. 使用技巧 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>7. 使用技巧</H2>
            <div style={{ padding: '0 16px', marginBottom: '20px' }}>
                <div style={{ background: '#e8f5e9', padding: '12px', borderRadius: '4px', border: '1px solid #4caf50' }}>
                    <p style={{ fontSize: '14px', margin: 0, marginBottom: '8px', fontWeight: 600 }}>💡 推荐实践</p>
                    <ul style={{ fontSize: '13px', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                        <li><strong>方向选择：</strong>水平方向（L/R）适合风景图，垂直方向（T/B）适合人物图</li>
                        <li><strong>时长设置：</strong>切换时长 0.3-1 秒最佳，停留时长根据内容复杂度调整</li>
                        <li><strong>缓动函数：</strong>默认的 ease-in-out 适合大多数场景</li>
                        <li><strong>跑马灯效果：</strong>相同方向+相同时长+停留为0+线性缓动，可实现连续流畅的跑马灯</li>
                        <li><strong>图片数量：</strong>建议 3-6 张，过多会影响用户体验</li>
                        <li><strong>图片尺寸：</strong>确保所有图片尺寸一致，避免画面跳动</li>
                        <li><strong>自动循环：</strong>组件会自动循环播放，无需额外配置</li>
                    </ul>
                </div>

                <div style={{ background: '#fff3cd', padding: '12px', borderRadius: '4px', marginTop: '12px', border: '1px solid #ffc107' }}>
                    <p style={{ fontSize: '14px', margin: 0, marginBottom: '8px', fontWeight: 600 }}>⚠️ 注意事项</p>
                    <ul style={{ fontSize: '13px', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                        <li>如果只提供 1 张图片，会自动复制为 2 张以实现动画效果</li>
                        <li>方向参数仅支持 "L"、"R"、"T"、"B" 四个值</li>
                        <li>图片会按照数组顺序依次播放</li>
                        <li>每张图片的切换时长和停留时长独立计算</li>
                    </ul>
                </div>
            </div>
        </SectionEx>
    );
};

const preset: DocumentExport = {
    title: "推入切换 AnyPush",
    jsx: <Article />
};

export default preset;

