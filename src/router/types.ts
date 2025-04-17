// src/router/types.ts
import { ComponentType, ReactNode } from 'react';
import { LoaderFunction, ActionFunction } from 'react-router-dom';

export interface PageModule {
  default: ComponentType;
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
