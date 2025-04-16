// src/router/index.tsx
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import React from 'react';
import { PageModule } from './types'; // PageModule 타입을 가져옵니다.

// 레이아웃 props 타입 정의
interface LayoutProps {
  children: React.ReactNode;
}

// Vite의 glob 임포트 기능 (타입 지정)
const pages = import.meta.glob<PageModule>('../pages/**/*.tsx', {
  eager: true,
});

console.log('Available pages:', Object.keys(pages));

// 레이아웃 매핑 (인덱스 시그니처 추가)
const layoutMap: Record<string, React.FC<LayoutProps>> = {
  auth: AuthLayout,
  '': MainLayout, // 기본 레이아웃
};

// 경로 정보를 추출하여 라우트 배열 생성
const routes: RouteObject[] = Object.keys(pages).map((path) => {
  // 파일 경로에서 레이아웃 정보와 페이지 경로 추출
  const pathMatch = path.match(/\.\.\/pages\/(?:([^/]+)\/)?(.*)\.tsx$/);
  const layoutKey = pathMatch?.[1] || '';
  const pagePath = pathMatch?.[2] || '';

  // 디버깅을 위한 로그 추가
  console.log('Processing path:', path, 'Match:', pathMatch);

  // 동적 라우트 처리 및 index 파일 정규화
  const normalizedPagePath = pagePath
    .replace(/\[([^\]]+)\]/g, ':$1') // [id] -> :id
    .replace(/index$/, '');

  const routePath =
    normalizedPagePath === '' ? '/' : `/${normalizedPagePath.toLowerCase()}`;

  // 디버깅을 위한 로그 추가
  console.log('Route path:', routePath);

  const Layout = layoutMap[layoutKey] || MainLayout;
  const Page = pages[path].default;

  // RouteObject 타입에 맞게 객체 생성
  const route: RouteObject = {
    path: routePath,
    element: (
      <Layout>
        <Page />
      </Layout>
    ),
  };

  // 선택적 속성들은 존재할 때만 추가
  if (pages[path].loader) {
    route.loader = pages[path].loader;
  }

  if (pages[path].action) {
    route.action = pages[path].action;
  }

  // ErrorBoundary는 errorElement로 변환
  if (pages[path].ErrorBoundary) {
    const ErrorBoundary = pages[path].ErrorBoundary;
    route.errorElement = <ErrorBoundary />;
  }

  return route;
});

// 라우터 생성
const router = createBrowserRouter(routes);

export default router;
