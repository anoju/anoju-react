import { useEffect } from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import styles from '@/assets/scss/pages/react-guide.module.scss';
import { CodeHighlight } from '@/components/common';

const Intermediate = () => {
  const { updateConfig } = useLayout();

  useEffect(() => {
    updateConfig({
      title: '중급 (Intermediate)',
      showBackButton: true,
    });
  }, [updateConfig]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>🧰 TypeScript 중급 가이드</h1>
        <p className={styles.description}>
          유니온/인터섹션 타입, 타입 가드, 제네릭 등 타입스크립트를 유연하게
          다루는 핵심 기법을 학습합니다.
        </p>
      </header>

      <section className={styles.demoSection}>
        <h2>1. 유니온(Union)과 인터섹션(Intersection)</h2>
        <p>여러 타입을 조합하여 새로운 타입을 선언합니다.</p>
        <CodeHighlight
          language="typescript"
          code={`// 1. 유니온 (Union) 타입 |
// 값(변수)이 여러 타입 중 하나일 수 있음을 나타냅니다. (OR 역할)
type StringOrNumber = string | number;

function printId(id: StringOrNumber) {
  // id가 string인지 number인지 확인이 안되므로 바로 .toUpperCase() 호출 시 에러 발생
  console.log("Your ID is: " + id);
}

// 2. 인터섹션 (Intersection) 타입 &
// 여러 타입을 모두 만족하는 '교집합' 형태의 하나의 타입으로 합칩니다. (AND 역할)
interface Admin {
  id: string;
  role: string;
}
interface Employee {
  company: string;
  startDate: Date;
}

type AdminEmployee = Admin & Employee; // 두 인터페이스의 속성을 모두 가져야 함

const newHire: AdminEmployee = {
  id: "E123",
  role: "manager",
  company: "Tech Corp",
  startDate: new Date(),
};`}
        />
      </section>

      <section className={styles.demoSection}>
        <h2>2. 타입 가드 (Type Guards)와 좁히기 (Narrowing)</h2>
        <p>
          런타임에서 특정 타입인지 검사하여, 컴파일러가 해당 블록 내의 타입을
          유추(좁힘)할 수 있게 합니다.
        </p>
        <CodeHighlight
          language="typescript"
          code={`// 1. typeof 타입 가드
function processValue(val: string | number) {
  if (typeof val === "string") {
    // 이 블록 안에서 val은 string 타입으로 추론됨
    return val.toUpperCase();
  }
  // 여기서는 val이 number 타입으로 추론됨
  return val.toFixed(2);
}

// 2. instanceof (클래스 인스턴스 확인)
function logError(error: Error | string) {
  if (error instanceof Error) {
    console.log(error.message);
  } else {
    console.log(error); // 여기서 error는 string
  }
}

// 3. 사용자 정의 타입 가드 (User-Defined Type Guards) - \`is\` 키워드 사용
interface Fish {
  swim: () => void;
}
interface Bird {
  fly: () => void;
}

// 리턴 타입에 animal is Fish 명시
function isFish(animal: Fish | Bird): animal is Fish {
  return (animal as Fish).swim !== undefined; // swim 속성이 있다면 Fish
}

function handleAnimal(animal: Fish | Bird) {
  if (isFish(animal)) {
    animal.swim(); // animal이 Fish 타입으로 확정됨
  } else {
    animal.fly(); // animal이 Bird 타입으로 확정됨
  }
}`}
        />
      </section>

      <section className={styles.demoSection}>
        <h2>3. 제네릭 (Generics)</h2>
        <p>
          타입을 매개변수화하여 재사용성과 타입 안정성을 높이는 핵심 기능입니다.
        </p>
        <CodeHighlight
          language="typescript"
          code={`// 타입을 미리 지정하지 않고, 함수나 컴포넌트가 '호출될 때' 타입을 결정
function identity<T>(arg: T): T {
  return arg;
}

// 제네릭 함수 사용
let output1 = identity<string>("myString");  // 명시적 // return: string
let output2 = identity(100);                // 타입 추론 // return: number

// 인터페이스에서의 제네릭
interface ApiResponse<Data> {
  status: number;
  message: string;
  data: Data; // 제네릭 타입
}

const userRes: ApiResponse<{ name: string; age: number }> = {
  status: 200,
  message: "Success",
  data: {
    name: "Alice",
    age: 25,
  } // ✅ 의도한 데이터 구조만 허용
};

// 제네릭 제약 (Constraints)
// T는 최소한 length 속성을 가진 타입이어야 함을 명시
function logLength<T extends { length: number }>(arg: T): T {
  console.log(arg.length);
  return arg;
}
logLength("Hello"); // 가능 (string은 length 속성 보유)
logLength([1, 2, 3]); // 가능 (Array도 length 보유)
// logLength(123); // ❌ Error: number는 length 속성이 없음`}
        />
      </section>

      <section className={styles.demoSection}>
        <h2>4. 식별 가능한 유니온 (Discriminated Unions)</h2>
        <p>
          공통(리터럴 타입) 프로퍼티를 태그(Tag)로 사용하여 복잡한 구조체의
          타입을 정확하게 구분합니다.
        </p>
        <CodeHighlight
          language="typescript"
          code={`// 이들은 모두 'type' 공통 식별자를 가짐
interface Square {
  kind: "square"; // 공통 태그(리터럴)
  size: number;
}
interface Rectangle {
  kind: "rectangle"; 
  width: number;
  height: number;
}
interface Circle {
  kind: "circle";
  radius: number;
}

type Shape = Square | Rectangle | Circle;

// switch문을 활용한 타입 좁히기 패턴
function getArea(shape: Shape) {
  switch (shape.kind) { // kind 값으로 타입 추론
    case "square":
      return shape.size * shape.size; // shape는 명확하게 Square
    case "rectangle":
      return shape.width * shape.height; 
    case "circle":
      return Math.PI * shape.radius ** 2;
    default:
      // 모든 케이스를 처리했는지 보장하는 'Never' 타입 기법 (Exhaustiveness checking)
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}`}
        />
      </section>
    </div>
  );
};

export default Intermediate;
