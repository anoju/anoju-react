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
            label: 'Button',
            to: '/guide/button',
          },
          {
            label: 'Tabs',
            to: '/guide/tabs',
          },
          {
            label: 'Checkbox',
            to: '/guide/checkbox',
          },
          {
            label: 'Input',
            to: '/guide/input',
          },
          {
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
