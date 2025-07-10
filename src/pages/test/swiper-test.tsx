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

export default function App() {
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);
  const [appendNumber, setAppendNumber] = useState(4);
  const [prependNumber, setPrependNumber] = useState(1);
  const [slides, setSlides] = useState(['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4']);
  
  // MutationObserver 관련 상태
  const mutationObserverRef = useRef<MutationObserver | null>(null);
  const pendingSlideToRef = useRef<number | null>(null);
  const swiperContainerRef = useRef<HTMLDivElement | null>(null);

  // 컴포넌트가 렌더링되는지 확인
  console.log('SwiperTest component rendered');

  // MutationObserver 설정
  const setupMutationObserver = useCallback(() => {
    if (!swiperRef || !swiperContainerRef.current) return;

    // 기존 Observer 정리
    if (mutationObserverRef.current) {
      mutationObserverRef.current.disconnect();
    }

    // 새 Observer 생성
    mutationObserverRef.current = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.target) {
          // swiper-wrapper에서 슬라이드가 추가/제거되었는지 확인
          const target = mutation.target as Element;
          if (target.classList.contains('swiper-wrapper')) {
            shouldUpdate = true;
            console.log('MutationObserver: Slides changed detected');
          }
        }
      });

      if (shouldUpdate && pendingSlideToRef.current !== null) {
        console.log('MutationObserver: Executing slideTo', pendingSlideToRef.current);
        
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

    // swiper-wrapper 관찰 시작
    const swiperWrapper = swiperContainerRef.current.querySelector('.swiper-wrapper');
    if (swiperWrapper) {
      mutationObserverRef.current.observe(swiperWrapper, {
        childList: true,
        subtree: true
      });
      console.log('MutationObserver: Started observing swiper-wrapper');
    }
  }, [swiperRef]);

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
      
      // MutationObserver 설정
      setupMutationObserver();
    }
  }, [swiperRef, setupMutationObserver]);

  // 컴포넌트 언마운트 시 Observer 정리
  useEffect(() => {
    return () => {
      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect();
      }
    };
  }, []);

  // onSwiper 콜백을 별도 함수로 분리해서 디버깅
  const handleSwiperInit = (swiper: SwiperType) => {
    console.log('handleSwiperInit called with:', swiper);
    console.log('Swiper type:', typeof swiper);
    console.log('Swiper constructor:', swiper.constructor.name);
    
    setSwiperRef(swiper);
  };

  // MutationObserver를 활용한 부드러운 prepend
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

  const prependWithState = () => {
    if (!swiperRef) return;

    const currentActiveIndex = swiperRef.activeIndex;
    const newPrependNumber = prependNumber - 1;
    const newSlides = [`Slide ${newPrependNumber}`, ...slides];
    
    setSlides(newSlides);
    setPrependNumber(newPrependNumber);
    
    if (typeof swiperRef.update === 'function' && typeof swiperRef.slideTo === 'function') {
      setTimeout(() => {
        swiperRef.update();
        const newActiveIndex = currentActiveIndex + 1;
        setTimeout(() => {
          swiperRef.slideTo(newActiveIndex, 0);
        }, 10);
      }, 0);
    }
  };

  // append는 인덱스 조정이 필요 없으므로 MutationObserver 없이도 부드러움
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

  // Remove도 MutationObserver 활용
  const removeFirstSlideWithMutationObserver = () => {
    if (slides.length <= 1 || !swiperRef) return;
    
    const currentActiveIndex = swiperRef.activeIndex;
    const newActiveIndex = Math.max(0, currentActiveIndex - 1);
    pendingSlideToRef.current = newActiveIndex;
    
    const newSlides = slides.slice(1);
    setSlides(newSlides);
  };

  const removeLastSlideWithMutationObserver = () => {
    if (slides.length <= 1 || !swiperRef) return;
    
    const currentActiveIndex = swiperRef.activeIndex;
    const newSlides = slides.slice(0, -1);
    const maxIndex = newSlides.length - 1;
    const newActiveIndex = Math.min(currentActiveIndex, maxIndex);
    
    if (newActiveIndex !== currentActiveIndex) {
      pendingSlideToRef.current = newActiveIndex;
    }
    
    setSlides(newSlides);
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
      <h4>Debug Info:</h4>
      <p>Swiper Ref Available: {swiperRef ? 'Yes' : 'No'}</p>
      <p>MutationObserver Active: {mutationObserverRef.current ? 'Yes' : 'No'}</p>
      <p>Pending SlideTo Index: {pendingSlideToRef.current}</p>
      <p>Current Slide Info: {getCurrentSlideInfo()}</p>
      <p>Current Prepend Number: {prependNumber}</p>
      <p>Current Append Number: {appendNumber}</p>
      <p>Total Slides: {slides.length}</p>
      <p>Slides: {slides.join(', ')}</p>
    </div>
  );

  return (
    <>
      <div style={{ padding: '20px' }}>
        <h2>Swiper Test - MutationObserver 방식 (깜빡임 개선)</h2>
        
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
          <h3>MutationObserver 방식 (깜빡임 개선)</h3>
          <button onClick={prepend2WithMutationObserver} className="prepend-2-slides">
            Prepend 2 Slides (MutationObserver)
          </button>
          <button onClick={prependWithMutationObserver} className="prepend-slide">
            Prepend Slide (MutationObserver)
          </button>
          <button onClick={appendWithState} className="append-slide">
            Append Slide
          </button>
          <button onClick={append2WithState} className="append-2-slides">
            Append 2 Slides
          </button>
          
          <h3>Remove Methods (MutationObserver)</h3>
          <button onClick={removeFirstSlideWithMutationObserver} style={{ backgroundColor: '#ff6b6b', color: 'white' }}>
            Remove First Slide (MutationObserver)
          </button>
          <button onClick={removeLastSlideWithMutationObserver} style={{ backgroundColor: '#ff6b6b', color: 'white', marginLeft: '10px' }}>
            Remove Last Slide (MutationObserver)
          </button>
          
          <h3>기존 방법 (비교용)</h3>
          <button onClick={prepend2WithState} className="prepend-2-slides">
            Prepend 2 Slides (기존)
          </button>
          <button onClick={prependWithState} className="prepend-slide">
            Prepend Slide (기존)
          </button>
        </div>

        {renderDebugInfo()}
      </div>
    </>
  );
}