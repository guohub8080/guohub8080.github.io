import React from 'react';
import { DocumentExport } from '../data/music12DocumentLoader.tsx';

/**
 * 音乐理论基础
 * 介绍音乐理论的基本概念和原理
 */
const MusicTheoryBasics: DocumentExport = {
  title: '音乐理论基础',
  jsx: (
    <div className="prose max-w-none">
      <h1>音乐理论基础</h1>
      
      <h2>什么是音乐理论？</h2>
      <p>
        音乐理论是研究音乐的基本元素、结构和组织方式的学科。它帮助我们理解音乐是如何工作的，
        以及如何创作、分析和演奏音乐。
      </p>
      
      <h2>音乐的基本元素</h2>
      
      <h3>1. 音高 (Pitch)</h3>
      <p>音高是声音的高低，由频率决定。在西方音乐中，我们使用音名系统：</p>
      <ul>
        <li>C, D, E, F, G, A, B (自然音阶)</li>
        <li>C#, D#, F#, G#, A# (升号)</li>
        <li>Db, Eb, Gb, Ab, Bb (降号)</li>
      </ul>
      
      <h3>2. 节奏 (Rhythm)</h3>
      <p>节奏是音乐中时间的组织方式，包括：</p>
      <ul>
        <li>节拍 (Beat) - 音乐的基本时间单位</li>
        <li>拍号 (Time Signature) - 如 4/4, 3/4, 2/4</li>
        <li>音符时值 - 全音符、二分音符、四分音符等</li>
      </ul>
      
      <h3>3. 和声 (Harmony)</h3>
      <p>和声是多个音同时发声产生的效果：</p>
      <ul>
        <li>和弦 (Chord) - 三个或更多音的组合</li>
        <li>和弦进行 (Chord Progression) - 和弦的序列</li>
        <li>调性 (Tonality) - 音乐的中心音和调式</li>
      </ul>
      
      <h3>4. 旋律 (Melody)</h3>
      <p>旋律是一系列音高的线性排列，是音乐的主要线条。</p>
      
      <h2>音阶系统</h2>
      
      <h3>大调音阶 (Major Scale)</h3>
      <p>大调音阶的音程关系：全-全-半-全-全-全-半</p>
      <p>例如：C大调 - C D E F G A B C</p>
      
      <h3>小调音阶 (Minor Scale)</h3>
      <p>小调音阶有三种形式：</p>
      <ul>
        <li>自然小调：全-半-全-全-半-全-全</li>
        <li>和声小调：自然小调 + 升七级音</li>
        <li>旋律小调：上行升六、七级，下行还原</li>
      </ul>
      
      <h2>和弦理论</h2>
      
      <h3>三和弦 (Triads)</h3>
      <p>由根音、三音、五音构成：</p>
      <ul>
        <li>大三和弦：根音 + 大三度 + 纯五度</li>
        <li>小三和弦：根音 + 小三度 + 纯五度</li>
        <li>减三和弦：根音 + 小三度 + 减五度</li>
        <li>增三和弦：根音 + 大三度 + 增五度</li>
      </ul>
      
      <h3>七和弦 (Seventh Chords)</h3>
      <p>在三和弦基础上添加七音：</p>
      <ul>
        <li>大七和弦：大三和弦 + 大七度</li>
        <li>小七和弦：小三和弦 + 小七度</li>
        <li>属七和弦：大三和弦 + 小七度</li>
        <li>减七和弦：减三和弦 + 减七度</li>
      </ul>
      
      <h2>调性分析</h2>
      <p>
        调性分析帮助我们理解音乐的结构和功能。通过分析和弦的功能、
        调性中心和音乐的发展方向，我们可以更好地理解和创作音乐。
      </p>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3>💡 学习建议</h3>
        <ul>
          <li>从简单的音阶和和弦开始练习</li>
          <li>多听不同风格的音乐，分析其和声结构</li>
          <li>尝试在乐器上演奏学到的理论概念</li>
          <li>结合实践，将理论应用到创作中</li>
        </ul>
      </div>
    </div>
  )
};

export default MusicTheoryBasics;
