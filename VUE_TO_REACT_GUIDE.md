# Vue 개발자를 위한 React 마이그레이션 가이드

이 문서는 Vue.js 경험이 있는 개발자가 React로 전환할 때 알아야 할 주요 차이점과 라이프사이클 관리 방법을 설명합니다.

## 1. 핵심 철학의 차이

| 특징            | Vue.js                                                                                                                             | React                                                                                                                                              |
| :-------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| **상태 관리**   | **가변(Mutable)** 상태. `this.data = check` 또는 `ref.value = check`로 직접 변경하면 반응형 시스템이 이를 감지하여 업데이트합니다. | **불변(Immutable)** 상태. 상태를 직접 변경하지 않고 `setState` 함수를 통해 새로운 값을 주입해야 리렌더링이 발생합니다.                             |
| **템플릿**      | HTML 기반의 템플릿 문법 (`v-if`, `v-for` 등) 사용. HTML, JS, CSS가 분리된 구조(.vue)를 선호합니다.                                 | **JSX** (JavaScript XML). 자바스크립트 안에서 마크업을 작성하며, 모든 것이 자바스크립트로 처리됩니다. (`v-if` 대신 `if`문이나 삼항 연산자 등 사용) |
| **데이터 흐름** | 양방향 바인딩(`v-model`)을 쉽게 지원합니다.                                                                                        | 단방향 데이터 흐름을 원칙으로 합니다. (부모 -> 자식).                                                                                              |

---

## 2. 라이프사이클(Lifecycle) 비교 및 대응

Vue의 라이프사이클 훅은 React의 **Function Component**에서는 주로 `useEffect` 훅으로 대체됩니다.

### 2.1 마운트(Mount) 시점

컴포넌트가 처음 화면에 나타날 때 실행되는 로직입니다.

- **Vue (Options API):** `mounted()`
- **Vue (Composition API):** `onMounted(() => { ... })`
- **React:** `useEffect(() => { ... }, [])`
  - **중요:** 의존성 배열(dependency array)을 **빈 배열 `[]`**로 설정해야 마운트 시 **딱 한 번만** 실행됩니다.

**예시 코드:**

```javascript
// Vue
onMounted(() => {
  console.log('컴포넌트가 마운트되었습니다.');
  fetchData();
});

// React
useEffect(() => {
  console.log('컴포넌트가 마운트되었습니다.');
  fetchData();
}, []); // 빈 배열 필수!
```

### 2.2 업데이트(Update) 시점

상태(State)나 props가 변경되어 컴포넌트가 리렌더링될 때 실행됩니다.

- **Vue:** `updated()`, `watch()`
- **React:** `useEffect(() => { ... }, [dependency])`

**특정 값이 바뀔 때만 실행 (Vue의 `watch`와 유사):**

```javascript
// Vue
watch(count, (newVal) => {
  console.log('count가 변경됨:', newVal);
});

// React
useEffect(() => {
  console.log('count가 변경됨:', count);
}, [count]); // count가 변경될 때만 실행
```

**모든 렌더링마다 실행 (Vue의 `updated`와 유사):**

```javascript
// React
useEffect(() => {
  console.log('매 렌더링마다 실행됩니다.');
}); // 의존성 배열 없음
```

### 2.3 언마운트(Unmount) 시점

컴포넌트가 화면에서 사라지기 직전에 정리(Cleanup) 작업을 할 때 사용합니다. (이벤트 리스너 제거, 타이머 해제 등)

- **Vue:** `beforeUnmount()`, `unmounted()`
- **React:** `useEffect`의 **return 함수 (Cleanup Function)**

**예시 코드:**

```javascript
// Vue
onUnmounted(() => {
  clearInterval(timer);
});

// React
useEffect(() => {
  const timer = setInterval(() => { ... }, 1000);

  // cleanup 함수 반환
  return () => {
    clearInterval(timer);
    console.log("컴포넌트가 언마운트(제거)됩니다.");
  };
}, []);
```

### 2.4 요약표

