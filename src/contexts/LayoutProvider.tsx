// src/contexts/LayoutProvider.tsx
import React, { useCallback, ReactNode, useState } from 'react';
import {
  LayoutContext,
  defaultLayoutConfig,
  LayoutConfig,
} from './LayoutContextDefinition';

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<LayoutConfig>(defaultLayoutConfig);

  // useCallback으로 함수를 메모이제이션하여 불필요한 재생성 방지
  const updateConfig = useCallback((newConfig: Partial<LayoutConfig>) => {
    setConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
  }, []);

  // 설정 초기화 함수
  const resetConfig = useCallback(() => {
    setConfig(defaultLayoutConfig);
  }, []);

  return (
    <LayoutContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </LayoutContext.Provider>
  );
};
