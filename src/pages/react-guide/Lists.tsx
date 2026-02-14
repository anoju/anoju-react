import { useState } from 'react';
import styles from '@/assets/scss/pages/react-guide.module.scss';
/**
 * React 리스트와 조건부 렌더링 가이드 페이지
 * 
 * Vue의 템플릿 문법(v-for, v-if)이 JSX에서 어떻게 자바스크립트로 표현되는지 보여줍니다.
 * 
 * 대응표:
 * - v-for -> items.map(item => <Item />)
 * - v-if -> condition && <Component /> 또는 condition ? <A /> : <B />
 * - key -> map() 내부 최상위 요소에 필수 (유니크한 값)
 */
const ListsDemo = () => {
  const [items, setItems] = useState([
    { id: 1, name: '사과', isVisible: true },
    { id: 2, name: '바나나', isVisible: false },
    { id: 3, name: '체리', isVisible: true },
  ]);

  const toggleVisibility = (id: number) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, isVisible: !item.isVisible } : item
      )
    );
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: `새 과일 #${items.length + 1}`,
      isVisible: true
    };
    setItems([...items, newItem]);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>React 리스트 & 조건부 렌더링 데모</h1>

      <div className={styles.demoSection}>
        <h2>1. 리스트 렌더링 (v-for 대신 map 사용)</h2>
        <p>Vue: <span className={styles.codeBlock}>v-for="item in items" :key="item.id"</span></p>
        <p>React: <span className={styles.codeBlock}>items.map(item =&gt; &lt;li key=&#123;item.id&#125;&gt;...)</span></p>
        
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((item) => (
            // 중요: map 내부 최상위 요소에는 반드시 고유한 key prop이 필요합니다.
            <li 
              key={item.id} 
              className={styles.fruitItem}
            >
              <span>{item.name} (ID: {item.id})</span>
              
              <button 
                onClick={() => toggleVisibility(item.id)}
                className={`${styles.button} ${item.isVisible ? 'danger' : 'success'}`}
                style={{ fontSize: '0.8rem', padding: '5px 10px' }}
              >
                {item.isVisible ? '숨기기' : '보이기'}
              </button>
            </li>
          ))}
        </ul>
        
        <button 
          onClick={addItem}
          className={styles.button}
          style={{ width: '100%', marginTop: '10px' }}
        >
          아이템 추가하기
        </button>
      </div>

      <div className={styles.demoSection}>
        <h2>2. 조건부 렌더링 (v-if 대신 && 연산자)</h2>
        <p>Vue: <span className={styles.codeBlock}>v-if="isVisible"</span></p>
        <p>React: <span className={styles.codeBlock}>isVisible && &lt;Component /&gt;</span></p>
        
        <div className={styles.flexWrap}>
          {items.map((item) => (
            // 조건부 렌더링 예시
            item.isVisible && (
              <div 
                key={item.id} 
                className={styles.fruitBox}
              >
                {item.name}
              </div>
            )
          ))}
        </div>
        {items.every(item => !item.isVisible) && (
          <p className={styles.emptyState}>모든 아이템이 숨겨져 있습니다.</p>
        )}
      </div>

      <div className={styles.demoSection}>
        <h2>3. 삼항 연산자 (v-if / v-else)</h2>
        <p>Vue: <span className={styles.codeBlock}>v-else</span></p>
        <p>React: <span className={styles.codeBlock}>condition ? &lt;A /&gt; : &lt;B /&gt;</span></p>
        
        <div style={{ marginTop: '10px', padding: '15px', background: 'var(--form-disabled-bg)', borderRadius: '8px', color: 'var(--body-text-color)' }}>
          {items.length > 0 ? (
            <span>현재 {items.length}개의 아이템이 있습니다.</span>
          ) : (
            <span>아이템이 하나도 없습니다.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListsDemo;