| Vue Hook (Options/Composition)     | React Hook / 대응 방법   | 비고                                                                             |
| :--------------------------------- | :----------------------- | :------------------------------------------------------------------------------- |
| `beforeCreate`, `created`          | 컴포넌트 함수 내부       | React 함수 컴포넌트 본문 자체가 실행되는 시점입니다.                             |
| `beforeMount`, `onBeforeMount`     | `useLayoutEffect`        | 일반적으로는 잘 사용하지 않으며, `useEffect`로 충분한 경우가 많습니다.           |
| `mounted`, `onMounted`             | `useEffect(..., [])`     | 의존성 배열 `[]` (빈 배열)                                                       |
| `beforeUpdate`, `onBeforeUpdate`   | (대응 없음)              | React는 DOM 업데이트 직전을 감지하는 게 어렵지만, `useEffect`로 대체 가능합니다. |
| `updated`, `onUpdated`             | `useEffect(..., [deps])` | 의존성 배열에 감시할 변수를 넣거나 생략합니다.                                   |
| `beforeUnmount`, `onBeforeUnmount` | `useEffect` return 함수  | Cleanup function                                                                 |
| `errorCaptured`, `onErrorCaptured` | Error Boundaries         | React는 훅이 아닌 별도의 클래스 컴포넌트(Error Boundary)로 에러를 잡습니다.      |

---

## 3. 문법 및 기능 비교

### 3.1 조건부 렌더링 (`v-if`)

**Vue:**

```html
<div v-if="isVisible">보입니다</div>
<div v-else>안 보입니다</div>
```

**React:**

```jsx
{
  isVisible ? <div>보입니다</div> : <div>안 보입니다</div>;
}
{
  /* 또는단축 평가 */
}
{
  isVisible && <div>보입니다</div>;
}
```

### 3.2 리스트 렌더링 (`v-for`)

**Vue:**

```html
<ul>
  <li v-for="item in items" :key="item.id">{{ item.name }}</li>
</ul>
```

**React:**

```jsx
<ul>
  {items.map((item) => (
    <li key={item.id}>{item.name}</li>
  ))}
</ul>
```

- React에서는 자바스크립트의 표준 배열 메서드인 `map`을 사용합니다. `key` prop은 필수입니다.

### 3.3 계산된 속성 (`computed`)

**Vue:**

```javascript
const doubleCount = computed(() => count.value * 2);
```

**React:**

```javascript
// useMemo: 값 자체를 캐싱 (메모이제이션)
const doubleCount = useMemo(() => count * 2, [count]);
// 또는 단순 변수 (렌더링 때마다 계산됨, 비용이 크지 않다면 이 방식도 흔함)
const doubleCountSimple = count * 2;
```

### 3.4 양방향 바인딩 (`v-model`)

Vue의 `v-model`은 React에서 `value` prop과 `onChange` 핸들러의 조합으로 구현합니다.

**Vue:**

```html
<input v-model="text" />
```

**React:**

```jsx
const [text, setText] = useState('');

<input value={text} onChange={(e) => setText(e.target.value)} />;
```

---

## 4. 알아두면 좋은 React 팁

1.  **State 업데이트는 비동기일 수 있습니다.**
    - `setCount(count + 1)` 직후 `console.log(count)`를 찍으면 여전히 이전 값이 나옵니다. 업데이트된 값은 다음 렌더링에서 반영됩니다.
    - 이전 상태에 의존해서 업데이트할 때는 함수형 업데이트를 사용하세요: `setCount(prev => prev + 1)`

2.  **JSX에서 class 대신 className을 사용합니다.**
    - `<div class="box">` (X)
    - `<div className="box">` (O)

3.  **Ref는 DOM 접근뿐만 아니라 '값이 변해도 렌더링되지 않는 변수'로도 쓰입니다.**
    - Vue의 `ref`는 반응형 데이터를 만들지만, React의 `useRef`는 반응성이 없습니다. 즉, `ref.current` 값을 바꿔도 화면이 다시 그려지지 않습니다.
