// src/router/types.ts
import { ComponentType, ReactNode } from 'react';
import { LoaderFunction, ActionFunction } from 'react-router-dom';

export interface PageModule {
  default: ComponentType;
  loader?: LoaderFunction;
  action?: ActionFunction;
  ErrorBoundary?: ComponentType;
}

//수동 라우트 정의시 사용
export interface RouteConfig {
  path: string;
  element: ReactNode;
  loader?: LoaderFunction;
  action?: ActionFunction;
  errorElement?: ReactNode;
  children?: RouteConfig[];
}
