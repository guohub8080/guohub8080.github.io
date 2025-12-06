/** @jsxImportSource react */
import React from 'react';
import EditorPanel from './components/EditorPanel.tsx';
import InfoPanel from './components/InfoPanel.tsx';
import useTonicMLEditorStore from './stores/useTonicMLEditorStore.ts';

export default function TonicMLEditor() {
  const { containerPaddingTop, containerPaddingBottom, containerPaddingLeft, containerPaddingRight } = useTonicMLEditorStore();
  const padding = `${containerPaddingTop}px ${containerPaddingRight}px ${containerPaddingBottom}px ${containerPaddingLeft}px`;
  
  return (
    <div className="w-full h-full flex flex-col">
      {/* 主容器 - 响应式布局 */}
      <div className="flex-1 flex w-full overflow-auto" style={{ padding }}>
        {/* 宽屏状态: 左右布局 | 窄屏状态: 待定 */}
        <div className="flex flex-col lg:flex-row w-full h-fit gap-4 lg:gap-6 lg:justify-center lg:items-start">
          {/* 左侧: 编辑器区域 */}
          <EditorPanel />

          {/* 右侧: 信息窗区域 (宽屏时显示) */}
          <InfoPanel />
        </div>
      </div>
    </div>
  );
}
