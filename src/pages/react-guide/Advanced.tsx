import {
  useState,
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
  ChangeEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/contexts/LayoutContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import styles from '@/assets/scss/pages/react-guide.module.scss';

// 자식 컴포넌트 (Emit & Expose 예제용)
interface ChildProps {
  onCustomEvent: (msg: string) => void;
}

export interface ChildHandle {
  reset: () => void;
  increment: () => void;
}

const ChildComponent = forwardRef<ChildHandle, ChildProps>((props, ref) => {
  const [childCount, setChildCount] = useState(0);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setChildCount(0);
      alert('부모가 자식의 reset 메서드를 호출했습니다!');
    },
    increment: () => {
      setChildCount((c) => c + 1);
    },
  }));

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
      <Button
        onClick={sendToParent}
        style={{ backgroundColor: '#28a745', color: 'white', border: 'none' }}
      >
        부모에게 메시지 보내기 (Emit)
      </Button>
    </div>
  );
});

// 부모 컴포넌트
const AdvancedDemo = () => {
  const { updateConfig } = useLayout();
  const navigate = useNavigate();

  useEffect(() => {
    updateConfig({
      title: '심화 가이드 (Computed, Events)',
      showBackButton: true,
      rightButtons: (
        <Button size="sm" onClick={() => navigate('/')}>
          홈
        </Button>
      ),
    });
  }, [updateConfig, navigate]);

  const [firstName, setFirstName] = useState('길동');
  const [lastName, setLastName] = useState('홍');

  const fullName = useMemo(() => {
    return `${lastName} ${firstName}`;
  }, [lastName, firstName]);

  const childRef = useRef<ChildHandle>(null);

  const handleParentClick = () => {
    alert('부모 컴포넌트의 버튼이 클릭되었습니다. (@click -> onClick)');
  };

  const handleChildEvent = (message: string) => {
    alert(`자식으로부터 받은 메시지: ${message}`);
  };

  return (
    <div className={styles.container}>
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
          <Input
            beforeEl={
              <span
                style={{ padding: '0 10px', color: 'var(--body-text-color)' }}
              >
                성:
              </span>
            }
            value={lastName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setLastName(e.target.value)
            }
            placeholder="성"
            style={{ width: '150px' }}
          />
          <Input
            beforeEl={
              <span
                style={{ padding: '0 10px', color: 'var(--body-text-color)' }}
              >
                이름:
              </span>
            }
            value={firstName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFirstName(e.target.value)
            }
            placeholder="이름"
            style={{ width: '150px' }}
          />
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
        <div style={{ marginTop: '10px' }}>
          <Button onClick={handleParentClick}>
            클릭해보세요 (@click -&gt; onClick)
          </Button>
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
            <Button onClick={() => childRef.current?.reset()}>
              자식의 reset() 호출하기
            </Button>
            <Button
              onClick={() => childRef.current?.increment()}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
              }}
            >
              자식의 increment() 호출하기
            </Button>
          </div>

          <ChildComponent ref={childRef} onCustomEvent={handleChildEvent} />
        </div>
      </div>
    </div>
  );
};

export default AdvancedDemo;
