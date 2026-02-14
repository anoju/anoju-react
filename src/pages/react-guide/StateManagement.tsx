import { useState } from 'react';
import styles from '@/assets/scss/pages/react-guide.module.scss';
import GuideTabs from './components/GuideTabs';
/**
 * React 상태 관리 가이드 페이지
 *
 * Vue의 reactivity system(ref, reactive)과 React의 state(useState) 차이를 보여줍니다.
 *
 * 핵심 차이점:
 * - Vue: 가변(Mutable). `this.data = check`처럼 직접 변경하면 반응함.
 * - React: 불변(Immutable). `setState({ ...data, check })`처럼 새 객체를 할당해야 반응함.
 */
const StateManagementDemo = () => {
  // 1. 기본형 데이터 (Vue: ref(0))
  const [count, setCount] = useState(0);

  // 2. 객체형 데이터 (Vue: reactive({ name: '', age: 0 }))
  const [user, setUser] = useState({
    name: '김철수',
    age: 20,
    hobbies: ['코딩', '독서'],
  });

  // 3. 배열형 데이터 (Vue: reactive(['Apple', 'Banana']))
  const [newItem, setNewItem] = useState('');

  const handleIncrement = () => {
    // 간단한 상태 업데이트
    setCount((prev) => prev + 1);
  };

  const handleUpdateUser = () => {
    // 객체 업데이트 시 주의사항: 기존 객체를 복사(...)하고 변경할 부분만 오버라이드합니다.
    // Vue: user.age += 1 (직관적)
    // React: setUser({ ...user, age: user.age + 1 }) (불변성 유지)
    setUser((prevUser) => ({
      ...prevUser,
      age: prevUser.age + 1,
    }));
  };

  const handleAddHobby = () => {
    if (!newItem) return;

    // 배열 업데이트 시 주의사항: push()를 쓰지 않고 새 배열을 만듭니다.
    // Vue: user.hobbies.push(newItem)
    // React: setUser({ ...user, hobbies: [...user.hobbies, newItem] })
    setUser((prevUser) => ({
      ...prevUser,
      hobbies: [...prevUser.hobbies, newItem],
    }));
    setNewItem('');
  };

  return (
    <div className={styles.container}>
      <GuideTabs />
      <h1 className={styles.title}>React 상태 관리 (useState) 데모</h1>

      <div className={styles.demoSection}>
        <h2>1. 기본형 상태 (Primitive State)</h2>
        <p>count: {count}</p>
        <button onClick={handleIncrement} className={styles.button}>
          카운트 증가
        </button>
      </div>

      <div className={styles.demoSection}>
        <h2>2. 객체 상태 (Complex Object State)</h2>
        <div className={styles.fruitItem}>
          <span>이름: {user.name}</span>
          <span>나이: {user.age}</span>
        </div>
        <div style={{ marginTop: '15px' }}>
          <button
            onClick={handleUpdateUser}
            className={`${styles.button} success`}
          >
            나이 증가 (불변성 유지)
          </button>
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
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="취미 추가..."
            className={styles.input}
            style={{ flex: 1 }}
          />
          <button onClick={handleAddHobby} className={`${styles.button}`}>
            추가하기
          </button>
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
