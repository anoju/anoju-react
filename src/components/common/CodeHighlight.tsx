// src/components/common/CodeHighlight.tsx
import { useState, forwardRef } from 'react';
import styles from '@/assets/scss/components/codeHighlight.module.scss';

interface CodeHighlightProps {
  code: string;
  language?: string;
}

// 클립보드 아이콘 직접 구현
const ClipboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CodeHighlight = forwardRef<HTMLDivElement, CodeHighlightProps>(
  ({ code, language = 'jsx' }, ref) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);

      // 2초 후에 복사 상태 초기화
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    };

    return (
      <div className={styles.container} ref={ref}>
        <div className={styles.header}>
          <span className={styles.badge}>{language}</span>
          <button
            className={[styles.button, copied ? styles.buttonCopied : ''].join(
              ' '
            )}
            onClick={handleCopy}
            aria-label="코드 복사"
          >
            <ClipboardIcon />
            <span>{copied ? '복사됨!' : '복사'}</span>
          </button>
        </div>
        <pre className={styles.pre}>
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    );
  }
);

CodeHighlight.displayName = 'CodeHighlight';

export default CodeHighlight;
