// src/pages/guide/button.tsx - 버튼 가이드 페이지
import { Button } from '@/components/common';

const ButtonGuide = () => {
  return (
    <div>
      <h1>Button Component</h1>

      <section>
        <h2>기본 버튼</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button>Default Button</Button>
          <Button className="primary">Primary Button</Button>
          <Button className="secondary">Secondary Button</Button>
        </div>

        <h3>사용 예</h3>
        <pre>
          <code>{`<Button>Default Button</Button>
<Button className="primary">Primary Button</Button>
<Button className="secondary">Secondary Button</Button>`}</code>
        </pre>
      </section>

      <section>
        <h2>링크 버튼</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button className="primary" to="/">
            Home Link
          </Button>
          <Button className="primary" to="/about">
            About Link
          </Button>
        </div>

        <h3>사용 예</h3>
        <pre>
          <code>{`<Button to="/">Home Link</Button>
<Button to="/about">About Link</Button>`}</code>
        </pre>
      </section>

      <section>
        <h2>외부 링크 버튼</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            className="primary"
            href="https://example.com"
            target="_blank"
          >
            External Link
          </Button>
        </div>

        <h3>사용 예</h3>
        <pre>
          <code>{`<Button className="primary" href="https://example.com" target="_blank">
  External Link
</Button>`}</code>
        </pre>
      </section>
    </div>
  );
};

export default ButtonGuide;
