import { useEffect, useState, useRef } from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import styles from '@/assets/scss/pages/react-guide.module.scss';
import { CodeHighlight } from '@/components/common';

const ReactTypes = () => {
  const { updateConfig } = useLayout();

  // Test states for demo purposes without unused vars errors
  const [count, setCount] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    updateConfig({
      title: 'React 실무 (ReactTypes)',
      showBackButton: true,
    });
  }, [updateConfig]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>⚛️ React 실무 타입 가이드</h1>
        <p className={styles.description}>
          React 컴포넌트, Props, Hooks, Events 작성 시 권장되는 모범적인
          타입스크립트 패턴입니다.
        </p>
      </header>

      <section className={styles.demoSection}>
        <h2>1. 컴포넌트 Props와 Children 타이핑</h2>
        <p>
          전통적인 <code>React.FC</code> 방식 대신 최신 권장 패턴을 따릅니다.
        </p>
        <CodeHighlight
          language="tsx"
          code={`import React, { ReactNode } from "react";

// ✅ 1. Props 명시적 선언 
// interface 사용 권장. 
interface ButtonProps {
  label: string;         // 필수
  onClick: () => void;   // 함수
  disabled?: boolean;    // 선택적(Optional)
  variant: "primary" | "secondary"; // 리터럴 타입 지정
  children?: ReactNode;  // React 내부 노드(엘리먼트, 문자열 등 모든 자식 포함)
}

// ✅ 2. React.FC 생략 및 일반 함수 형태 권장
// - 제네릭 지원 불가와 기본 children 암묵적 설정 이슈로 인해 React.FC 대신 명시적 타입을 사용합니다.
export default function Button({
  label,
  onClick,
  disabled = false,
  variant,
  children
}: ButtonProps) {
  return (
    <button
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
      {children}
    </button>
  );
}`}
        />
      </section>

      <section className={styles.demoSection}>
        <h2>2. React Hooks 타이핑</h2>
        <p>
          상태 관리에서 암묵적 추론(Inference)과 명시적 제네릭(Generics) 사용.
        </p>
        <CodeHighlight
          language="tsx"
          code={`import { useState, useRef, useReducer } from "react";

function HooksDemo() {
  // 1. useState: 초기값으로 타입 추론(Inference)을 권장
  const [count, setCount] = useState(0); // number 추론됨
  // setCount("Error"); // ❌ 에러

  // 하지만 null 일 수도 있는 복잡한 객체/배열은 제네릭(<T>)을 명시합니다.
  const [user, setUser] = useState<{ id: string } | null>(null);

  // 2. useRef: DOM 요소 참조 (초기값 null 필수 지정)
  const inputRef = useRef<HTMLInputElement>(null); 
  const readonlyTimerId = useRef<number>(0); // Mutable 값일 땐 DOM 타입 미지정

  // 3. useReducer: 상태와 액션의 유니온 타입 지정
  type State = { counter: number };
  type Action = { type: "increment" } | { type: "decrement", payload: number };
  
  // reducer(state: State, action: Action) 추론됨
  // const [state, dispatch] = useReducer(reducer, { counter: 0 });
}`}
        />
        <div style={{ marginTop: '10px' }}>
          <button
            className={`${styles.button} ${styles.primary}`}
            onClick={() => setCount((c) => c + 1)}
          >
            Demo Count: {count}
          </button>
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="useRef test input"
            style={{ marginLeft: '10px' }}
          />
        </div>
      </section>

      <section className={styles.demoSection}>
        <h2>3. DOM Event 핸들링 타이핑</h2>
        <p>
          이벤트 객체의 정확한 타이핑(\`React.ChangeEvent\`,
          \`React.MouseEvent\` 등).
        </p>
        <CodeHighlight
          language="tsx"
          code={`// ✅ 1. Input Change 이벤트
// 제네릭으로 어떤 요소에서 발생한 이벤트인지 명시합니다.
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value; // value는 무조건 string 추론됨
};

// ✅ 2. Form Submit 이벤트
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // Form 데이터 처리 로직 수행
};

// ✅ 3. Mouse Click 이벤트 (Button)
const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log("X 코디네이트(위치):", e.clientX); // event 고유 속성 접근 안정성
};

// [주의사항]
// onChange={(e) => handleChange(e)} 와 같이 
// 인라인(Inline)으로 작성하면 타입스크립트가 e의 타입을 자동 추론합니다.
// 하지만 외부 함수로 분리할 때는 반드시 매개변수 타입을 (위처럼) 정의해야 에러가 나지 않습니다.`}
        />
      </section>

      <section className={styles.demoSection}>
        <h2>4. 기본 HTML 요소 Attributes 확장하기</h2>
        <p>
          사용자 정의 컴포넌트가 기본 HTML의 속성들을 그대로 상속받기 위한
          방법입니다.
        </p>
        <CodeHighlight
          language="tsx"
          code={`import React, { ComponentPropsWithoutRef } from 'react';

// ✅ ComponentPropsWithoutRef 를 사용하여 안전하게 확장
// <input> 태그가 가지는 기존의 모든 속성(type, value, onChange 등)을 상속받습니다.
interface CustomInputProps extends ComponentPropsWithoutRef<'input'> {
  label: string; // 우리 컴포넌트만의 추가 속성
}

// rest 파라미터(...props)로 기존 속성들을 input 요소에 넘김
export const CustomInput = ({ label, ...props }: CustomInputProps) => {
  return (
    <div className="input-field">
      <label>{label}</label>
      <input {...props} /> 
    </div>
  );
};

// 사용 예시
// onChange, value 등 React Input 관련 타입이 자동으로 완벽히 추론됩니다!
// <CustomInput label="Username" onChange={e => handle(e)} required disabled />`}
        />
      </section>
    </div>
  );
};

export default ReactTypes;
