// src/router/index.tsx
import { createBrowserRouter, RouteObject, Outlet } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import emptyLayout from '../layouts/emptyLayout';
import GuideLayout from '../layouts/GuideLayout'; // 이 컴포넌트는 따로 만들어야 함
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

// 레이아웃 매핑 (인덱스 시그니처 추가)
const layoutMap: Record<string, React.FC<LayoutProps>> = {
  empty: emptyLayout, // 빈 레이아웃
  '': MainLayout, // 기본 레이아웃
};

// 폴더별 중간 레이아웃 매핑
const folderLayoutMap: Record<string, React.FC<LayoutProps>> = {
  guide: GuideLayout,
  // 추가 특수 레이아웃이 필요한 폴더를 여기에 매핑
};

// 폴더 구조를 경로로 변환하는 함수
function extractRoutePath(filePath: string): {
  routePath: string;
  layoutKey: string;
  folderPath: string;
} {
  // ../pages/[layoutKey]/rest/of/path.tsx 형식 처리
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

  // 첫 번째 폴더 경로 (중간 레이아웃 결정용)
  const folderPath = pathMatch?.[1] || '';

  // 동적 라우트 처리 및 index 파일 정규화
  const normalizedPath = pathSegment
    .replace(/\[([^\]]+)\]/g, ':$1') // [id] -> :id
    .replace(/index$/, '');

  const routePath =
    normalizedPath === '' ? '/' : `/${normalizedPath.toLowerCase()}`;

  return { routePath, layoutKey, folderPath };
}

// 페이지를 폴더별로 그룹화
const pageGroups: Record<
  string,
  Array<{
    routePath: string;
    layoutKey: string;
    module: PageModule;
  }>
> = {};

// 각 페이지 파일을 처리하고 그룹화
Object.keys(pages).forEach((path) => {
  const { routePath, layoutKey, folderPath } = extractRoutePath(path);
  const topFolder = folderPath || '_root'; // 최상위 페이지는 '_root'로 그룹화

  if (!pageGroups[topFolder]) {
    pageGroups[topFolder] = [];
  }

  pageGroups[topFolder].push({
    routePath,
    layoutKey,
    module: pages[path],
  });

  console.log(
    `Page: ${path}, Route: ${routePath}, Layout: ${layoutKey}, Folder: ${folderPath}`
  );
});

// 최종 라우트 배열
const routes: RouteObject[] = [];

// 각 폴더 그룹에 대한 라우트 생성
Object.keys(pageGroups).forEach((folder) => {
  const hasMiddleLayout = folderLayoutMap[folder] !== undefined;

  if (hasMiddleLayout && folder !== '_root') {
    // 중간 레이아웃이 있는 그룹은 중첩 라우트로 처리
    const MiddleLayout = folderLayoutMap[folder];

    // 그룹의 첫 번째 페이지에서 layoutKey 가져오기 (모든 페이지가 같은 레이아웃을 사용한다고 가정)
    const groupLayoutKey = pageGroups[folder][0].layoutKey;
    const OuterLayout = layoutMap[groupLayoutKey] || MainLayout;

    // 중간 레이아웃을 포함한 부모 라우트 생성
    const folderBaseRoutePath = `/${folder.toLowerCase()}`;
    const parentRoute: RouteObject = {
      path: folderBaseRoutePath,
      element: (
        <OuterLayout>
          <MiddleLayout>
            <Outlet />
          </MiddleLayout>
        </OuterLayout>
      ),
      children: [],
    };

    // 폴더 내 각 페이지에 대한 자식 라우트 생성
    pageGroups[folder].forEach(({ module, routePath }) => {
      // 자식 라우트 경로 계산 방법 개선
      let childPath = '';

      if (routePath === folderBaseRoutePath) {
        // 인덱스 라우트 (예: /guide에 대한 가이드 인덱스 페이지)
        childPath = ''; // 빈 문자열은 인덱스 라우트로 처리됨
      } else if (routePath.startsWith(folderBaseRoutePath + '/')) {
        // 하위 경로 (예: /guide/button)
        childPath = routePath.substring(folderBaseRoutePath.length + 1);
      } else {
        console.warn(
          `Unexpected route path: ${routePath} for parent ${folderBaseRoutePath}`
        );
        childPath = routePath;
      }

      console.log(
        `Creating child route: ${childPath} from ${routePath} under ${folderBaseRoutePath}`
      );

      if (parentRoute.children) {
        parentRoute.children.push({
          path: childPath || undefined, // 빈 문자열은 undefined로 변환
          element: <module.default />,
          loader: module.loader,
          action: module.action,
          errorElement: module.ErrorBoundary ? (
            <module.ErrorBoundary />
          ) : undefined,
        });
      }
    });

    routes.push(parentRoute);
  } else {
    // 중간 레이아웃이 없는 경우 일반 라우트로 처리
    pageGroups[folder].forEach(({ routePath, layoutKey, module }) => {
      const Layout = layoutMap[layoutKey] || MainLayout;

      routes.push({
        path: routePath,
        element: (
          <Layout>
            <module.default />
          </Layout>
        ),
        loader: module.loader,
        action: module.action,
        errorElement: module.ErrorBoundary ? (
          <module.ErrorBoundary />
        ) : undefined,
      });
    });
  }
});

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
