import {
  useState,
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import styles from '@/assets/scss/pages/react-guide.module.scss';
import GuideTabs from './components/GuideTabs';

// 자식 컴포넌트 (Emit & Expose 예제용)
// React에서는 ref를 전달받으려면 forwardRef로 감싸야 합니다.
// Vue의 defineProps + defineExpose + defineEmits를 합친 개념입니다.
interface ChildProps {
  onCustomEvent: (msg: string) => void;
}

export interface ChildHandle {
  reset: () => void;
  increment: () => void;
}

const ChildComponent = forwardRef<ChildHandle, ChildProps>((props, ref) => {
  const [childCount, setChildCount] = useState(0);

  // 부모에게 노출할 메서드 정의 (Vue의 defineExpose)
  useImperativeHandle(ref, () => ({
    reset: () => {
      setChildCount(0);
      alert('부모가 자식의 reset 메서드를 호출했습니다!');
    },
    increment: () => {
      setChildCount((c) => c + 1);
    },
  }));

  // Vue의 emit('custom-event', 'hello') -> React는 props.onCustomEvent('hello') 호출
  const sendToParent = () => {
    props.onCustomEvent(`자식의 현재 카운트: ${childCount}`);
  };

  return (
    <div
      style={{
        border: '1px dashed var(--form-border-color)',
        padding: '15px',
        borderRadius: '8px',
        marginTop: '10px',
      }}
    >
      <h4 style={{ margin: '0 0 10px 0', color: 'var(--body-text-color)' }}>
        👶 자식 컴포넌트
      </h4>
      <p style={{ marginBottom: '10px', color: 'var(--body-text-color)' }}>
        자식 내부 카운트: <strong>{childCount}</strong>
      </p>
      <button className={`${styles.button} success`} onClick={sendToParent}>
        부모에게 메시지 보내기 (Emit)
      </button>
    </div>
  );
});

// 부모 컴포넌트
const AdvancedDemo = () => {
  const [firstName, setFirstName] = useState('길동');
  const [lastName, setLastName] = useState('홍');

  // 1. Computed (Vue) -> useMemo (React)
  // Vue: computed(() => lastName.value + ' ' + firstName.value)
  // React: 의존성 배열([lastName, firstName])이 변할 때만 다시 계산
  const fullName = useMemo(() => {
    // console.log('fullName 계산됨!');
    return `${lastName} ${firstName}`;
  }, [lastName, firstName]); // 이 값들이 바뀔 때만 재계산

  // 자식 컴포넌트의 메서드를 제어하기 위한 ref
  const childRef = useRef<ChildHandle>(null);

  const handleParentClick = () => {
    alert('부모 컴포넌트의 버튼이 클릭되었습니다. (@click -> onClick)');
  };

  const handleChildEvent = (message: string) => {
    alert(`자식으로부터 받은 메시지: ${message}`);
  };

  const callChildReset = () => {
    // 자식의 reset 메서드 호출 (Vue의 template ref + expose)
    childRef.current?.reset();
  };

  return (
    <div className={styles.container}>
      <GuideTabs />
      <h1 className={styles.title}>심화 가이드 (Computed, Events, Refs)</h1>

      {/* 1. Computed */}
      <div className={styles.demoSection}>
        <h2>
          1. Computed 속성 (<span className={styles.codeBlock}>useMemo</span>)
        </h2>
        <p style={{ marginBottom: '15px' }}>
          Vue의 <span className={styles.codeBlock}>computed</span>는 React에서{' '}
          <span className={styles.codeBlock}>useMemo</span> 훅으로 구현합니다.
        </p>
        <div className={styles.flexWrap} style={{ alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label style={{ color: 'var(--body-text-color)' }}>성:</label>
            <input
              className={styles.input}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label style={{ color: 'var(--body-text-color)' }}>이름:</label>
            <input
              className={styles.input}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
        </div>
        <p
          style={{
            marginTop: '15px',
            fontSize: '1.2rem',
            color: 'var(--body-text-color)',
          }}
        >
          풀네임 (Computed):{' '}
          <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
            {fullName}
          </span>
        </p>
      </div>

      {/* 2. Events */}
      <div className={styles.demoSection}>
        <h2>
          2. 이벤트 핸들링 (<span className={styles.codeBlock}>@click</span>)
        </h2>
        <p>
          Vue의 <span className={styles.codeBlock}>@click</span>,{' '}
          <span className={styles.codeBlock}>@submit.prevent</span> 등은
          React에서 <span className={styles.codeBlock}>onClick</span>,{' '}
          <span className={styles.codeBlock}>e.preventDefault()</span> 처럼
          camelCase와 자바스크립트 표준 메서드로 처리합니다.
        </p>
        <div style={{ marginTop: '10px' }}>
          <button className={styles.button} onClick={handleParentClick}>
            클릭해보세요 (@click -&gt; onClick)
          </button>
        </div>

        <h3
          style={{
            marginTop: '20px',
            fontSize: '1.1rem',
            color: 'var(--body-text-color)',
          }}
        >
          이벤트 수식어 (Modifiers)
        </h3>
        <p style={{ fontSize: '0.9rem' }}>
          React에는 <span className={styles.codeBlock}>@click.stop</span> 같은
          수식어가 없습니다. 핸들러 함수 내부에서 직접 호출해야 합니다.
        </p>
        <ul
          className={styles.logArea}
          style={{ height: 'auto', padding: '10px 20px' }}
        >
          <li>
            <code>.stop</code> &rarr; <code>e.stopPropagation()</code>
          </li>
          <li>
            <code>.prevent</code> &rarr; <code>e.preventDefault()</code>
          </li>
        </ul>
      </div>

      {/* 3. Emit & Expose */}
      <div className={styles.demoSection}>
        <h2>3. Emit & Expose (부모-자식 통신)</h2>
        <p>
          <strong>Emit:</strong> Vue의{' '}
          <span className={styles.codeBlock}>$emit</span> 대신 Props로{' '}
          <strong>함수</strong>를 전달받아 호출합니다.
          <br />
          <strong>Expose:</strong> Vue의{' '}
          <span className={styles.codeBlock}>defineExpose</span> 대신{' '}
          <span className={styles.codeBlock}>useImperativeHandle</span>과{' '}
          <span className={styles.codeBlock}>forwardRef</span>를 사용합니다.
        </p>

        <div
          style={{
            marginTop: '15px',
            padding: '15px',
            background: 'var(--form-bg-color)',
            border: '1px solid var(--primary-color)',
            borderRadius: '8px',
          }}
        >
          <h4 style={{ marginTop: 0, color: 'var(--body-text-color)' }}>
            👨 부모 컴포넌트
          </h4>
          <div className={styles.flexWrap}>
            <button className={styles.button} onClick={callChildReset}>
              자식의 reset() 호출하기
            </button>
            <button
              className={`${styles.button} secondary`}
              onClick={() => childRef.current?.increment()}
            >
              자식의 increment() 호출하기
            </button>
          </div>

          {/* 자식 컴포넌트 렌더링 */}
          <ChildComponent
            ref={childRef}
            onCustomEvent={handleChildEvent} // @custom-event="handleChildEvent"
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedDemo;
