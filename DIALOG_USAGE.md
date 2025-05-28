# Dialog 함수 사용법

이 프로젝트에서는 기존의 Popup 컴포넌트를 활용하여 `$alert`와 `$confirm` 함수를 제공합니다. 

## 설치 및 설정

### 1. 전역 함수 등록

`src/main.tsx`에서 전역 dialog 함수를 import하여 등록합니다:

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/assets/scss/app.scss';
import '@/utils/globalDialog'; // 전역 dialog 함수 등록
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### 2. TypeScript 전역 타입 확장

전역 함수 사용을 위해 TypeScript 타입을 확장합니다:

```typescript
// src/utils/globalDialog.ts에 이미 포함됨
declare global {
  interface Window {
    $alert: typeof $alert;
    $confirm: typeof $confirm;
  }
}
```

## 사용법

### $alert 함수

간단한 알림 팝업을 표시하는 함수입니다.

```typescript
import { $alert } from '@/utils/dialog';

// 기본 사용법
$alert('기본 알림 메시지입니다.');

// 커스텀 옵션
$alert('커스텀 제목 알림입니다.', {
  title: '커스텀 제목',
  okText: '확인했습니다',
  width: 400,
  onOk: () => console.log('알럿 확인됨')
});

// JSX 내용 사용
$alert(
  <div>
    <p>JSX 내용을 포함한 알럿입니다.</p>
    <p style={{ color: 'red' }}>중요한 정보를 강조할 수 있습니다.</p>
  </div>,
  { title: 'JSX 내용 알럿' }
);

// Promise 방식으로 사용
$alert('작업이 완료되었습니다.').then(() => {
  console.log('알럿이 닫혔습니다.');
});
```

### $confirm 함수

확인/취소 팝업을 표시하는 함수입니다.

```typescript
import { $confirm, $alert } from '@/utils/dialog';

// 기본 사용법
const handleDelete = async () => {
  const result = await $confirm('정말로 삭제하시겠습니까?');
  if (result) {
    // 삭제 로직 실행
    $alert('삭제되었습니다.');
  }
};

// 커스텀 옵션
$confirm('이 작업을 계속하시겠습니까?', {
  title: '작업 확인',
  okText: '계속하기',
  cancelText: '중단하기',
  width: 400,
  onOk: async () => {
    // 비동기 작업 처리
    await performAsyncTask();
  },
  onCancel: () => {
    console.log('작업이 취소되었습니다.');
  }
}).then(result => {
  console.log('컨펌 결과:', result); // true 또는 false
});

// JSX 내용 사용
$confirm(
  <div>
    <p>다음 항목들이 삭제됩니다:</p>
    <ul>
      <li>문서 1</li>
      <li>문서 2</li>
    </ul>
    <p style={{ color: 'red' }}>이 작업은 되돌릴 수 없습니다.</p>
  </div>,
  { title: '삭제 확인', okText: '삭제', cancelText: '취소' }
);
```

### 전역 함수 사용

main.tsx에서 globalDialog를 import했다면, 어디서든 전역 함수를 사용할 수 있습니다:

```typescript
// 어디서든 사용 가능
window.$alert('전역 알럿입니다!');

// TypeScript 타입 안전성을 위한 체크
if (typeof window !== 'undefined' && window.$alert) {
  window.$alert('타입 안전한 전역 알럿');
}

// 비동기 처리
const handleGlobalConfirm = async () => {
  if (window.$confirm) {
    const result = await window.$confirm('전역 컨펌입니다.');
    console.log('결과:', result);
  }
};
```

## API 레퍼런스

### $alert(content, options?)

**매개변수:**
- `content: React.ReactNode` - 알림 내용 (문자열 또는 JSX)
- `options?: AlertOptions` - 선택적 설정

**AlertOptions:**
- `title?: string` - 팝업 제목 (기본값: '알림')
- `okText?: string` - 확인 버튼 텍스트 (기본값: '확인')
- `width?: string | number` - 팝업 너비 (기본값: 400)
- `className?: string` - 추가 CSS 클래스
- `onOk?: () => void` - 확인 버튼 클릭 시 콜백
- `keyboard?: boolean` - ESC 키로 닫기 가능 여부 (기본값: true)
- `maskClosable?: boolean` - 외부 클릭으로 닫기 가능 여부 (기본값: false)

