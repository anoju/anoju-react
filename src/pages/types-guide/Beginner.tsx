import { useEffect } from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import styles from '@/assets/scss/pages/react-guide.module.scss';
import { CodeHighlight } from '@/components/common';

const Beginner = () => {
  const { updateConfig } = useLayout();

  useEffect(() => {
    updateConfig({
      title: '초급 (Beginner)',
      showBackButton: true,
    });
  }, [updateConfig]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>🌱 TypeScript 초급 가이드</h1>
        <p className={styles.description}>
          타입스크립트의 기본 타입, 인터페이스와 타입 별칭의 차이, 함수 타이핑
          등 기초를 다집니다.
        </p>
      </header>

      <section className={styles.demoSection}>
        <h2>1. 기본 타입 (Basic Types)</h2>
        <p>변수를 선언할 때 어떤 값이 들어갈지 명시적으로 지정합니다.</p>
        <CodeHighlight
          language="typescript"
          code={`// ❌ 타입 추론에만 의존하거나 any를 남발하는 경우 (권장하지 않음)
let userName = "Alice";
let userAge: any = 25;

// ✅ 명시적이고 올바른 타입 지정 (권장)
const name: string = "Bob";
const age: number = 30;
const isActive: boolean = true;

// 배열 (Array)
const hobbies: string[] = ["Reading", "Gaming"];
const numbers: Array<number> = [1, 2, 3]; // 제네릭 문법 사용 가능

// 튜플 (Tuple): 배열의 길이와 각 요소의 타입이 고정된 배열
const userRecord: [number, string] = [1, "Alice"];

// Enum (열거형): 의미 있는 상수들의 집합
enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  GUEST = "GUEST",
}
const currentRole: UserRole = UserRole.ADMIN;`}
        />
      </section>

      <section className={styles.demoSection}>
        <h2>2. Type Alias vs Interface</h2>
        <p>
          객체의 형태를 정의하는 두 가지 주요 방법입니다. 대부분의 경우 상호
          호환되지만, 미묘한 차이가 있습니다.
        </p>
        <CodeHighlight
          language="typescript"
          code={`// 1. Type Alias (타입 별칭)
// 주로 유니온 타입이나 튜플, 원시값의 별칭을 만들 때 사용합니다.
type ID = string | number; // Union 타입에는 type만 사용 가능
type Point = {
  x: number;
  y: number;
};

// 2. Interface (인터페이스)
// 주로 객체의 구조를 정의할 때 사용하며, '확장(extends)'과 '선언 병합(Declaration Merging)'이 용이합니다.
interface User {
  id: ID;
  name: string;
  email?: string; // 선택적(Optional) 속성
}

// 인터페이스 확장 예시
interface AdminUser extends User {
  role: string;
  permissions: string[];
}

// ✅ [권장] 객체의 형태를 정의할 때는 일관성 있게 interface를 사용하고,
// 복잡한 타입 조합(유니온, 인터섹션 등)이 필요할 때 type을 사용하는 것이 일반적입니다.`}
        />
      </section>

      <section className={styles.demoSection}>
        <h2>3. 함수 타이핑 (Function Typing)</h2>
        <p>
          함수의 매개변수(Parameter)와 반환값(Return Type)에 타입을 지정합니다.
        </p>
        <CodeHighlight
          language="typescript"
          code={`// 매개변수와 반환 타입 명시
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// 화살표 함수 표기법
const greet = (name: string, greeting: string = "Hello"): string => {
  return \`\${greeting}, \${name}!\`;
};

// 반환값이 없는 함수는 void를 사용합니다.
const logMessage = (msg: string): void => {
  console.log(msg);
};

// 선택적 매개변수 (?)는 항상 필수 매개변수 뒤에 와야 합니다.
function buildName(firstName: string, lastName?: string): string {
  if (lastName) return \`\${firstName} \${lastName}\`;
  return firstName;
}`}
        />
      </section>

      <section className={styles.demoSection}>
        <h2>4. 리터럴 타입 (Literal Types)</h2>
        <p>
          특정 문자열이나 숫자 등 '정확한 값' 자체를 타입으로 지정하는 강력한
          기능입니다.
        </p>
        <CodeHighlight
          language="typescript"
          code={`// 문자열 리터럴 타입
type Direction = "Left" | "Right" | "Up" | "Down";

function move(direction: Direction) {
  console.log(\`Moving \${direction}\`);
}

move("Left"); // ✅ 정상 작동
// move("North"); // ❌ 타입 에러 발생: Argument of type '"North"' is not assignable to parameter of type 'Direction'.

// 숫자 리터럴 타입
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
const roll: DiceRoll = 4; // 7을 입력하면 에러 발생`}
        />
      </section>
    </div>
  );
};

export default Beginner;
