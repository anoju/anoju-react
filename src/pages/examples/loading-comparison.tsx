// examples/loading-comparison.tsx
// 기존 방식과 $loading 방식 비교

import {
  showGlobalLoading,
  hideGlobalLoading,
  setGlobalLoading,
  getGlobalLoading,
  withLoading,
  wrapWithLoading,
  $loading,
} from '@/utils/loading';

// =====================================
// 기존 방식 (레거시)
// =====================================

export const oldWayExamples = {
  // 1. 기본 사용
  basicUsage: () => {
    showGlobalLoading({ text: '로딩 중...' });
    // ... 작업 수행
    hideGlobalLoading();
  },

  // 2. 상태 제어
  stateControl: () => {
    setGlobalLoading(true, { text: '로딩 시작' });
    const isLoading = getGlobalLoading();
    console.log(isLoading);
    setTimeout(() => {
      setGlobalLoading(false);
    }, 2000);
  },

  // 3. Promise와 함께
  withPromise: async () => {
    const result = await withLoading(
      fetch('/api/data').then((res) => res.json()),
      { text: '데이터 로딩 중...' }
    );
    return result;
  },

  // 4. 함수 래핑
  wrappedFunction: () => {
    const wrappedFn = wrapWithLoading(fetchData, {
      text: '처리 중...',
    });
    return wrappedFn;
  },
};

// =====================================
// $loading 방식 (신규, 추천)
// =====================================

export const newWayExamples = {
  // 1. 기본 사용 - 더 간결함
  basicUsage: () => {
    $loading.show({ text: '로딩 중...' });
    // ... 작업 수행
    $loading.hide();
  },

  // 2. 상태 제어 - 더 직관적
  stateControl: () => {
    $loading.set(true, { text: '로딩 시작' });
    const isLoading = $loading.get();
    $loading.set(false);
    console.log(isLoading);
    setTimeout(() => {
      // 추가: 토글 기능
      $loading.toggle({ text: '토글 상태' });
    }, 2000);
  },

  // 3. Promise와 함께 - 동일하지만 더 직관적
  withPromise: async () => {
    const result = await $loading.with(
      fetch('/api/data').then((res) => res.json()),
      { text: '데이터 로딩 중...' }
    );
    return result;
  },

  // 4. 함수 래핑 - 동일하지만 더 간결
  wrappedFunction: () => {
    const wrappedFn = $loading.wrap(fetchData, {
      text: '처리 중...',
    });
    return wrappedFn;
  },
};

// =====================================
// 실제 사용 시나리오 비교
// =====================================

// 시나리오 1: API 호출
export const apiCallComparison = {
  // 기존 방식
  oldWay: async () => {
    try {
      showGlobalLoading({ text: '사용자 데이터 로딩 중...' });
      const response = await fetch('/api/users');
      const users = await response.json();
      hideGlobalLoading();
      return users;
    } catch (error) {
      hideGlobalLoading(); // 에러 시에도 숨겨야 함
      throw error;
    }
  },

  // $loading 방식 - 자동으로 에러 처리
  newWay: async () => {
    return await $loading.with(
      fetch('/api/users').then((res) => res.json()),
      { text: '사용자 데이터 로딩 중...' }
    );
  },
};

// 시나리오 2: 조건부 로딩
export const conditionalLoadingComparison = {
  // 기존 방식
  oldWay: async (showLoading: boolean) => {
    try {
      if (showLoading) {
        showGlobalLoading({ text: '작업 수행 중...' });
      }

      const result = await performTask();

      if (showLoading) {
        hideGlobalLoading();
      }

      return result;
    } catch (error) {
      if (showLoading) {
        hideGlobalLoading(); // 에러 시에도 처리 필요
      }
      throw error;
    }
  },

  // $loading 방식
  newWay: async (showLoading: boolean) => {
    if (showLoading) {
      return await $loading.with(performTask(), { text: '작업 수행 중...' });
    } else {
      return await performTask();
    }
  },
};

// 시나리오 3: 상태 확인 및 토글
export const stateManagementComparison = {
  // 기존 방식 - 토글 기능이 없어서 직접 구현해야 함
  oldWay: () => {
    const currentState = getGlobalLoading();
    if (currentState) {
      hideGlobalLoading();
    } else {
      showGlobalLoading({ text: '토글된 상태' });
    }
  },

  // $loading 방식 - 내장 토글 기능
  newWay: () => {
    $loading.toggle({ text: '토글된 상태' });
  },
};

// 시나리오 4: 다단계 작업
export const multiStepComparison = {
  // 기존 방식
  oldWay: async () => {
    try {
      showGlobalLoading({ text: '1단계: 초기화 중...' });
      await step1();

      showGlobalLoading({ text: '2단계: 처리 중...' });
      await step2();

      showGlobalLoading({ text: '3단계: 완료 중...' });
      await step3();

      hideGlobalLoading();
    } catch (error) {
      hideGlobalLoading(); // 에러 시 처리
      throw error;
    }
  },

  // $loading 방식 - 동일하지만 더 간결
  newWay: async () => {
    try {
      $loading.show({ text: '1단계: 초기화 중...' });
      await step1();

      $loading.show({ text: '2단계: 처리 중...' });
      await step2();

      $loading.show({ text: '3단계: 완료 중...' });
      await step3();

      $loading.hide();
    } catch (error) {
      $loading.hide(); // 에러 시 처리
      throw error;
    }
  },
};

// =====================================
// 장단점 비교
// =====================================

export const comparisonSummary = {
  기존방식: {
    장점: [
      '명시적인 함수명으로 의도가 명확함',
      '기존 코드와의 호환성',
      '각 함수의 역할이 분명함',
    ],
    단점: [
      '함수명이 길어서 타이핑이 번거로움',
      '토글 기능이 없어서 직접 구현해야 함',
      'import 구문이 길어짐',
      '일관성 있는 네이밍이 어려움',
    ],
  },

  $loading방식: {
    장점: [
      '간결하고 직관적인 API',
      '객체 형태로 관련 기능이 그룹화됨',
      '토글 기능 내장',
      'import가 간단함',
      '다른 라이브러리와 유사한 패턴',
      '자동완성이 편리함',
    ],
    단점: [
      '새로운 패턴에 대한 학습 필요',
      '기존 코드 마이그레이션 필요시 작업량',
    ],
  },
};

// 헬퍼 함수들
const fetchData = async (): Promise<unknown> => {
  return new Promise((resolve) => setTimeout(() => resolve('data'), 1000));
};

const performTask = async (): Promise<string> => {
  return new Promise((resolve) => setTimeout(() => resolve('completed'), 1500));
};

const step1 = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 500));
const step2 = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 700));
const step3 = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300));
