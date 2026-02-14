import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/contexts/LayoutContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import styles from '@/assets/scss/pages/react-guide.module.scss';

/**
 * React 상태 관리 가이드 페이지
 */
const StateManagementDemo = () => {
  const { updateConfig } = useLayout();
  const navigate = useNavigate();

  useEffect(() => {
    updateConfig({
      title: '상태 관리 (useState)',
      showBackButton: true,
      rightButtons: (
        <Button size="sm" onClick={() => navigate('/')}>
          홈
        </Button>
      ),
    });
  }, [updateConfig, navigate]);

  // 1. 기본형 데이터
  const [count, setCount] = useState(0);

  // 2. 객체형 데이터
  const [user, setUser] = useState({
    name: '김철수',
    age: 20,
    hobbies: ['코딩', '독서'],
  });

  // 3. 배열형 데이터
  const [newItem, setNewItem] = useState('');

  const handleIncrement = () => {
    setCount((prev) => prev + 1);
  };

  const handleUpdateUser = () => {
    setUser((prevUser) => ({
      ...prevUser,
      age: prevUser.age + 1,
    }));
  };

  const handleAddHobby = () => {
    if (!newItem) return;
    setUser((prevUser) => ({
      ...prevUser,
      hobbies: [...prevUser.hobbies, newItem],
    }));
    setNewItem('');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>React 상태 관리 (useState) 데모</h1>

      <div className={styles.demoSection}>
        <h2>1. 기본형 상태 (Primitive State)</h2>
        <p>count: {count}</p>
        <Button onClick={handleIncrement}>카운트 증가</Button>
      </div>

      <div className={styles.demoSection}>
        <h2>2. 객체 상태 (Complex Object State)</h2>
        <div className={styles.fruitItem}>
          <span>이름: {user.name}</span>
          <span>나이: {user.age}</span>
        </div>
        <div style={{ marginTop: '15px' }}>
          <Button
            onClick={handleUpdateUser}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
            }}
          >
            나이 증가 (불변성 유지)
          </Button>
          <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
            React에서는 객체의 속성 하나만 바꾸더라도 전체 객체를 새로 만들어야
            리렌더링이 일어납니다.
            <br />
            <span className={styles.codeBlock}>
              setUser(prev {'=>'} (&#123; ...prev, age: prev.age + 1 &#125;))
            </span>
          </p>
        </div>
      </div>

      <div className={styles.demoSection}>
        <h2>3. 배열 상태 (Array State)</h2>
        <ul className={styles.logArea} style={{ maxHeight: '200px' }}>
          {user.hobbies.map((hobby, index) => (
            <li key={index}>{hobby}</li>
          ))}
        </ul>
        <div className={styles.flexRow}>
          <Input
            value={newItem}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewItem(e.target.value)
            }
            placeholder="취미 추가..."
            style={{ flex: 1 }}
          />
          <Button onClick={handleAddHobby}>추가하기</Button>
        </div>
        <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
          배열에 항목을 추가할 때도{' '}
          <span className={styles.codeBlock}>push()</span> 대신 전개
          연산자(Spread Operator)를 사용합니다.
          <br />
          <span className={styles.codeBlock}>[...prevArray, newItem]</span>
        </p>
      </div>
    </div>
  );
};

export default StateManagementDemo;
