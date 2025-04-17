// src/pages/guide/button.tsx
import { Button } from '@/components/common';

const ButtonGuide = () => {
  return (
    <div>
      <h1>Button Guide</h1>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          flexDirection: 'column',
          maxWidth: '300px',
        }}
      >
        <Button>Normal Button</Button>
        <Button to="/">Navigate to Home</Button>
        <Button anchor href="https://example.com" target="_blank">
          External Link
        </Button>
      </div>
    </div>
  );
};

export default ButtonGuide;
