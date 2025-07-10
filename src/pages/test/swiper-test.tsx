import { useState, useEffect, useRef, useCallback } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './swiper-test.css';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';

// Performance memory interface 타입 정의
interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface PerformanceWithMemory extends Performance {
  memory?: PerformanceMemory;
}

export default function App() {
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);
  const [appendNumber, setAppendNumber] = useState(4);
  const [prependNumber, setPrependNumber] = useState(1);
  const [slides, setSlides] = useState(['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4']);
  
  // MutationObserver 관련 상태 (성능 최적화)
  const mutationObserverRef = useRef<MutationObserver | null>(null);
  const pendingSlideToRef = useRef<number | null>(null);
  const swiperContainerRef = useRef<HTMLDivElement | null>(null);
  const isObservingRef = useRef<boolean>(false);
  const observerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 컴포넌트가 렌더링되는지 확인
  console.log('SwiperTest component rendered');

  // Observer 중지 함수 (useCallback으로 메모이제이션)
  const stopObserver = useCallback(() => {
    if (mutationObserverRef.current && isObservingRef.current) {
      mutationObserverRef.current.disconnect();
      isObservingRef.current = false;
      console.log('MutationObserver: Stopped observing');
    }
  }, []);

  // 성능 최적화된 MutationObserver 설정
  const setupMutationObserver = useCallback(() => {
    if (!swiperRef || !swiperContainerRef.current || isObservingRef.current) return;

    // 기존 Observer 정리
    if (mutationObserverRef.current) {
      mutationObserverRef.current.disconnect();
    }

    // 성능 최적화된 Observer 생성
    mutationObserverRef.current = new MutationObserver((mutations) => {
      // 성능 최적화: 관련 없는 변경사항 필터링
      const relevantMutations = mutations.filter((mutation) => {
        if (mutation.type !== 'childList') return false;
        const target = mutation.target as Element;
        return target.classList.contains('swiper-wrapper');
      });

      if (relevantMutations.length === 0) return;

      console.log('MutationObserver: Relevant slides change detected');

      if (pendingSlideToRef.current !== null) {
        console.log('MutationObserver: Executing slideTo', pendingSlideToRef.current);
        
        // 즉시 Observer 비활성화 (불필요한 감지 방지)
        stopObserver();
        
        // DOM 변경이 완료된 후 즉시 slideTo 실행
        requestAnimationFrame(() => {
          if (swiperRef && pendingSlideToRef.current !== null) {
            swiperRef.update();
            swiperRef.slideTo(pendingSlideToRef.current, 0, false);
            pendingSlideToRef.current = null;
          }
        });
      }
    });

    // swiper-wrapper만 관찰 (성능 최적화)
    const swiperWrapper = swiperContainerRef.current.querySelector('.swiper-wrapper');
    if (swiperWrapper) {
      mutationObserverRef.current.observe(swiperWrapper, {
        childList: true,        // 자식 요소 추가/제거만 감지
        subtree: false,         // 하위 트리는 감지하지 않음 (성능 향상)
        attributes: false,      // 속성 변경 무시 (성능 향상)
        characterData: false    // 텍스트 변경 무시 (성능 향상)
      });
      
      isObservingRef.current = true;
      console.log('MutationObserver: Started observing (optimized)');
    }
  }, [swiperRef, stopObserver]); // stopObserver 의존성 추가

  // 일정 시간 후 자동으로 Observer 중지 (성능 보호)
  const startObserverWithTimeout = useCallback(() => {
    setupMutationObserver();
    
    // 기존 타임아웃 정리
    if (observerTimeoutRef.current) {
      clearTimeout(observerTimeoutRef.current);
    }
    
    // 5초 후 자동 중지 (성능 보호)
    observerTimeoutRef.current = setTimeout(() => {
      console.log('MutationObserver: Auto-stopped after timeout');
      stopObserver();
      pendingSlideToRef.current = null; // 대기 중인 작업도 취소
    }, 5000);
  }, [setupMutationObserver, stopObserver]); // 의존성 배열 수정

  // Swiper 인스턴스가 설정되었는지 확인
  useEffect(() => {
    console.log('Swiper instance changed:', swiperRef);
    if (swiperRef) {
      console.log('Swiper methods available:', {
        prependSlide: typeof swiperRef.prependSlide,
        appendSlide: typeof swiperRef.appendSlide,
        removeSlide: typeof swiperRef.removeSlide,
        slideTo: typeof swiperRef.slideTo,
        update: typeof swiperRef.update
      });
    }
  }, [swiperRef]);

  // 컴포넌트 언마운트 시 Observer 및 타임아웃 정리
  useEffect(() => {
    return () => {
      stopObserver();
      if (observerTimeoutRef.current) {
        clearTimeout(observerTimeoutRef.current);
      }
    };
  }, [stopObserver]);

  // onSwiper 콜백을 별도 함수로 분리해서 디버깅
  const handleSwiperInit = (swiper: SwiperType) => {
    console.log('handleSwiperInit called with:', swiper);
    setSwiperRef(swiper);
  };

  // 성능 최적화된 MutationObserver를 활용한 prepend
  const prepend2WithMutationObserver = () => {
    console.log('prepend2WithMutationObserver called');
    
    if (!swiperRef) {
      console.error('swiperRef is null');
      return;
    }

    // 현재 활성 슬라이드 인덱스 저장
    const currentActiveIndex = swiperRef.activeIndex;
    console.log('Current active index before prepend:', currentActiveIndex);
    
    // 새로운 인덱스 계산 및 저장
    const newActiveIndex = currentActiveIndex + 2;
    pendingSlideToRef.current = newActiveIndex;
    
    console.log('Pending slideTo index:', newActiveIndex);
    
    // Observer 시작 (필요할 때만)
    startObserverWithTimeout();
    
    const newPrependNumber1 = prependNumber - 1;
    const newPrependNumber2 = prependNumber - 2;
    
    const newSlides = [
      `Slide ${newPrependNumber2}`,
      `Slide ${newPrependNumber1}`,
      ...slides
    ];
    
    // 슬라이드 상태 업데이트 (MutationObserver가 감지할 것임)
    setSlides(newSlides);
    setPrependNumber(newPrependNumber2);
  };

  const prependWithMutationObserver = () => {
    if (!swiperRef) return;

    const currentActiveIndex = swiperRef.activeIndex;
    const newActiveIndex = currentActiveIndex + 1;
    pendingSlideToRef.current = newActiveIndex;
    
    // Observer 시작
    startObserverWithTimeout();
    
    const newPrependNumber = prependNumber - 1;
    const newSlides = [`Slide ${newPrependNumber}`, ...slides];
    
    setSlides(newSlides);
    setPrependNumber(newPrependNumber);
  };

  // 기존 방법 (비교용)
  const prepend2WithState = () => {
    console.log('prepend2WithState called');
    
    if (!swiperRef) {
      console.error('swiperRef is null');
      return;
    }

    const currentActiveIndex = swiperRef.activeIndex;
    console.log('Current active index before prepend:', currentActiveIndex);
    
    const newPrependNumber1 = prependNumber - 1;
    const newPrependNumber2 = prependNumber - 2;
    
    const newSlides = [
      `Slide ${newPrependNumber2}`,
      `Slide ${newPrependNumber1}`,
      ...slides
    ];
    
    setSlides(newSlides);
    setPrependNumber(newPrependNumber2);
    
    if (typeof swiperRef.update === 'function' && typeof swiperRef.slideTo === 'function') {
      setTimeout(() => {
        swiperRef.update();
        const newActiveIndex = currentActiveIndex + 2;
        console.log('Moving to new active index:', newActiveIndex);
        setTimeout(() => {
          swiperRef.slideTo(newActiveIndex, 0);
        }, 10);
      }, 0);
    }
  };

  // append는 인덱스 조정이 필요 없으므로 기존 방식 유지
  const appendWithState = () => {
    const newAppendNumber = appendNumber + 1;
    const newSlides = [...slides, `Slide ${newAppendNumber}`];
    
    setSlides(newSlides);
    setAppendNumber(newAppendNumber);
    
    if (swiperRef && typeof swiperRef.update === 'function') {
      setTimeout(() => {
        swiperRef.update();
      }, 0);
    }
  };

  const append2WithState = () => {
    const newAppendNumber1 = appendNumber + 1;
    const newAppendNumber2 = appendNumber + 2;
    
    const newSlides = [
      ...slides,
      `Slide ${newAppendNumber1}`,
      `Slide ${newAppendNumber2}`
    ];
    
    setSlides(newSlides);
    setAppendNumber(newAppendNumber2);
    
    if (swiperRef && typeof swiperRef.update === 'function') {
      setTimeout(() => {
        swiperRef.update();
      }, 0);
    }
  };

  // Remove도 MutationObserver 활용 (필요할 때만)
  const removeFirstSlideWithMutationObserver = () => {
    if (slides.length <= 1 || !swiperRef) return;
    
    const currentActiveIndex = swiperRef.activeIndex;
    const newActiveIndex = Math.max(0, currentActiveIndex - 1);
    pendingSlideToRef.current = newActiveIndex;
    
    startObserverWithTimeout();
    
    const newSlides = slides.slice(1);
    setSlides(newSlides);
  };

  // 성능 모니터링 함수 (타입 안전하게)
  const checkPerformance = () => {
    console.log('=== Performance Check ===');
    console.log('MutationObserver Active:', isObservingRef.current);
    console.log('Pending Operations:', pendingSlideToRef.current);
    console.log('Total Slides:', slides.length);
    console.log('Observer Instance:', mutationObserverRef.current ? 'Created' : 'Not Created');
    
    // Performance API 사용 (브라우저 지원 시) - 타입 안전하게
    const perfWithMemory = performance as PerformanceWithMemory;
    if (perfWithMemory.memory) {
      console.log('Memory Usage:', {
        used: Math.round(perfWithMemory.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
        total: Math.round(perfWithMemory.memory.totalJSHeapSize / 1024 / 1024) + 'MB',
        limit: Math.round(perfWithMemory.memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
      });
    } else {
      console.log('Memory API not supported in this browser');
    }
    
    // 추가 성능 정보
    console.log('Performance Timing:', {
      navigationStart: performance.timeOrigin,
      currentTime: performance.now()
    });
  };

  // 현재 활성 슬라이드 정보 표시
  const getCurrentSlideInfo = () => {
    if (!swiperRef) return 'N/A';
    return `Active Index: ${swiperRef.activeIndex}, Real Index: ${swiperRef.realIndex}`;
  };

  // 디버깅용 상태 정보 렌더링
  const renderDebugInfo = () => (
    <div style={{ 
      marginTop: '20px', 
      padding: '10px', 
      border: '1px solid #ccc', 
      backgroundColor: '#f9f9f9',
      fontSize: '14px'
    }}>
      <h4>Debug Info & Performance:</h4>
      <p>Swiper Ref Available: {swiperRef ? 'Yes' : 'No'}</p>
      <p>MutationObserver Status: 
        <span style={{ 
          color: isObservingRef.current ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {isObservingRef.current ? 'Active' : 'Inactive'}
        </span>
      </p>
      <p>Pending SlideTo Index: 
        <span style={{ 
          color: pendingSlideToRef.current !== null ? 'orange' : 'gray'
        }}>
          {pendingSlideToRef.current ?? 'None'}
        </span>
      </p>
      <p>Current Slide Info: {getCurrentSlideInfo()}</p>
      <p>Current Prepend Number: {prependNumber}</p>
      <p>Current Append Number: {appendNumber}</p>
      <p>Total Slides: {slides.length}</p>
      <p>Slides: {slides.join(', ')}</p>
      
      <button 
        onClick={checkPerformance}
        style={{ 
          marginTop: '10px', 
          padding: '5px 10px', 
          fontSize: '12px',
          backgroundColor: '#007aff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        성능 체크 (콘솔 확인)
      </button>
    </div>
  );

  return (
    <>
      <div style={{ padding: '20px' }}>
        <h2>Swiper Test - 성능 최적화된 MutationObserver</h2>
        
        <div ref={swiperContainerRef}>
          <Swiper
            onSwiper={handleSwiperInit}
            slidesPerView={3}
            centeredSlides={true}
            spaceBetween={30}
            pagination={{
              type: 'fraction',
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={`${slide}-${index}`}>
                {slide}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="append-buttons">
          <h3>성능 최적화된 MutationObserver 방식</h3>
          <button onClick={prepend2WithMutationObserver} className="prepend-2-slides">
            Prepend 2 Slides (Optimized)
          </button>
          <button onClick={prependWithMutationObserver} className="prepend-slide">
            Prepend Slide (Optimized)
          </button>
          <button onClick={appendWithState} className="append-slide">
            Append Slide
          </button>
          <button onClick={append2WithState} className="append-2-slides">
            Append 2 Slides
          </button>
          
          <h3>Remove Methods</h3>
          <button onClick={removeFirstSlideWithMutationObserver} style={{ backgroundColor: '#ff6b6b', color: 'white' }}>
            Remove First Slide (Optimized)
          </button>
          
          <h3>기존 방법 (비교용)</h3>
          <button onClick={prepend2WithState} className="prepend-2-slides">
            Prepend 2 Slides (기존)
          </button>
        </div>

        {renderDebugInfo()}
      </div>
    </>
  );
}