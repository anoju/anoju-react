// examples/loading-component-example.tsx
// React 컴포넌트에서 $loading 사용 예시

import React, { useState } from 'react';
import { $loading } from '@/utils/loading';
import { Button } from '@/components/common';

const LoadingExampleComponent: React.FC = () => {
  const [data, setData] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  // 1. 버튼 클릭으로 로딩 제어
  const handleSimpleLoading = () => {
    $loading.show({ text: '간단한 로딩 테스트...' });

    setTimeout(() => {
      $loading.hide();
      setMessage('로딩 완료!');
    }, 2000);
  };

  // 2. API 호출과 함께 사용
  const handleFetchData = async () => {
    try {
      const result = await $loading.with(
        // 실제 API 호출을 시뮬레이션
        fetch('/api/data').then((res) => res.json()),
        {
          text: '데이터를 가져오는 중...',
          bodyLock: true,
        }
      );

      setData(result);
      setMessage('데이터 로드 성공!');
    } catch (error) {
      setMessage(
        '데이터 로드 실패: ' +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  // 3. 폼 제출과 함께 사용
  const handleFormSubmit = async (formData: FormData) => {
    try {
      await $loading.with(submitForm(formData), {
        text: '양식을 제출하는 중...',
        onShow: () => setMessage('제출 시작...'),
        onHide: () => setMessage('제출 완료!'),
      });
    } catch (error) {
      setMessage(
        '제출 실패: ' + (error instanceof Error ? error.message : String(error))
      );
    }
  };

  // 4. 파일 업로드 예시
  const handleFileUpload = async (file: File) => {
    const uploadProgress = (progress: number) => {
      $loading.show({
        text: `파일 업로드 중... ${progress}%`,
      });
    };

    try {
      await uploadFile(file, uploadProgress);
      $loading.hide();
      setMessage('파일 업로드 완료!');
    } catch (error) {
      $loading.hide();
      setMessage(
        '업로드 실패: ' +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  // 5. 조건부 로딩
  const handleConditionalOperation = async (needsLoading: boolean) => {
    if (needsLoading) {
      $loading.show({ text: '조건부 작업 수행 중...' });
    }

    try {
      await performOperation();
      setMessage('작업 완료!');
    } finally {
      if (needsLoading) {
        $loading.hide();
      }
    }
  };

  // 6. 순차적 작업들
  const handleMultiStepProcess = async () => {
    try {
      // 1단계
      $loading.show({ text: '1/3 단계: 초기화 중...' });
      await step1();

      // 2단계
      $loading.show({ text: '2/3 단계: 데이터 처리 중...' });
      await step2();

      // 3단계
      $loading.show({ text: '3/3 단계: 마무리 중...' });
      await step3();

      $loading.hide();
      setMessage('모든 단계 완료!');
    } catch (error) {
      $loading.hide();
      setMessage(
        '처리 실패: ' + (error instanceof Error ? error.message : String(error))
      );
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>$loading 사용 예시</h2>

      <div style={{ marginBottom: '1rem' }}>
        <Button onClick={handleSimpleLoading} className="primary">
          간단한 로딩 테스트
        </Button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <Button onClick={handleFetchData} className="primary">
          데이터 가져오기 (with API)
        </Button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <Button
          onClick={() => handleConditionalOperation(true)}
          className="primary"
        >
          조건부 로딩 (true)
        </Button>
        <Button
          onClick={() => handleConditionalOperation(false)}
          className="line"
        >
          조건부 로딩 (false)
        </Button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <Button onClick={handleMultiStepProcess} className="primary">
          다단계 작업
        </Button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <Button
          onClick={() => {
            const isLoading = $loading.get();
            alert(`현재 로딩 상태: ${isLoading}`);
          }}
          className="line"
        >
          현재 상태 확인
        </Button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <Button
          onClick={() => $loading.toggle({ text: '토글된 로딩...' })}
          className="line"
        >
          로딩 상태 토글
        </Button>
      </div>

      {message && (
        <div
          style={{
            padding: '1rem',
            marginTop: '1rem',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
          }}
        >
          메시지: {message}
        </div>
      )}

      {data.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>로드된 데이터:</h3>
          <ul>
            {data.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// 헬퍼 함수들 (실제 구현에서는 실제 API 호출로 대체)
const submitForm = (formData: FormData): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
};

const uploadFile = (
  file: File,
  onProgress: (progress: number) => void
): Promise<void> => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      onProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        resolve();
      }
    }, 200);
  });
};

const performOperation = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });
};

const step1 = (): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

const step2 = (): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, 1500));
};

const step3 = (): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, 800));
};

export default LoadingExampleComponent;
