import React, { ReactNode } from 'react';
import { Tabs, Sticky } from '@/components/common';

interface LayoutProps {
  children: ReactNode;
}

const ReactGuideLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Sticky>
        <Tabs
          items={[
            { label: '홈', to: '/react-guide' },
            { label: '라이프사이클', to: '/react-guide/lifecycle' },
            { label: '상태관리', to: '/react-guide/statemanagement' },
            { label: '리스트', to: '/react-guide/lists' },
            { label: '유의사항', to: '/react-guide/pitfalls' },
            { label: '심화', to: '/react-guide/advanced' },
          ]}
        />
      </Sticky>
      <div>{children}</div>
    </>
  );
};

export default ReactGuideLayout;
