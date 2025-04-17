// src/router/index.tsx
import React, { ReactNode } from 'react';
import { createBrowserRouter, RouteObject, Outlet } from 'react-router-dom';
import { PageModule, LayoutModule } from './types';
import EmptyLayout from '../layouts/EmptyLayout';
import MainLayout from '../layouts/MainLayout';

// 레이아웃 props 타입 정의
interface LayoutProps {
  children: ReactNode;
}

// 기본 레이아웃 매핑
const defaultLayoutMap: Record<string, React.ComponentType<LayoutProps>> = {
  empty: EmptyLayout, // 빈 레이아웃
  '': MainLayout, // 기본 레이아웃
};

// Vite의 glob 임포트 기능
const pages = import.meta.glob<PageModule>('../pages/**/*.tsx', {
  eager: true,
});

// 레이아웃 파일 임포트 - pages 폴더 내의 layout.tsx 파일 찾기
const layouts = import.meta.glob<LayoutModule>('../pages/**/layout.tsx', {
  eager: true,
});

console.log('Available pages:', Object.keys(pages));
console.log('Available layouts:', Object.keys(layouts));

// 페이지 경로 추출 및 정규화 함수
function extractRoutePath(filePath: string): {
  routePath: string;
  layoutKey: string;
  folderSegments: string[];
} {
  // ../pages/path/to/component.tsx 형식 처리
  const pathMatch = filePath.match(/\.\.\/pages\/(.*)\.tsx$/);
  const pathSegment = pathMatch?.[1] || '';

  // 폴더 세그먼트 추출
  const folderSegments = pathSegment.split('/');

  // 레이아웃 키는 더 이상 필요하지 않지만, 기존 코드와의 호환성을 위해 유지
  const layoutKey = '';

  // 동적 라우트 처리 및 index 파일 정규화
  const normalizedPath = pathSegment
    .replace(/\[([^\]]+)\]/g, ':$1') // [id] -> :id
    .replace(/index$/, ''); // index 파일은 루트 경로로

  // layout.tsx 파일은 라우트에서 제외
  if (normalizedPath.endsWith('layout')) {
    return { routePath: '', layoutKey, folderSegments: [] };
  }

  const routePath =
    normalizedPath === '' ? '/' : `/${normalizedPath.toLowerCase()}`;

  return { routePath, layoutKey, folderSegments };
}

// 폴더 경로에 해당하는 레이아웃 컴포넌트 찾기
function findLayoutForPath(
  folderPath: string
): React.ComponentType<LayoutProps> | null {
  const layoutPath = `../pages/${folderPath}/layout.tsx`;
  if (layouts[layoutPath]?.default) {
    // 레이아웃을 LayoutProps와 호환되게 변환
    const LayoutComponent = layouts[layoutPath].default;
    return LayoutComponent as React.ComponentType<LayoutProps>;
  }
  return null;
}

