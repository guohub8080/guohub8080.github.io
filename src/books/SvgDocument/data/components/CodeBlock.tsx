import React, { ReactNode } from 'react';
import { Highlight, themes } from 'prism-react-renderer';

interface PresetCodeBlockProps {
  code?: string;
  children?: ReactNode;
  language?: string;
  fontSize?: string;
  lineHeight?: string;
  style?: React.CSSProperties;
}

const PresetCodeBlock: React.FC<PresetCodeBlockProps> = ({
  code,
  children,
  language = 'tsx',
  fontSize = '13px',
  lineHeight = '1.4',
  style,
}) => {
  // 支持两种方式：code prop 或 children
  const codeContent = (code || (typeof children === 'string' ? children : ''))?.trim() || '';
  
  return (
    <div style={{
      backgroundColor: '#2b2b2b',
      borderRadius: '8px',
      padding: '12px 10px',
      marginTop: '8px',
      overflow: 'auto',
      ...style,
    }}>
      <Highlight theme={themes.vsDark} code={codeContent} language={language as any}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre style={{
            ...style,
            margin: 0,
            paddingLeft: 10,
            paddingRight: 10,
            background: 'transparent',
            fontSize,
            lineHeight,
          }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export default PresetCodeBlock;

