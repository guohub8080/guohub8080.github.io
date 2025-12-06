import React from "react";
import { DocumentExport } from "../data/svgDocumentLoader.tsx";
import SectionEx from "../../../dev/pubComponents/PureHTML/basicEx/SectionEx.tsx";
import CodeBlock from "../data/components/CodeBlock.tsx";
import { H1, H2, H3, H4, P, Description } from "../data/components/Headings.tsx";
import { TableContainer } from "../data/components";

const Article = () => {
    return (
        <SectionEx className="standard-presets">
            <H1>无缝图组件 SeamlessImg</H1>
            <Description style={{ padding: '0 16px', marginTop: '8px' }}>
                用于显示无缝背景图片，支持深色模式对抗和多种交互模式
            </Description>

            {/* 1. 什么是无缝图 */}
            <H2 style={{ padding: '0 16px', marginTop: '20px' }}>1. 什么是无缝图？</H2>
            <div style={{ padding: '0 16px' }}>
                <P>
                    无缝图是一种特殊的图片展示方式，使用 SVG 的 <code>background-image</code> 技术实现。
                </P>
                <div style={{ background: '#e3f2fd', padding: '12px', borderRadius: '4px', marginBottom: '12px', border: '1px solid #2196f3' }}>
                    <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
                        <strong>核心特点：</strong><br/>
                        ✅ 图片和容器之间<strong>无缝隙、无白边</strong><br/>
                        ✅ 支持<strong>深色模式对抗</strong>（图片不会变灰）<br/>
                        ✅ 可控制交互行为（可点击、可穿透、可长按等）
                    </p>
                </div>
            </div>

            {/* 2. 基本用法 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>2. 基本用法</H2>
            <div style={{ padding: '0 16px' }}>
                <CodeBlock code={`import SeamlessImg from '@pubSVG/C1_Standard/SeamlessImg';

// 最简单的用法（默认深色对抗）
<SeamlessImg 
  url="https://example.com/image.jpg"
  w={300}
  h={200}
/>

// 使用占位符（开发时）
<SeamlessImg 
  url={getWechat300x300(1)}
  w={300}
  h={200}
/>`} />
            </div>

            {/* 3. 参数说明 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>3. 参数说明</H2>
            <div style={{ padding: '0 16px' }}>
                <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', marginBottom: '12px' }}>
                    <TableContainer>
                    <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', fontFamily: 'inherit' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                                <th style={{ padding: '8px', textAlign: 'left', width: '30%', fontFamily: 'inherit' }}>参数</th>
                                <th style={{ padding: '8px', textAlign: 'left', width: '20%', fontFamily: 'inherit' }}>类型</th>
                                <th style={{ padding: '8px', textAlign: 'left', fontFamily: 'inherit' }}>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '6px', fontFamily: 'monospace' }}>url</td>
                                <td style={{ padding: '6px', fontSize: '12px', color: '#666', fontFamily: 'inherit' }}>string</td>
                                <td style={{ padding: '6px', fontSize: '12px', fontFamily: 'inherit' }}>图片地址（可选，默认使用占位图）</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '6px', fontFamily: 'monospace' }}>w</td>
                                <td style={{ padding: '6px', fontSize: '12px', color: '#666', fontFamily: 'inherit' }}>number</td>
                                <td style={{ padding: '6px', fontSize: '12px', fontFamily: 'inherit' }}>图片宽度（可选，默认自动获取）</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '6px', fontFamily: 'monospace' }}>h</td>
                                <td style={{ padding: '6px', fontSize: '12px', color: '#666', fontFamily: 'inherit' }}>number</td>
                                <td style={{ padding: '6px', fontSize: '12px', fontFamily: 'inherit' }}>图片高度（可选，默认自动获取）</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '6px', fontFamily: 'monospace' }}>mp</td>
                                <td style={{ padding: '6px', fontSize: '12px', color: '#666', fontFamily: 'inherit' }}>mpProps</td>
                                <td style={{ padding: '6px', fontSize: '12px', fontFamily: 'inherit' }}>边距样式（margin, padding 等）</td>
                            </tr>
                        </tbody>
                    </table>
                    </TableContainer>
                </div>
            </div>

            {/* 4. 七种模式详解 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>4. 七种模式详解</H2>
            <div style={{ padding: '0 16px' }}>
                <P>
                    <code>SeamlessImg</code> 提供了 7 种不同的实现方式，通过布尔参数控制。<strong>优先级从高到低</strong>：
                </P>

                {/* 模式 1 - 默认深色对抗 */}
                <div style={{ marginBottom: '16px', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '12px' }}>
                    <H3 style={{ padding: 0, marginBottom: '8px' }}>模式 1：默认深色对抗 ⭐</H3>
                    <div style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px', marginBottom: '8px' }}>
                        <code style={{ fontSize: '13px' }}>默认模式（无需额外参数）</code>
                    </div>
                    <p style={{ fontSize: '14px', color: '#333', marginBottom: '8px', lineHeight: '1.6' }}>
                        <strong>特点：</strong><br/>
                        • 使用 SVG <code>background-image</code> 显示图片<br/>
                        • 自带 <code>transform: scale(1)</code> 实现深色模式对抗<br/>
                        • 不可点击弹出，但可长按识别保存
                    </p>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                        <strong>适用场景：</strong>装饰性图片、背景图、不需要弹出的内容图
                    </p>
                    <CodeBlock code={`<SeamlessImg url="..." w={300} h={200} />`} />
                </div>

                {/* 模式 2 - 自然优先级 */}
                <div style={{ marginBottom: '16px', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '12px' }}>
                    <H3 style={{ padding: 0, marginBottom: '8px' }}>模式 2：自然优先级</H3>
                    <div style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px', marginBottom: '8px' }}>
                        <code style={{ fontSize: '13px' }}>isNaturalPriority=&#123;true&#125;</code>
                    </div>
                    <p style={{ fontSize: '14px', color: '#333', marginBottom: '8px', lineHeight: '1.6' }}>
                        <strong>特点：</strong><br/>
                        • 无 <code>transform</code> 属性<br/>
                        • 在层叠场景中保持自然的渲染优先级<br/>
                        • 深色模式下可能变灰（无深色对抗）
                    </p>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                        <strong>适用场景：</strong>需要精确控制渲染层级的场景
                    </p>
                    <CodeBlock code={`<SeamlessImg 
  url="..." 
  w={300} 
  h={200} 
  isNaturalPriority={true} 
/>`} />
                </div>

                {/* 模式 3 - 事件穿透 */}
                <div style={{ marginBottom: '16px', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '12px' }}>
                    <H3 style={{ padding: 0, marginBottom: '8px' }}>模式 3：事件穿透</H3>
                    <div style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px', marginBottom: '8px' }}>
                        <code style={{ fontSize: '13px' }}>isEventThrough=&#123;true&#125;</code>
                    </div>
                    <p style={{ fontSize: '14px', color: '#333', marginBottom: '8px', lineHeight: '1.6' }}>
                        <strong>特点：</strong><br/>
                        • 添加 <code>pointerEvents: 'none'</code><br/>
                        • 点击事件会穿透到下层元素<br/>
                        • 支持深色对抗
                    </p>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                        <strong>适用场景：</strong>半透明遮罩层、需要点击穿透的装饰图
                    </p>
                    <CodeBlock code={`<SeamlessImg 
  url="..." 
  w={300} 
  h={200} 
  isEventThrough={true} 
/>`} />
                </div>

                {/* 模式 4 - 可弹出 */}
                <div style={{ marginBottom: '16px', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '12px' }}>
                    <H3 style={{ padding: 0, marginBottom: '8px' }}>模式 4：可弹出 🖼️</H3>
                    <div style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px', marginBottom: '8px' }}>
                        <code style={{ fontSize: '13px' }}>isPopable=&#123;true&#125;</code>
                    </div>
                    <p style={{ fontSize: '14px', color: '#333', marginBottom: '8px', lineHeight: '1.6' }}>
                        <strong>特点：</strong><br/>
                        • 使用 <code>&lt;foreignObject&gt;</code> + <code>&lt;img&gt;</code> 实现<br/>
                        • 点击可弹出查看大图<br/>
                        • 同时保留 SVG 背景显示（双层结构）
                    </p>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                        <strong>适用场景：</strong>需要用户查看原图的内容图片
                    </p>
                    <CodeBlock code={`<SeamlessImg 
  url="..." 
  w={300} 
  h={200} 
  isPopable={true} 
/>`} />
                </div>

                {/* 模式 5 - 强制可触摸 */}
                <div style={{ marginBottom: '16px', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '12px' }}>
                    <H3 style={{ padding: 0, marginBottom: '8px' }}>模式 5：强制可触摸</H3>
                    <div style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px', marginBottom: '8px' }}>
                        <code style={{ fontSize: '13px' }}>isTouchForced=&#123;true&#125;</code>
                    </div>
                    <p style={{ fontSize: '14px', color: '#333', marginBottom: '8px', lineHeight: '1.6' }}>
                        <strong>特点：</strong><br/>
                        • 添加 <code>pointerEvents: 'visible'</code><br/>
                        • 强制接收所有触摸事件<br/>
                        • 支持深色对抗
                    </p>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                        <strong>适用场景：</strong>需要确保能够响应点击的交互图片
                    </p>
                    <CodeBlock code={`<SeamlessImg 
  url="..." 
  w={300} 
  h={200} 
  isTouchForced={true} 
/>`} />
                </div>

                {/* 模式 6 - 发布后可替换 */}
                <div style={{ marginBottom: '16px', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '12px' }}>
                    <H3 style={{ padding: 0, marginBottom: '8px' }}>模式 6：发布后可替换 🔄</H3>
                    <div style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px', marginBottom: '8px' }}>
                        <code style={{ fontSize: '13px' }}>isReplaceableAfterPublish=&#123;true&#125;</code>
                    </div>
                    <p style={{ fontSize: '14px', color: '#333', marginBottom: '8px', lineHeight: '1.6' }}>
                        <strong>特点：</strong><br/>
                        • 使用 <code>data-src</code> 属性存储图片地址<br/>
                        • 支持公众号发布后通过脚本替换图片<br/>
                        • 使用 <code>&lt;foreignObject&gt;</code> + <code>&lt;img&gt;</code>
                    </p>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                        <strong>适用场景：</strong>需要动态更新内容的图片（如活动海报、实时数据图）
                    </p>
                    <CodeBlock code={`<SeamlessImg 
  url="..." 
  w={300} 
  h={200} 
  isReplaceableAfterPublish={true} 
/>`} />
                </div>

                {/* 模式 7 - 仅长按识别 */}
                <div style={{ marginBottom: '16px', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '12px' }}>
                    <H3 style={{ padding: 0, marginBottom: '8px' }}>模式 7：仅长按识别 👆</H3>
                    <div style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px', marginBottom: '8px' }}>
                        <code style={{ fontSize: '13px' }}>isLongPressOnly=&#123;true&#125;</code>
                    </div>
                    <p style={{ fontSize: '14px', color: '#333', marginBottom: '8px', lineHeight: '1.6' }}>
                        <strong>特点：</strong><br/>
                        • 双层结构：透明 <code>&lt;img&gt;</code>（opacity: 0）+ SVG 背景<br/>
                        • 不可点击弹出，但可长按识别保存<br/>
                        • 支持深色对抗
                    </p>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                        <strong>适用场景：</strong>希望用户保存图片但不想弹出预览的场景（如二维码、海报）
                    </p>
                    <CodeBlock code={`<SeamlessImg 
  url="..." 
  w={300} 
  h={200} 
  isLongPressOnly={true} 
/>`} />
                </div>
            </div>

            {/* 5. 模式选择优先级 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>5. 模式选择优先级</H2>
            <div style={{ padding: '0 16px' }}>
                <P>
                    当同时设置多个参数时，优先级从高到低：
                </P>
                <div style={{ background: '#fff3cd', padding: '12px', borderRadius: '4px', border: '1px solid #ffc107' }}>
                    <ol style={{ fontSize: '14px', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
                        <li><code>isLongPressOnly</code> - 仅长按识别</li>
                        <li><code>isReplaceableAfterPublish</code> - 发布后可替换</li>
                        <li><code>isTouchForced</code> - 强制可触摸</li>
                        <li><code>isPopable</code> - 可弹出</li>
                        <li><code>isEventThrough</code> - 事件穿透</li>
                        <li><code>isNaturalPriority</code> - 自然优先级</li>
                        <li>默认 - 深色对抗模式</li>
                    </ol>
                </div>
            </div>

            {/* 6. 功能对比表格 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>6. 功能对比表</H2>
            <div style={{ padding: '0 16px' }}>
                <TableContainer>
                    <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', border: '1px solid #ddd', fontFamily: 'inherit' }}>
                        <thead>
                            <tr style={{ background: '#f5f5f5' }}>
                                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd', minWidth: '120px', fontFamily: 'inherit' }}>模式</th>
                                <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd', fontFamily: 'inherit' }}>深色对抗</th>
                                <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd', fontFamily: 'inherit' }}>可弹出</th>
                                <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd', fontFamily: 'inherit' }}>可长按</th>
                                <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd', fontFamily: 'inherit' }}>事件穿透</th>
                                <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd', fontFamily: 'inherit' }}>可替换</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '8px', fontFamily: 'inherit' }}>默认深色对抗</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>✅</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>❌</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>✅</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>❌</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>❌</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '8px', fontFamily: 'inherit' }}>自然优先级</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>❌</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>❌</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>✅</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>❌</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>❌</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '8px', fontFamily: 'inherit' }}>事件穿透</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>✅</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>❌</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>❌</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>✅</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>❌</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '8px', fontFamily: 'inherit' }}>可弹出</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>✅</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>✅</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>✅</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>❌</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>❌</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '8px', fontFamily: 'inherit' }}>强制可触摸</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>✅</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>❌</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>✅</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>❌</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>❌</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '8px', fontFamily: 'inherit' }}>发布后可替换</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>✅</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>❌</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>✅</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>❌</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>✅</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '8px', fontFamily: 'inherit' }}>仅长按识别</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>✅</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>❌</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>✅</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>❌</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>❌</td>
                            </tr>
                        </tbody>
                    </table>
                </TableContainer>
            </div>

            {/* 7. 快速选择指南 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>7. 快速选择指南</H2>
            <div style={{ padding: '0 16px' }}>
                <div style={{ background: '#e8f5e9', padding: '12px', borderRadius: '4px', border: '1px solid #4caf50' }}>
                    <TableContainer>
                    <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse', fontFamily: 'inherit' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid ' }}>
                                <th style={{ padding: '10px', textAlign: 'left', fontFamily: 'inherit' }}>使用场景</th>
                                <th style={{ padding: '10px', textAlign: 'left', fontFamily: 'inherit' }}>推荐模式</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #c8e6c9' }}>
                                <td style={{ padding: '8px', fontFamily: 'inherit' }}>装饰性背景图、不需要弹出</td>
                                <td style={{ padding: '8px', fontFamily: 'monospace' }}>默认模式</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #c8e6c9' }}>
                                <td style={{ padding: '8px', fontFamily: 'inherit' }}>内容图片，用户需要查看大图</td>
                                <td style={{ padding: '8px', fontFamily: 'monospace' }}>isPopable={true}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #c8e6c9' }}>
                                <td style={{ padding: '8px', fontFamily: 'inherit' }}>二维码、海报（可保存不可弹出）</td>
                                <td style={{ padding: '8px', fontFamily: 'monospace' }}>isLongPressOnly={true}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #c8e6c9' }}>
                                <td style={{ padding: '8px', fontFamily: 'inherit' }}>半透明遮罩、需要点击穿透</td>
                                <td style={{ padding: '8px', fontFamily: 'monospace' }}>isEventThrough={true}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #c8e6c9' }}>
                                <td style={{ padding: '8px', fontFamily: 'inherit' }}>动态更新的活动图片</td>
                                <td style={{ padding: '8px', fontFamily: 'monospace' }}>isReplaceableAfterPublish={true}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #c8e6c9' }}>
                                <td style={{ padding: '8px', fontFamily: 'inherit' }}>需要精确控制层级关系</td>
                                <td style={{ padding: '8px', fontFamily: 'monospace' }}>isNaturalPriority={true}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '8px', fontFamily: 'inherit' }}>确保能响应点击事件</td>
                                <td style={{ padding: '8px', fontFamily: 'monospace' }}>isTouchForced={true}</td>
                            </tr>
                        </tbody>
                    </table>
                    </TableContainer>
                </div>
            </div>

            {/* 8. SVG 嵌套与兼容性说明 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px' }}>8. SVG 嵌套与兼容性说明</H2>
            
            <div style={{ padding: '0 16px' }}>
                <H3 style={{ marginTop: '16px' }}>8.1 两种实现结构</H3>
                <P>
                    无缝图组件根据功能需求采用两种不同的 HTML/SVG 结构：
                </P>

                {/* 结构 A */}
                <div style={{ marginBottom: '16px', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '12px' }}>
                    <H4 style={{ padding: 0, marginBottom: '8px' }}>结构 A：section 包裹 SVG</H4>
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                        模式 1, 2, 3, 5, 7 使用此结构
                    </p>
                    <CodeBlock code={`<section>
  <svg style={{ backgroundImage: svgURL(url) }}>
    {/* SVG 本身作为容器，通过 background-image 显示图片 */}
  </svg>
</section>`} />
                    <p style={{ fontSize: '14px', color: '#333', marginTop: '8px', lineHeight: '1.6' }}>
                        <strong>特点：</strong><br/>
                        ✅ 轻量级，性能好<br/>
                        ✅ 深色对抗稳定<br/>
                        ❌ 不支持点击弹出查看<br/>
                        ❌ 不支持 data-src 动态替换
                    </p>
                </div>

                {/* 结构 B */}
                <div style={{ marginBottom: '16px', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '12px' }}>
                    <H4 style={{ padding: 0, marginBottom: '8px' }}>结构 B：foreignObject 嵌入</H4>
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                        模式 4, 6 使用此结构
                    </p>
                    <CodeBlock code={`<section>
  <svg>
    <foreignObject>
      <img src={url} />  {/* 通过 foreignObject 嵌入 HTML img 标签 */}
    </foreignObject>
    <foreignObject>
      <svg style={{ backgroundImage: svgURL(url) }} />  {/* 背景层 */}
    </foreignObject>
  </svg>
</section>`} />
                    <p style={{ fontSize: '14px', color: '#333', marginTop: '8px', lineHeight: '1.6' }}>
                        <strong>特点：</strong><br/>
                        ✅ 支持点击弹出查看
                        ✅ 支持 data-src 属性
                        ✅ 可嵌入任何 HTML 元素
                        ⚠️ 结构复杂，性能略低
                    </p>
                </div>

                <H3 style={{ marginTop: '16px' }}>8.2 为什么需要 foreignObject？</H3>
                <P>
                    SVG 是一个独立的图形系统，<strong>不能直接包含 HTML 元素</strong>。如果需要在 SVG 中使用 HTML 功能，必须通过 <code>&lt;foreignObject&gt;</code> 标签。
                </P>
                <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', marginBottom: '12px' }}>
                    <TableContainer>
                    <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', fontFamily: 'inherit' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                                <th style={{ padding: '8px', textAlign: 'left', fontFamily: 'inherit' }}>需求</th>
                                <th style={{ padding: '8px', textAlign: 'center', fontFamily: 'inherit' }}>foreignObject</th>
                                <th style={{ padding: '8px', textAlign: 'left', fontFamily: 'inherit' }}>原因</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '6px', fontFamily: 'inherit' }}>纯背景图显示</td>
                                <td style={{ padding: '6px', textAlign: 'center' }}>❌ 不需要</td>
                                <td style={{ padding: '6px', fontSize: '12px', fontFamily: 'inherit' }}>使用 background-image 即可</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '6px', fontFamily: 'inherit' }}>点击弹出查看</td>
                                <td style={{ padding: '6px', textAlign: 'center' }}>✅ 需要</td>
                                <td style={{ padding: '6px', fontSize: '12px', fontFamily: 'inherit' }}>需要嵌入 &lt;img&gt; 标签触发点击事件</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '6px', fontFamily: 'inherit' }}>长按识别图片</td>
                                <td style={{ padding: '6px', textAlign: 'center' }}>✅ 需要</td>
                                <td style={{ padding: '6px', fontSize: '12px', fontFamily: 'inherit' }}>需要嵌入透明 &lt;img&gt; 标签提供长按目标</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '6px', fontFamily: 'inherit' }}>data-src 属性</td>
                                <td style={{ padding: '6px', textAlign: 'center' }}>✅ 需要</td>
                                <td style={{ padding: '6px', fontSize: '12px', fontFamily: 'inherit' }}>data-src 是 HTML 属性，SVG 不支持</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '6px', fontFamily: 'inherit' }}>嵌入表单、视频等</td>
                                <td style={{ padding: '6px', textAlign: 'center' }}>✅ 需要</td>
                                <td style={{ padding: '6px', fontSize: '12px', fontFamily: 'inherit' }}>这些都是 HTML 元素</td>
                            </tr>
                        </tbody>
                    </table>
                    </TableContainer>
                </div>

                <H3 style={{ marginTop: '16px' }}>8.3 foreignObject 使用注意事项</H3>
                
                <div style={{ background: '#fff3cd', padding: '12px', borderRadius: '4px', marginBottom: '12px', border: '1px solid #ffc107' }}>
                    <p style={{ fontSize: '14px', margin: 0, marginBottom: '8px', fontWeight: 600 }}>⚠️ 命名空间声明</p>
                    <p style={{ fontSize: '13px', margin: 0, marginBottom: '8px' }}>
                        使用 foreignObject 时，SVG 标签必须声明 XML 命名空间：
                    </p>
                    <CodeBlock code={`<svg 
  xmlns="http://www.w3.org/2000/svg"
  xmlnsXlink="http://www.w3.org/1999/xlink"  // 如果使用 xlink:href
>
  <foreignObject width={w} height={h}>
    <img src={url} />
  </foreignObject>
</svg>`} />
                </div>

                <div style={{ background: '#fff3cd', padding: '12px', borderRadius: '4px', marginBottom: '12px', border: '1px solid #ffc107' }}>
                    <p style={{ fontSize: '14px', margin: 0, marginBottom: '8px', fontWeight: 600 }}>⚠️ 尺寸设置</p>
                    <p style={{ fontSize: '13px', margin: 0, marginBottom: '8px' }}>
                        foreignObject 必须明确指定宽高，否则内容不显示：
                    </p>
                    <CodeBlock code={`// ✅ 正确
<foreignObject width={300} height={200}>
  <img src={url} style={{ width: '100%' }} />
</foreignObject>

// ❌ 错误 - 没有指定宽高
<foreignObject>
  <img src={url} />
</foreignObject>`} />
                </div>

                <div style={{ background: '#fff3cd', padding: '12px', borderRadius: '4px', marginBottom: '12px', border: '1px solid #ffc107' }}>
                    <p style={{ fontSize: '14px', margin: 0, marginBottom: '8px', fontWeight: 600 }}>⚠️ 坐标系统</p>
                    <p style={{ fontSize: '13px', margin: 0, marginBottom: '8px' }}>
                        foreignObject 使用 SVG 坐标系统，可以通过 x 和 y 属性定位：
                    </p>
                    <CodeBlock code={`<foreignObject x={0} y={0} width={300} height={200}>
  {/* 内容从 (0, 0) 开始 */}
</foreignObject>`} />
                </div>

                <H3 style={{ marginTop: '16px' }}>8.4 如何选择实现方式？</H3>
                <div style={{ background: '#e3f2fd', padding: '12px', borderRadius: '4px', marginBottom: '12px', border: '1px solid #2196f3' }}>
                    <p style={{ fontSize: '14px', margin: 0, marginBottom: '8px', fontWeight: 600 }}>
                        使用 section + SVG（推荐大多数场景）：
                    </p>
                    <ul style={{ fontSize: '13px', margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
                        <li>装饰性图片、背景图</li>
                        <li>不需要点击弹出的内容图</li>
                        <li>追求最佳性能</li>
                    </ul>
                </div>
                <div style={{ background: '#e3f2fd', padding: '12px', borderRadius: '4px', border: '1px solid #2196f3' }}>
                    <p style={{ fontSize: '14px', margin: 0, marginBottom: '8px', fontWeight: 600 }}>
                        使用 foreignObject：
                    </p>
                    <ul style={{ fontSize: '13px', margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
                        <li>需要点击弹出查看大图</li>
                        <li>需要发布后动态替换图片</li>
                        <li>需要在 SVG 中嵌入复杂 HTML 内容</li>
                    </ul>
                </div>
            </div>

            {/* 9. 注意事项 */}
            <H2 style={{ padding: '0 16px', marginTop: '24px', marginBottom: '20px' }}>9. 注意事项</H2>
            <div style={{ padding: '0 16px', marginBottom: '20px' }}>
                <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
                    <ol style={{ fontSize: '14px', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
                        <li><strong>尺寸参数</strong>：虽然 w 和 h 是可选的，但建议明确提供，避免自动获取失败</li>
                        <li><strong>URL 格式</strong>：建议使用 HTTPS 协议的图片地址</li>
                        <li><strong>深色对抗</strong>：如果不需要深色对抗，使用 <code>isNaturalPriority=&#123;true&#125;</code></li>
                        <li><strong>性能考虑</strong>：大量使用 foreignObject 可能影响性能，优先使用默认模式</li>
                        <li><strong>兼容性</strong>：所有模式在微信公众号中测试通过</li>
                        <li><strong>嵌套限制</strong>：如果需要在 SVG 内嵌入 HTML 元素，必须使用 foreignObject</li>
                        <li><strong>命名空间</strong>：使用 foreignObject 时记得声明 xmlns 和 xmlnsXlink</li>
                    </ol>
                </div>
            </div>
        </SectionEx>
    );
};

const preset: DocumentExport = {
    title: "无缝图组件 SeamlessImg",
    jsx: <Article />
};

export default preset;

