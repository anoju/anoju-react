// src/router/index.tsx
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import emptyLayout from '../layouts/emptyLayout';
import React from 'react';
import { PageModule } from './types';

// 레이아웃 props 타입 정의
interface LayoutProps {
  children: React.ReactNode;
}

// Vite의 glob 임포트 기능 (타입 지정)
const pages = import.meta.glob<PageModule>('../pages/**/*.tsx', {
  eager: true,
});

console.log('Available pages:', Object.keys(pages));

// 특정 레이아웃을 지정하기 위한 매핑
const layoutMap: Record<string, React.FC<LayoutProps>> = {
  empty: emptyLayout,
  '': MainLayout, // 기본 레이아웃
};

// 폴더 구조를 경로로 변환하는 함수
function extractRoutePath(filePath: string): {
  routePath: string;
  layoutKey: string;
} {
  // ../pages/[layoutKey]/rest/of/path.tsx 형식 처리
  // 이제 모든 폴더가 경로에 포함되어야 함

  const pathMatch = filePath.match(/\.\.\/pages\/(?:([^/]+)\/)?(.*)\.tsx$/);

  // 첫 번째 폴더가 레이아웃 키로 사용될 수 있음
  const firstFolder = pathMatch?.[1] || '';
  // 나머지 경로 부분
  const restOfPath = pathMatch?.[2] || '';

  // 레이아웃 키가 실제 레이아웃인지 확인
  const isLayoutKey = layoutMap[firstFolder] !== undefined;

  let layoutKey = '';
  let pathSegment = '';

  if (isLayoutKey) {
    // 첫 번째 폴더가 레이아웃 키인 경우
    layoutKey = firstFolder;
    pathSegment = restOfPath;
  } else {
    // 첫 번째 폴더도 경로의 일부인 경우
    layoutKey = ''; // 기본 레이아웃 사용
    pathSegment = pathMatch?.[1] ? `${firstFolder}/${restOfPath}` : restOfPath;
  }

  // 동적 라우트 처리 및 index 파일 정규화
  const normalizedPath = pathSegment
    .replace(/\[([^\]]+)\]/g, ':$1') // [id] -> :id
    .replace(/index$/, '');

  const routePath =
    normalizedPath === '' ? '/' : `/${normalizedPath.toLowerCase()}`;

  return { routePath, layoutKey };
}

// 라우트 생성
const routes: RouteObject[] = Object.keys(pages).map((path) => {
  const { routePath, layoutKey } = extractRoutePath(path);

  console.log(
    `Processing path: ${path}, Route: ${routePath}, Layout: ${layoutKey || 'MainLayout'}`
  );

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
