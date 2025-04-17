// src/router/index.tsx
import React, { ReactNode } from 'react';
import { createBrowserRouter, RouteObject, Outlet } from 'react-router-dom';
import { PageModule, LayoutModule } from './types';
// import EmptyLayout from '../layouts/EmptyLayout';
import MainLayout from '../layouts/MainLayout';

// 레이아웃 props 타입 정의
interface LayoutProps {
  children: ReactNode;
}

// 기본 레이아웃 매핑
// const defaultLayoutMap: Record<string, React.ComponentType<LayoutProps>> = {
//   empty: EmptyLayout, // 빈 레이아웃
//   '': MainLayout, // 기본 레이아웃
// };

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
  folderSegments: string[];
} {
  // 특별히 ../pages/index.tsx 파일 처리
  if (filePath === '../pages/index.tsx') {
    return {
      routePath: '/',
      folderSegments: [],
    };
  }

  // ../pages/path/to/component.tsx 형식 처리
  const pathMatch = filePath.match(/\.\.\/pages\/(.*)\.tsx$/);
  const pathSegment = pathMatch?.[1] || '';

  // 폴더 세그먼트 추출
  const folderSegments = pathSegment.split('/');

  // 동적 라우트 처리 및 index 파일 정규화
  const normalizedPath = pathSegment
    .replace(/\[([^\]]+)\]/g, ':$1') // [id] -> :id
    .replace(/index$/, ''); // index 파일은 루트 경로로

  // layout.tsx 파일은 라우트에서 제외
  if (normalizedPath.endsWith('layout')) {
    return { routePath: '', folderSegments: [] };
  }

  const routePath =
    normalizedPath === '' ? '/' : `/${normalizedPath.toLowerCase()}`;

  return { routePath, folderSegments };
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

  // 특별히 index.tsx 먼저 처리 (루트 페이지)
  if (pages['../pages/index.tsx']) {
    if (!folderStructure.pages) folderStructure.pages = {};
    folderStructure.pages[''] = {
      path: '/',
      component: pages['../pages/index.tsx'].default,
      loader: pages['../pages/index.tsx'].loader,
      action: pages['../pages/index.tsx'].action,
      errorBoundary: pages['../pages/index.tsx'].ErrorBoundary,
    };
  }

  // 1. 나머지 페이지들 처리하여 폴더 구조 만들기
  Object.keys(pages).forEach((pagePath) => {
    if (pagePath === '../pages/index.tsx') return; // 루트 index는 이미 처리함
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

        // index 페이지 처리 (폴더 인덱스)
        if (i === folderSegments.length - 1 && segment === 'index') {
          if (!currentLevel.pages) currentLevel.pages = {};
          currentLevel.pages[''] = {
            path: routePath,
            component: pages[pagePath].default,
            loader: pages[pagePath].loader,
            action: pages[pagePath].action,
            errorBoundary: pages[pagePath].ErrorBoundary,
          };
        }
      }
    }
  });

  // 2. 최상위 라우트만 처리
  const rootRoutes: RouteObject[] = [];

  // 최상위 페이지들 처리
  if (folderStructure.pages) {
    Object.entries(folderStructure.pages).forEach(([name, pageInfo]) => {
      const routePath = name === '' ? '' : name;
      const element = React.createElement(MainLayout, {
        children: React.createElement(pageInfo.component),
      });

      rootRoutes.push({
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

  // 최상위 폴더들 처리 (각 폴더는 독립적인 라우트 구조를 가짐)
  if (folderStructure.folders) {
    Object.entries(folderStructure.folders).forEach(
      ([folderName, subStructure]) => {
        const folderRoute = processFolderRoutes(folderName, subStructure);
        if (folderRoute) {
          rootRoutes.push(folderRoute);
        }
      }
    );
  }

  return rootRoutes;

  // 폴더 라우트 처리 함수
  function processFolderRoutes(
    folderName: string,
    structure: FolderNode
  ): RouteObject | null {
    const isDynamicSegment =
      folderName.startsWith('[') && folderName.endsWith(']');
    const routeSegment = isDynamicSegment
      ? `:${folderName.slice(1, -1)}`
      : folderName;

    // 이 폴더에 대한 레이아웃 컴포넌트 확인
    const folderLayout = findLayoutForPath(folderName);

    // 이 폴더 내의 페이지들을 처리할 자식 라우트 배열
    const childRoutes: RouteObject[] = [];

    // 이 폴더 내의 페이지들 처리
    if (structure.pages) {
      Object.entries(structure.pages).forEach(([name, pageInfo]) => {
        const pagePath = name === '' ? '' : name;

        // 컴포넌트만 렌더링 (레이아웃은 부모 라우트에서 처리)
        childRoutes.push({
          path: pagePath,
          element: React.createElement(pageInfo.component),
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
        ([subFolderName, subStructure]) => {
          const subFolderPath = `${folderName}/${subFolderName}`;
          const subFolderLayout = findLayoutForPath(subFolderPath);

          if (subFolderLayout) {
            // 하위 폴더에 레이아웃이 있으면 독립적인 서브라우트로 처리
            const subChildRoutes: RouteObject[] = [];

            // 하위 폴더의 페이지들 처리
            if (subStructure.pages) {
              Object.entries(subStructure.pages).forEach(([name, pageInfo]) => {
                const pagePath = name === '' ? '' : name;
                subChildRoutes.push({
                  path: pagePath,
                  element: React.createElement(pageInfo.component),
                  loader: pageInfo.loader,
                  action: pageInfo.action,
                  errorElement: pageInfo.errorBoundary
                    ? React.createElement(pageInfo.errorBoundary)
                    : undefined,
                });
              });
            }

            // 더 깊은 하위 폴더들 재귀적으로 처리
            if (subStructure.folders) {
              Object.entries(subStructure.folders).forEach(
                ([deeperName, deeperStructure]) => {
                  const deeperFolderPath = `${subFolderPath}/${deeperName}`;
                  const processed = processDeepNestedFolder(
                    deeperName,
                    deeperStructure,
                    deeperFolderPath
                  );
                  if (processed) {
                    subChildRoutes.push(processed);
                  }
                }
              );
            }

            // 하위 폴더 레이아웃을 적용한 라우트 추가
            const isDynamicSubSegment =
              subFolderName.startsWith('[') && subFolderName.endsWith(']');
            const subRouteSegment = isDynamicSubSegment
              ? `:${subFolderName.slice(1, -1)}`
              : subFolderName;

            childRoutes.push({
              path: subRouteSegment,
              element: React.createElement(subFolderLayout, {
                children: React.createElement(Outlet),
              }),
              children: subChildRoutes,
            });
          } else {
            // 하위 폴더에 레이아웃이 없으면 플랫하게 처리
            // 하위 폴더의 페이지들을 현재 폴더에 추가
            if (subStructure.pages) {
              Object.entries(subStructure.pages).forEach(([name, pageInfo]) => {
                const isDynamicSubSegment =
                  subFolderName.startsWith('[') && subFolderName.endsWith(']');
                const subRouteSegment = isDynamicSubSegment
                  ? `:${subFolderName.slice(1, -1)}`
                  : subFolderName;
                const pagePath =
                  name === '' ? subRouteSegment : `${subRouteSegment}/${name}`;

                childRoutes.push({
                  path: pagePath,
                  element: React.createElement(pageInfo.component),
                  loader: pageInfo.loader,
                  action: pageInfo.action,
                  errorElement: pageInfo.errorBoundary
                    ? React.createElement(pageInfo.errorBoundary)
                    : undefined,
                });
              });
            }

            // 더 깊은 하위 폴더들 재귀적으로 처리
            if (subStructure.folders) {
              Object.entries(subStructure.folders).forEach(
                ([deeperName, deeperStructure]) => {
                  const deeperFolderPath = `${subFolderPath}/${deeperName}`;
                  const processed = processDeepNestedFolder(
                    deeperName,
                    deeperStructure,
                    deeperFolderPath
                  );
                  if (processed) {
                    // 경로 조정: subFolderName/processed.path
                    const isDynamicSubSegment =
                      subFolderName.startsWith('[') &&
                      subFolderName.endsWith(']');
                    const subRouteSegment = isDynamicSubSegment
                      ? `:${subFolderName.slice(1, -1)}`
                      : subFolderName;

                    processed.path = `${subRouteSegment}/${processed.path}`;
                    childRoutes.push(processed);
                  }
                }
              );
            }
          }
        }
      );
    }

    // 폴더에 페이지나 하위 폴더가 없으면 null 반환
    if (childRoutes.length === 0) {
      return null;
    }

    // 레이아웃 구성: 폴더 레이아웃이 있으면 적용, 없으면 기본 레이아웃
    let routeElement;
    if (folderLayout) {
      // 폴더 레이아웃이 있는 경우, 기본 레이아웃 > 폴더 레이아웃 > Outlet 순서로 중첩
      routeElement = React.createElement(MainLayout, {
        children: React.createElement(folderLayout, {
          children: React.createElement(Outlet),
        }),
      });
    } else {
      // 폴더 레이아웃이 없는 경우, 기본 레이아웃 > Outlet
      routeElement = React.createElement(MainLayout, {
        children: React.createElement(Outlet),
      });
    }

    return {
      path: routeSegment,
      element: routeElement,
      children: childRoutes,
    };
  }

  // 깊이 중첩된 폴더 처리
  function processDeepNestedFolder(
    folderName: string,
    structure: FolderNode,
    fullPath: string
  ): RouteObject | null {
    const folderLayout = findLayoutForPath(fullPath);
    const isDynamicSegment =
      folderName.startsWith('[') && folderName.endsWith(']');
    const routeSegment = isDynamicSegment
      ? `:${folderName.slice(1, -1)}`
      : folderName;

    const childRoutes: RouteObject[] = [];

    // 페이지 처리
    if (structure.pages) {
      Object.entries(structure.pages).forEach(([name, pageInfo]) => {
        const pagePath = name === '' ? '' : name;
        childRoutes.push({
          path: pagePath,
          element: React.createElement(pageInfo.component),
          loader: pageInfo.loader,
          action: pageInfo.action,
          errorElement: pageInfo.errorBoundary
            ? React.createElement(pageInfo.errorBoundary)
            : undefined,
        });
      });
    }

    // 하위 폴더 처리 (추가 중첩이 필요한 경우)
    if (structure.folders && Object.keys(structure.folders).length > 0) {
      // 추가 중첩 폴더 처리 로직
      // (간결함을 위해 생략)
    }

    if (childRoutes.length === 0) {
      return null;
    }

    let routeElement;
    if (folderLayout) {
      routeElement = React.createElement(folderLayout, {
        children: React.createElement(Outlet),
      });
    } else {
      routeElement = React.createElement(Outlet);
    }

    return {
      path: routeSegment,
      element: routeElement,
      children: childRoutes,
    };
  }
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
