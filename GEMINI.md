# Gemini 코딩 가이드라인 (anoju-react)

이 문서는 `anoju-react` 프로젝트에서 AI(Gemini)가 코드를 작성하고 답변할 때 반드시 준수해야 할 규칙과 표준을 정의합니다.

## 1. 기본 원칙

- **언어 정책**: 모든 답변, 코드 내 주석, 커밋 메시지, 기술적 설명은 반드시 **한국어(Hangul)**로 작성합니다.
- **사용자 중심**: 사용자의 요구사항을 최우선으로 하되, 명시되지 않은 부분은 최고의 사용자 경험(UX)과 코드 품질을 위해 선제적으로 제안합니다.

## 2. 기술 스택 (Tech Stack)

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: SCSS (Reference `stylelint` rules)
- **Routing**: React Router DOM (v7)
- **Quality Control**: ESLint, Prettier, Stylelint

## 3. 컴포넌트 및 UI/UX 가이드라인

### 3.1 디자인 레퍼런스 (Ant Design)

- **역할**: 컴포넌트 설계 시 **Ant Design(Antd)**의 UI 패턴, Props 구조, 상호작용 방식을 레퍼런스로 참고합니다.
- **구현**: Antd 라이브러리를 직접 설치하거나 스타일을 그대로 복사하지 않습니다. 프로젝트의 스타일 시스템(SCSS)을 사용하여 **직접 구현**합니다.
- **목표**: Antd 수준의 완성도 높은 UX를 지향하되, 프로젝트의 아이덴티티에 맞춰 커스터마이징합니다.

### 3.2 웹 접근성 (Web Accessibility, A11y) - **필수 사항**

모든 컴포넌트는 장애인 차별 금지법 및 웹 접근성 지침을 준수해야 합니다.

- **시맨틱 마크업**: `div` 대신 의미에 맞는 태그(`button`, `input`, `secion`, `article`, `nav` 등)를 사용합니다.
- **ARIA 속성**: 시맨틱 태그만으로 의미 전달이 부족할 경우 `aria-label`, `aria-describedby`, `aria-expanded` 등을 적극 활용합니다.
- **키보드 접근성**: 마우스 없이 키보드(`Tab`, `Enter`, `Space`, 방향키)만으로 모든 기능을 사용할 수 있어야 합니다. 포커스(`:focus-visible`) 스타일을 명확히 지정합니다.
- **색상 대비**: 텍스트와 배경색 간의 명도 대비를 준수합니다.

## 4. 코드 작성 규칙 (Coding Conventions)

### 4.1 TypeScript (Strict Typing)

- **`any` 사용 금지**: `any` 타입 사용을 엄격히 금지합니다.
- **타입 정의**:
  - `interface` 또는 `type`을 사용하여 명시적인 타입을 정의합니다.
  - 복잡한 객체나 Props는 별도의 타입 정의 파일(`types/` 등)이나 컴포넌트 상단에 정의합니다.
- **이벤트 핸들링**: `React.ChangeEvent`, `React.FormEvent` 등 리액트 이벤트를 올바르게 타이핑합니다.

### 4.2 스타일링 (SCSS)

- **CSS Class Naming**: **Kebab-case**를 사용합니다 (예: `.user-profile-card`).
- **다크 모드 전략 (Dark Mode)**:
  - **Light Mode First**: 라이트 모드를 기본값으로 스타일링합니다.
  - **CSS Variables**: 모든 색상 값은 CSS 변수(`var(--color-primary)` 등)를 사용합니다.
  - **Override**: 다크 모드에서는 해당 CSS 변수의 값을 재할당하여 색상을 변경하는 방식을 사용합니다.
  - **위치**: 전역 CSS 변수는 `src/assets/scss/common/_root.scss` 파일에 정의합니다.
- **구조**: 가독성을 위해 적절한 중첩(Nesting)을 사용하되, 과도한 깊이는 피합니다.
- **BEM**: 가능한 경우 BEM(Block Element Modifier) 방법론을 변형하여 유지보수가 용이한 구조를 지향합니다.

### 4.3 주석 (Comments)

- 모든 주석은 **한국어**로 작성합니다.
- 단순한 코드 설명보다는 **"왜(Why)"** 이렇게 구현했는지에 대한 의도와 비즈니스 로직을 설명합니다.
- 복잡한 알고리즘이나 예외 처리 구문에는 반드시 주석을 남깁니다.

### 4.4 디렉토리 구조 준수

- 새로운 파일 생성 시 `src/components`, `src/pages`, `src/hooks` 등 기존 프로젝트 구조와 역할에 맞는 위치를 선정합니다.

---

_이 파일은 프로젝트의 규칙을 정의하는 기준점(Source of Truth)으로 활용됩니다._
