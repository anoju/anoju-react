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
            label: 'Radio',
            to: '/guide/radio',
          },
          {
            label: 'Select',
            to: '/guide/select',
          },
          {
            label: 'Input',
            to: '/guide/input',
          },
          {
            label: 'Textarea',
            to: '/guide/textarea',
          },
          {
            label: 'Tooltip',
            to: '/guide/tooltip',
          },
          {
            label: 'StickyWrap',
            to: '/guide/stickyWrap',
          },
          {
            label: 'Expand',
            to: '/guide/expand',
          },
          {
            label: 'Loading',
            to: '/guide/loading',
          },
          {
            label: 'Popup',
            to: '/guide/popup',
          },
          {
            label: 'Device',
            to: '/guide/device',
          },
        ]}
      />
      {children}
    </div>
  );
};

export default GuideLayout;
