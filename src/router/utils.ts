// src/router/utils.ts
import React from 'react';
import { RouteObject } from 'react-router-dom';

// 중첩 라우트를 위한 유틸리티 함수
export function createNestedRoute(
  path: string,
  Component: React.ComponentType<Record<string, unknown>>,
  children: RouteObject[]
): RouteObject {
  return {
    path,
    element: React.createElement(Component),
    children,
  };
}

// 라우트 그룹화 함수
export function createRouteGroup(routes: RouteObject[]): RouteObject[] {
  return routes;
}
