// src/router/types.ts
import { ComponentType, ReactNode } from 'react';
import { LoaderFunction, ActionFunction } from 'react-router-dom';

// 페이지 메타데이터 인터페이스 추가
export interface PageMetadata {
  layout?: string; // 레이아웃 지정 ('empty' 또는 '')
  // 필요한 경우 추가 메타데이터 필드
}

export interface PageModule {
  default: ComponentType & { metadata?: PageMetadata }; // metadata 필드 추가
  loader?: LoaderFunction;
  action?: ActionFunction;
  ErrorBoundary?: ComponentType;
}

export interface LayoutModule {
  default: ComponentType<{ children: ReactNode }>;
}

// 수동 라우트 정의시 사용
export interface RouteConfig {
  path: string;
  element: ReactNode;
  loader?: LoaderFunction;
  action?: ActionFunction;
  errorElement?: ReactNode;
  children?: RouteConfig[];
}

// 폴더 구조를 표현하기 위한 타입
export interface FolderStructure {
  pages?: Record<
    string,
    {
      path: string;
      component: ComponentType;
      loader?: LoaderFunction;
      action?: ActionFunction;
      errorBoundary?: ComponentType;
    }
  >;
  folders?: Record<string, FolderStructure>;
}