// 폴더 구조 기반으로 중첩 라우트 생성
function buildRouteTree(): RouteObject[] {
  // 폴더 구조와 페이지 매핑
  interface FolderNode {
    pages?: Record<
      string,
      {
        path: string;
        component: React.ComponentType;
        loader?: PageModule['loader'];
        action?: PageModule['action'];
        errorBoundary?: PageModule['ErrorBoundary'];
      }
    >;
    folders?: Record<string, FolderNode>;
  }

  const folderStructure: FolderNode = {};

  // 1. 먼저 폴더 구조 만들기
  Object.keys(pages).forEach((pagePath) => {
    if (pagePath.endsWith('layout.tsx')) return; // 레이아웃 파일 제외

    const { routePath, folderSegments } = extractRoutePath(pagePath);
    if (!routePath) return; // 비어있는 경로 무시

    let currentLevel = folderStructure;
    let currentPath = '';

    // 폴더 트리 구축
    for (let i = 0; i < folderSegments.length; i++) {
      const segment = folderSegments[i];
      if (segment === 'layout') continue; // layout 세그먼트 무시

      currentPath = currentPath ? `${currentPath}/${segment}` : segment;

      if (
        i === folderSegments.length - 1 &&
        !segment.includes('[') &&
        segment !== 'index'
      ) {
        // 마지막 세그먼트이며 동적 경로가 아니면 페이지로 처리
        if (!currentLevel.pages) currentLevel.pages = {};
        currentLevel.pages[segment] = {
          path: routePath,
          component: pages[pagePath].default,
          loader: pages[pagePath].loader,
          action: pages[pagePath].action,
          errorBoundary: pages[pagePath].ErrorBoundary,
        };
      } else {
        // 폴더 처리
        if (!currentLevel.folders) currentLevel.folders = {};
        if (!currentLevel.folders[segment]) {
          currentLevel.folders[segment] = {};
        }
        currentLevel = currentLevel.folders[segment];
      }
    }
  });

  console.log('Folder structure:', JSON.stringify(folderStructure, null, 2));

  // 2. 폴더 구조에서 라우트 객체 생성
  function createRoutesFromStructure(
    structure: FolderNode,
    path: string = '',
    parentLayouts: React.ComponentType<LayoutProps>[] = []
  ): RouteObject[] {
    const routes: RouteObject[] = [];

    // 현재 폴더의 레이아웃 확인
    const currentLayout = findLayoutForPath(path);
    const currentLayouts = currentLayout
      ? [...parentLayouts, currentLayout]
      : parentLayouts;

    // 현재 폴더의 페이지 처리
    if (structure.pages) {
      Object.entries(structure.pages).forEach(([name, pageInfo]) => {
        // const pagePath = name === 'index' ? path : `${path}/${name}`;
        const routePath = name === 'index' ? '' : name;

        // 페이지 컴포넌트를 모든 레이아웃으로 감싸기
        let element: React.ReactNode = React.createElement(pageInfo.component);

        // 레이아웃이 있으면 적용 (안쪽부터 바깥쪽으로)
        for (let i = currentLayouts.length - 1; i >= 0; i--) {
          const Layout = currentLayouts[i];
          element = React.createElement(Layout, { children: element });
        }

        // 최외곽에 기본 레이아웃 적용
        const FinalLayout = defaultLayoutMap[''] || MainLayout;
        element = React.createElement(FinalLayout, { children: element });

        routes.push({
          path: routePath,
          element,
          loader: pageInfo.loader,
          action: pageInfo.action,
          errorElement: pageInfo.errorBoundary
            ? React.createElement(pageInfo.errorBoundary)
            : undefined,
        });
      });
    }

    // 하위 폴더 처리
    if (structure.folders) {
      Object.entries(structure.folders).forEach(
        ([folderName, subStructure]) => {
          const subPath = path ? `${path}/${folderName}` : folderName;
          const isDynamicSegment =
            folderName.startsWith('[') && folderName.endsWith(']');
          const routeSegment = isDynamicSegment
            ? `:${folderName.slice(1, -1)}`
            : folderName;

          // 하위 폴더의 레이아웃 존재 여부 확인
          const currentFolderLayout = findLayoutForPath(subPath);

          // 해당 폴더에 layout.tsx가 있거나 자식 페이지가 있는 경우에만 라우트 생성
          if (
            currentFolderLayout ||
            subStructure.pages ||
            Object.keys(subStructure.folders || {}).length > 0
          ) {
            // Outlet을 생성하고 레이아웃으로 감싸기
            let nestedElement: React.ReactNode = React.createElement(Outlet);

            // 현재 폴더의 레이아웃 적용 (있는 경우)
            if (currentFolderLayout) {
              nestedElement = React.createElement(currentFolderLayout, {
                children: nestedElement,
              });
            }

            // 부모 레이아웃들 적용 (안쪽부터 바깥쪽으로)
            for (let i = parentLayouts.length - 1; i >= 0; i--) {
              const Layout = parentLayouts[i];
              nestedElement = React.createElement(Layout, {
                children: nestedElement,
              });
            }

            // 최외곽에 기본 레이아웃 적용
            const FinalLayout = defaultLayoutMap[''] || MainLayout;
            const element = React.createElement(FinalLayout, {
              children: nestedElement,
            });

            // 재귀적으로 하위 라우트 생성
            const childLayouts = currentFolderLayout
              ? [...currentLayouts, currentFolderLayout]
              : currentLayouts;

            const childRoutes = createRoutesFromStructure(
              subStructure,
              subPath,
              childLayouts
            );

            routes.push({
              path: routeSegment,
              element,
              children: childRoutes,
            });
          } else {
            // 레이아웃이 없는 폴더의 하위 라우트는 평면화
            const childRoutes = createRoutesFromStructure(
              subStructure,
              subPath,
              currentLayouts
            );
            routes.push(...childRoutes);
          }
        }
      );
    }

    return routes;
  }

  return createRoutesFromStructure(folderStructure);
}

// 라우트 트리 생성
const routes = buildRouteTree();

// 라우트 구성 로깅
console.log(
  'Final routes:',
  JSON.stringify(
    routes.map((r) => ({
      path: r.path,
      children: r.children?.map((c) => c.path),
    })),
    null,
    2
  )
);

// 라우터 생성
const router = createBrowserRouter(routes);

export default router;
