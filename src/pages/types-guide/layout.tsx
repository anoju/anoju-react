import React, { ReactNode } from 'react';
import { Tabs, Sticky } from '@/components/common';

interface LayoutProps {
  children: ReactNode;
}

const TypesGuideLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Sticky>
        <Tabs
          items={[
            { label: '홈', to: '/types-guide' },
            { label: '초급', to: '/types-guide/beginner' },
            { label: '중급', to: '/types-guide/intermediate' },
            { label: '고급', to: '/types-guide/advanced' },
            { label: 'React 실무', to: '/types-guide/reacttypes' },
          ]}
        />
      </Sticky>
      <div>{children}</div>
    </>
  );
};

export default TypesGuideLayout;
