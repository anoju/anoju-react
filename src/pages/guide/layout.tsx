// src/pages/guide/layout.tsx
import React, { ReactNode } from 'react';
import { Tabs } from '@/components/common';

interface GuideLayoutProps {
  children: ReactNode;
}

const GuideLayout: React.FC<GuideLayoutProps> = ({ children }) => {
  return (
    <div>
      <Tabs
        items={[
          {
            id: 'Button',
            label: 'Button',
            to: '/guide/button',
          },
          {
            id: 'Tabs',
            label: 'Tabs',
            to: '/guide/tabs',
          },
          {
            id: 'Input',
            label: 'Input',
            to: '/guide/input',
          },
          {
            id: 'Modal',
            label: 'Modal',
            to: '/guide/modal',
          },
        ]}
      />
      {children}
    </div>
  );
};

export default GuideLayout;
