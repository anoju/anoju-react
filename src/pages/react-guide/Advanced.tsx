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
import cx from '@/utils/cx';
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

  // 4. 스타일 & 클래스 예제용
  const [isActive, setIsActive] = useState(false);

  // Vue의 computed(() => ({ active: isActive.value }))
  const computedClass = useMemo(() => {
    // cx 유틸리티 사용 (classnames와 유사)
    // 조건부로 클래스를 적용할 때 매우 유용합니다.
    return cx(styles.fruitBox, {
      [styles.active]: isActive, // styles.active가 정의되어 있다면 적용됨
    });
  }, [isActive]);

  // Vue의 computed(() => ({ ...styles }))
  const computedStyle = useMemo(() => {
    return {
      transition: 'all 0.3s ease',
      border: isActive
        ? '2px solid var(--primary-color)'
        : '1px solid var(--form-border-color)',
      backgroundColor: isActive
        ? 'rgba(var(--primary-rgb), 0.1)'
        : 'var(--form-bg-color)',
      transform: isActive ? 'scale(1.02)' : 'scale(1)',
      padding: '20px',
      borderRadius: '8px',
    };
  }, [isActive]);

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

      {/* 4. Style & Class */}
      <div className={styles.demoSection}>
        <h2>4. 스타일 & 클래스 (Conditional & Computed)</h2>
        <p>
          Vue의 <span className={styles.codeBlock}>:class</span>,{' '}
          <span className={styles.codeBlock}>:style</span>을 React에서는{' '}
          <span className={styles.codeBlock}>cx</span> 유틸리티나{' '}
          <span className={styles.codeBlock}>style</span> 객체로 처리합니다.
        </p>

        <div style={{ margin: '15px 0' }}>
          <Button onClick={() => setIsActive(!isActive)}>
            스타일 토글 (isActive: {isActive.toString()})
          </Button>
        </div>

        <div className={computedClass} style={computedStyle}>
          <p style={{ margin: 0, textAlign: 'center', fontWeight: 'bold' }}>
            이 박스는 useMemo로 계산된 스타일과 클래스를 가집니다.
          </p>
          <p
            style={{
              margin: '5px 0 0 0',
              fontSize: '0.9em',
              textAlign: 'center',
              opacity: 0.8,
            }}
          >
            (active 상태일 때 크기, 색상, 테두리가 변합니다)
          </p>
        </div>

        <div className={styles.tipBox} style={{ marginTop: '20px' }}>
          <h3>코드 비교</h3>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>구분</th>
                  <th>Vue (Computed)</th>
                  <th>React (useMemo)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Class</strong>
                  </td>
                  <td>
                    <code>:class="userInfo"</code>
                  </td>
                  <td>
                    <code>
                      className=&#123;cx(styles.box, &#123; [styles.active]:
                      isActive &#125;)&#125;
                    </code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Style</strong>
                  </td>
                  <td>
                    <code>:style="boxStyle"</code>
                  </td>
                  <td>
                    <code>style=&#123;boxStyle&#125;</code> (객체를 반환)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedDemo;
