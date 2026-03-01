# TypeScript Guide 구현 계획 (TypeScript Guide Plan)

이 문서는 React + TypeScript 환경에서 개발자를 위한 타입스크립트 가이드 문서를 구축하기 위한 단계별 구현 계획입니다.
기존 `react-guide`와 동일한 패턴(layout 등)을 사용하여 화면을 구성할 예정입니다.

## 1. 목적 및 구조 배경

- **목적:** TypeScript 초보자부터 숙련된 React 개발자까지 점진적으로 학습할 수 있는 가이드 페이지
- **위치:** `src/pages/types-guide/`
- **화면 구성:** 기존 `react-guide`처럼 `layout.tsx`와 `index.tsx`를 기본으로 두고, 학습 진도에 따라 여러 컴포넌트 화면을 추가합니다.

## 2. 파일 및 페이지 구조 (예상)

```text
src/pages/types-guide/
├── index.tsx          # TypeScript 가이드 소개 및 목차 페이지
├── layout.tsx         # 가이드 전용 공통 레이아웃 (Sidebar 및 LNB 내비게이션 포함)
├── Beginner.tsx       # 초급: 기본 타입, 인터페이스, 변수 타입
├── Intermediate.tsx   # 중급: 제네릭(Generics), 유니온(Union)과 인터섹션(Intersection), 타입 가드
├── Advanced.tsx       # 고급: 유틸리티 타입, 조건부 타입, 맵드 타입(Mapped Types)
├── ReactTypes.tsx     # React 특화: Props, Events, Hooks 타이핑 가이드
└── plan.md            # 본 설계 문서
```

## 3. 단계별 상세 구현 내용

### 1단계: 레이아웃 및 소개 페이지 구성 [x] 완료

- **`layout.tsx`**:
  - `react-guide/layout.tsx`를 참고하여 가이드 콘텐츠 영역과 내비게이션(Sidebar/Tab)을 구성.
  - 라우팅 연결 (`types-guide`, `types-guide/beginner` 등)
- **`index.tsx`**:
  - TypeScript의 필요성과 본 가이드의 목표 설명.
  - 각 챕터(Beginner ~ ReactTypes)에 대한 요약과 바로가기 안내.

### 2단계: Beginner.tsx (초급 과정) [x] 완료

- **주요 내용:**
  - `string`, `number`, `boolean`, `array`, `tuple`, `enum` 등 기본 타입 선언 예제
  - `type` 별칭(Type Alias)과 `interface`의 차이점 및 사용법 기초
  - 함수의 매개변수와 반환 타입 지정 방식
  - 리터럴 타입(Literal Types)의 개념
- **UI/UX 아이디어:**
  - 잘못된 타입 추론으로 인한 에러 발생 상황과 올바른 타입을 적용한 코문을 Code Block UI로 비교해서 보여줌.

### 3단계: Intermediate.tsx (중급 과정) [x] 완료

- **주요 내용:**
  - 유니온 타입(`|`)과 인터섹션 타입(`&`) 심화 비교
  - 타입 가드(Type Guards): `typeof`, `instanceof`, 사용자 정의 타입 가드 (`is` 키워드)
  - 제네릭(Generics) 기초: 함수의 매개변수를 유동적으로 처리하는 법 (`<T>`)
  - 식별 가능한 유니온(Discriminated Unions) 예제
- **UI/UX 아이디어:**
  - 복잡한 데이터 구조에서 TypeScript가 타입을 어떻게 좁혀가는지(Type Narrowing) 주석과 함께 시각적으로 제공.

### 4단계: Advanced.tsx (고급 과정) [x] 완료

- **주요 내용:**
  - 유틸리티 타입(Utility Types): `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record` 심화
  - 맵드 타입(Mapped Types)과 인덱스드 액세스 타입(Indexed Access Types)
  - 조건부 타입(Conditional Types)과 `infer` 키워드의 원리
  - 템플릿 리터럴 타입(Template Literal Types) 등 고급 추론
- **UI/UX 아이디어:**
  - API Response, Request 데이터 등을 조작하고 변형하는 실무적인 타입 변형 예시를 인터랙티브하게 보여줌.

### 5단계: ReactTypes.tsx (리액트 환경 실무 가이드) [x] 완료

- **주요 내용:**
  - `React.FC` 사용 지양 및 올바른 Props, Children(`React.ReactNode`) 매개변수 타이핑 방법
  - Hook 타이핑: `useState<T>`, `useReducer`, `useRef<T>` 에서의 제네릭 사용법
  - `Event` 객체 타이핑 (`React.ChangeEvent<HTMLInputElement>`, `React.MouseEvent` 등)
  - HTML 기본 컴포넌트 확장 타이핑 (`ComponentProps`, `ComponentPropsWithoutRef`)
- **UI/UX 아이디어:**
  - Ant Design 레퍼런스 스타일이나 사내 스타일 시스템에 맞게 Props를 정의하는 모범 사례 코드를 제시.

## 4. 이후 작업 절차

1. [x] 위 구조 및 계획 논의 및 확정.
2. [x] 라우터 설정(Router)에 `types-guide` 관련 경로 및 하위 라우팅 연결. (파일 구조 기반 자동매핑 적용됨)
3. [x] 공통 레이아웃 파일(`layout.tsx`)과 인트로 파일(`index.tsx`) 구성.
4. [x] 초급(Beginner) -> 중급(Intermediate) -> 고급(Advanced) -> 리액트 특화(ReactTypes) 순서로 화면 구축.

---

**진행 가이드:**
작성된 플랜을 검토하시고 만족스러우시면 `"플랜대로 레이아웃(1단계)부터 만들어줘"`라고 말씀해주시면 구현 코딩을 시작하도록 하겠습니다.
