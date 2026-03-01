import { useEffect } from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import styles from '@/assets/scss/pages/react-guide.module.scss';
import { CodeHighlight } from '@/components/common';

const Advanced = () => {
  const { updateConfig } = useLayout();

  useEffect(() => {
    updateConfig({
      title: '고급 (Advanced)',
      showBackButton: true,
    });
  }, [updateConfig]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>🚀 TypeScript 고급 가이드</h1>
        <p className={styles.description}>
          유틸리티 타입, 맵드 타입, 조건부 타입 등 타입의 변형 및 추론을
          극대화하는 기법을 배웁니다.
        </p>
      </header>

      <section className={styles.demoSection}>
        <h2>1. 유틸리티 타입 (Utility Types)</h2>
        <p>
          기존에 선언된 타입을 변환하여 새로운 타입을 맵핑하는 TypeScript 내장
          유틸리티입니다.
        </p>
        <CodeHighlight
          language="typescript"
          code={`interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

// 1. Partial<T>: 모든 속성을 선택적(Optional)으로 만듭니다. (업데이트 등에서 활용)
function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>): Todo {
  return { ...todo, ...fieldsToUpdate }; // { title?: string, ... }
}

// 2. Required<T>: 모든 속성을 필수(Required)로 만듭니다. (모든 Optional 옵션 제거)
type StrictTodo = Required<Partial<Todo>>; // 다시 모든 속성이 필수가 됨

// 3. Readonly<T>: 모든 속성을 읽기 전용으로 설정합니다. 불변성 유지에 핵심.
const myTodo: Readonly<Todo> = { title: "x", description: "y", completed: false };
// myTodo.title = "z"; // ❌ 에러: 읽기 전용 속성

// 4. Pick<T, K>: 객체의 일부분 속성(K)만을 추출하여 새 타입을 만듭니다.
type TodoPreview = Pick<Todo, "title" | "completed">; // description 생략

// 5. Omit<T, K>: 객체에서 특정 속성(K)만 제외하고 나머지를 취합니다.
type TodoWithoutDesc = Omit<Todo, "description">;

// 6. Record<K, T>: 객체의 키가 K 타입, 값이 T 타입인 레코드를 생성 (사전 형태에 유용)
type PageInfo = { title: string };
const nav: Record<"home" | "about" | "contact", PageInfo> = {
  home: { title: "Home" },
  about: { title: "About" },
  contact: { title: "Contact" },
};`}
        />
      </section>

      <section className={styles.demoSection}>
        <h2>2. 맵드 타입 (Mapped Types) & Indexed Access</h2>
        <p>
          기존 타입의 속성을 순회(Iterate)하면서 동적으로 타입을 재생산합니다.
        </p>
        <CodeHighlight
          language="typescript"
          code={`// 1. 인덱스 엑세스 (Indexed Access Type)
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"]; // number

// 2. 맵드 타입: in 키워드를 사용해 순회
// 모든 속성 키(K)를 옵셔널로 바꾸는 커스텀 Partial 유틸리티 구조 (내장 Partial과 동일)
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

// 모든 속성의 타입을 string으로 변경해 보기
type Stringify<T> = {
  [K in keyof T]: string;
};
type StringPerson = Stringify<Person>; // { age: string; name: string; alive: string; }

// +/- 기호(Mapping Modifiers)로 한정자 제어
// 모든 옵셔널(?)을 제거(-?)
type Concrete<T> = {
  [P in keyof T]-?: T[P];
};`}
        />
      </section>

      <section className={styles.demoSection}>
        <h2>3. 조건부 타입 (Conditional Types)과 \`infer\`</h2>
        <p>
          타입의 조건에 따라 다른 타입을 반환하게 하는 삼항 및 추론 기법입니다.
        </p>
        <CodeHighlight
          language="typescript"
          code={`// 1. 조건부 타입 구조: T extends U ? X : Y
// 만약 T가 string이면 Message 타입을, 아니면 Error 타입을 반환
type StringHandler<T> = T extends string ? "Message" : "Error";

type Result1 = StringHandler<string>; // "Message"
type Result2 = StringHandler<number>; // "Error"

// 2. infer 키워드: 조건부 타입 내에서 타입을 동적으로 '추론'하여 사용
// 함수 타입에서 반환값의 타입을 알아내는 유틸리티 (내장 ReturnType<T>과 동일 원리)
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function exampleFn() {
  return "Hello TypeScript";
}
type ReturnedValue = GetReturnType<typeof exampleFn>; // string 추론 완료

// 배열(혹은 Promise) 내부의 아이템 꺼내기(Unwrap)
type Unpacked<T> = T extends (infer U)[] ? U : T;
type Item = Unpacked<string[]>; // string
type Item2 = Unpacked<number>; // number (배열이 아니면 원형 유지)`}
        />
      </section>

      <section className={styles.demoSection}>
        <h2>4. 템플릿 리터럴 타입 (Template Literal Types)</h2>
        <p>백틱(\`)을 활용해 리터럴 문자열을 패턴화하여 매칭하는 기법입니다.</p>
        <CodeHighlight
          language="typescript"
          code={`type CSSUnit = "px" | "em" | "rem";
// 템플릿 리터럴을 통해 조합 문자열 패턴을 허용
type SizeProp = \`\${number}\${CSSUnit}\`; // "10px", "1.5rem" 등이 가능

let padding: SizeProp = "16px"; // 가능
// padding = "auto"; // ❌ 에러

// 이벤트 맵핑에서 유용
type EventNames = "click" | "hover" | "focus";
type HandlerNames = \`on\${Capitalize<EventNames>}\`; 
// 결과: "onClick" | "onHover" | "onFocus"`}
        />
      </section>
    </div>
  );
};

export default Advanced;
