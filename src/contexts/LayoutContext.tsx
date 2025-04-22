// src/contexts/LayoutContext.tsx
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from 'react';

// 레이아웃 설정을 위한 타입 정의
export interface LayoutConfig {
  title?: string; // 페이지 타이틀
  leftButtons?: ReactNode; // 헤더 좌측 버튼들
  rightButtons?: ReactNode; // 헤더 우측 버튼들
  showHeader?: boolean; // 헤더 표시 여부
  showFooter?: boolean; // 푸터 표시 여부
  showBackButton?: boolean; // 뒤로 가기 버튼 표시 여부
  // 필요에 따라 추가 설정
}

// 컨텍스트의 기본값과 업데이트 함수를 포함하는 타입
export interface LayoutContextProps {
  config: LayoutConfig;
  updateConfig: (newConfig: Partial<LayoutConfig>) => void;
  resetConfig: () => void;
}

// 기본 레이아웃 설정
const defaultLayoutConfig: LayoutConfig = {
  title: '페이지 타이틀',
  leftButtons: null,
  rightButtons: null,
  showHeader: true,
  showFooter: true,
  showBackButton: true, // 기본값 true
};

// 컨텍스트 생성
export const LayoutContext = createContext<LayoutContextProps>({
  config: defaultLayoutConfig,
  updateConfig: () => {},
  resetConfig: () => {},
});

// 컨텍스트 제공자 컴포넌트
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

// 컨텍스트 사용을 위한 훅
export const useLayout = () => {
  return useContext(LayoutContext);
};