**반환값:** `Promise<void>` - 팝업이 닫히면 resolve

### $confirm(content, options?)

**매개변수:**
- `content: React.ReactNode` - 확인 내용 (문자열 또는 JSX)
- `options?: ConfirmOptions` - 선택적 설정

**ConfirmOptions:**
- `title?: string` - 팝업 제목 (기본값: '확인')
- `okText?: string` - 확인 버튼 텍스트 (기본값: '확인')
- `cancelText?: string` - 취소 버튼 텍스트 (기본값: '취소')
- `width?: string | number` - 팝업 너비 (기본값: 400)
- `className?: string` - 추가 CSS 클래스
- `onOk?: () => void | Promise<void>` - 확인 버튼 클릭 시 콜백 (비동기 지원)
- `onCancel?: () => void` - 취소 버튼 클릭 시 콜백
- `keyboard?: boolean` - ESC 키로 닫기 가능 여부 (기본값: true)
- `maskClosable?: boolean` - 외부 클릭으로 닫기 가능 여부 (기본값: false)

**반환값:** `Promise<boolean>` - 확인 시 true, 취소 시 false

## 특징

### 1. 기존 Popup 컴포넌트 활용
- 프로젝트에 이미 구현된 Popup 컴포넌트를 재사용
- 일관된 디자인과 동작 보장
- alert 클래스가 자동으로 추가되어 모달 팝업으로 표시

### 2. 프로그래밍 방식 사용
- 컴포넌트 상태 관리 없이 함수 호출만으로 팝업 표시
- Promise 기반 비동기 처리 지원
- 간단하고 직관적인 API

### 3. 완전한 정리
- 팝업이 닫히면 DOM에서 완전히 제거
- 메모리 누수 방지
- 이벤트 리스너 자동 정리

### 4. 유연한 내용 지원
- 문자열과 JSX 모두 지원
- 커스텀 스타일링 가능
- 다양한 옵션으로 동작 제어

### 5. 접근성 준수
- 키보드 지원 (ESC 키)
- 포커스 관리
- ARIA 속성 자동 설정

## 실제 사용 예시

```typescript
// 삭제 확인
const handleDeleteUser = async () => {
  const confirmed = await $confirm(
    '사용자 계정을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.',
    {
      title: '사용자 삭제',
      okText: '삭제',
      cancelText: '취소'
    }
  );
  
  if (confirmed) {
    try {
      await deleteUser();
      $alert('사용자가 성공적으로 삭제되었습니다.');
    } catch (error) {
      $alert('삭제 중 오류가 발생했습니다.', {
        title: '오류'
      });
    }
  }
};

// 폼 제출 전 확인
const handleSubmit = async () => {
  const confirmed = await $confirm(
    '정말로 제출하시겠습니까?',
    {
      title: '제출 확인',
      onOk: async () => {
        // 로딩 상태 표시
        return submitForm();
      }
    }
  );
  
  if (confirmed) {
    $alert('성공적으로 제출되었습니다!');
  }
};
```

## 문제 해결

### Q: 팝업이 표시되지 않아요
A: main.tsx에서 `@/utils/globalDialog`를 import했는지 확인하고, 함수를 올바르게 호출했는지 확인하세요.

### Q: TypeScript 에러가 발생해요
A: window.$alert, window.$confirm 사용 시 타입 체크를 해주세요:
```typescript
if (typeof window !== 'undefined' && window.$alert) {
  window.$alert('메시지');
}
```

### Q: 팝업이 뒤에 숨어있어요
A: CSS z-index를 확인하거나, 다른 요소의 z-index를 낮춰보세요.

### Q: 비동기 작업이 완료되지 않았는데 팝업이 닫혀요
A: onOk 콜백에서 Promise를 반환하면 비동기 작업이 완료될 때까지 대기합니다:
```typescript
$confirm('작업을 진행하시겠습니까?', {
  onOk: async () => {
    await performAsyncTask(); // 이 작업이 완료될 때까지 팝업이 열린 채로 유지
  }
});
```
