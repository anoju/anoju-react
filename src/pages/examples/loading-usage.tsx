// examples/loading-usage.tsx
// $loading 사용법 예시

import { $loading } from '@/utils/loading';
import CustomIcon from '@/pages/examples/CustomIcon';

// 1. 기본 사용법
export const basicUsage = () => {
  // 기본 로딩 표시
  $loading.show();

  // 커스텀 메시지와 함께
  $loading.show({
    text: '데이터를 처리하고 있습니다...',
  });

  // 로딩 숨기기
  $loading.hide();
};

// 2. 상태 제어
export const stateControl = () => {
  // 상태 설정 (true/false)
  $loading.set(true, { text: '로딩 시작' });
  $loading.set(false); // 숨기기

  // 토글 (현재 상태의 반대로 변경)
  $loading.toggle({ text: '토글된 상태' });

  // 현재 상태 확인
  const isLoading = $loading.get();
  console.log('현재 로딩 상태:', isLoading);
};

// 3. API 호출과 함께 사용
export const apiWithLoading = async () => {
  try {
    // Promise와 함께 자동 로딩 관리
    const userData = await $loading.with(
      fetch('/api/users').then((res) => res.json()),
      { text: '사용자 데이터를 가져오는 중...' }
    );

    console.log('사용자 데이터:', userData);
    return userData;
  } catch (error) {
    console.error('에러 발생:', error);
  }
};

// 4. 함수 래핑
const fetchUserData = async (userId: string) => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
};

// 래핑된 함수 생성 (로딩이 자동으로 적용됨)
const fetchUserDataWithLoading = $loading.wrap(fetchUserData, {
  text: '사용자 정보를 불러오는 중...',
  bodyLock: true, // 로딩 중 스크롤 잠금
});

export const wrappedFunction = async () => {
  try {
    // 래핑된 함수 사용 - 자동으로 로딩 표시/숨기기
    const user = await fetchUserDataWithLoading('user123');
    console.log('사용자:', user);
  } catch (error) {
    console.error('에러:', error);
  }
};

// 5. 고급 옵션 사용
export const advancedUsage = () => {
  $loading.show({
    text: '파일을 업로드하고 있습니다...',
    delay: 500, // 0.5초 후 표시
    bodyLock: true, // 페이지 스크롤 잠금
    icon: <CustomIcon />, // 커스텀 아이콘
    onShow: () => {
      console.log('로딩 시작됨');
    },
    onHide: () => {
      console.log('로딩 완료됨');
    },
  });
};

// 6. 조건부 로딩
export const conditionalLoading = async (showLoading: boolean) => {
  if (showLoading) {
    $loading.show({ text: '조건부 로딩...' });
  }

  try {
    const result = await someAsyncOperation();
    return result;
  } finally {
    if (showLoading) {
      $loading.hide();
    }
  }
};

// 7. 순차적 작업
export const sequentialTasks = async () => {
  // 1단계
  $loading.show({ text: '1단계: 데이터 검증 중...' });
  await validateData();

  // 2단계
  $loading.show({ text: '2단계: 서버 전송 중...' });
  await sendToServer();

  // 3단계
  $loading.show({ text: '3단계: 결과 처리 중...' });
  await processResult();

  // 완료
  $loading.hide();
};

// 8. 에러 처리와 함께
export const withErrorHandling = async () => {
  try {
    const result = await $loading.with(riskyOperation(), {
      text: '위험한 작업 수행 중...',
    });

    alert('작업 완료!');
    return result;
  } catch (error) {
    alert(
      '작업 실패: ' + (error instanceof Error ? error.message : String(error))
    );
    throw error;
  }
  // $loading.with가 자동으로 로딩을 숨김 (성공/실패 관계없이)
};

// 헬퍼 함수들

const someAsyncOperation = () =>
  new Promise((resolve) => setTimeout(resolve, 2000));

const validateData = () => new Promise((resolve) => setTimeout(resolve, 1000));

const sendToServer = () => new Promise((resolve) => setTimeout(resolve, 1500));

const processResult = () => new Promise((resolve) => setTimeout(resolve, 800));

const riskyOperation = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve('성공!');
      } else {
        reject(new Error('실패!'));
      }
    }, 2000);
  });
