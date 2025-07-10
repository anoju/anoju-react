import { useState, useEffect } from 'react';
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

  // 컴포넌트가 렌더링되는지 확인
  console.log('SwiperTest component rendered');

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
      
      // Swiper 인스턴스의 모든 속성 확인
      console.log('All Swiper properties:', Object.getOwnPropertyNames(swiperRef));
      console.log('Swiper prototype methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(swiperRef)));
    }
  }, [swiperRef]);

  // onSwiper 콜백을 별도 함수로 분리해서 디버깅
  const handleSwiperInit = (swiper: SwiperType) => {
    console.log('handleSwiperInit called with:', swiper);
    console.log('Swiper type:', typeof swiper);
    console.log('Swiper constructor:', swiper.constructor.name);
    
    // 약간의 지연 후 다시 확인 (초기화가 완료될 때까지 기다림)
    setTimeout(() => {
      console.log('Delayed check - Swiper methods:', {
        prependSlide: typeof swiper.prependSlide,
        appendSlide: typeof swiper.appendSlide,
        removeSlide: typeof swiper.removeSlide
      });
    }, 100);
    
    setSwiperRef(swiper);
  };

  // 방법 1: Swiper API 메서드 사용 (문제가 있을 때)
  const prepend2WithAPI = () => {
    console.log('prepend2WithAPI called');
    console.log('swiperRef:', swiperRef);
    
    if (!swiperRef) {
      console.error('swiperRef is null');
      return;
    }

    // prependSlide가 없다면 대안 방법 사용
    if (typeof swiperRef.prependSlide !== 'function') {
      console.log('prependSlide not available, using state method');
      prepend2WithState();
      return;
    }

    try {
      // 현재 활성 슬라이드 인덱스 저장
      const currentActiveIndex = swiperRef.activeIndex;
      console.log('Current active index before prepend:', currentActiveIndex);

      const newPrependNumber1 = prependNumber - 1;
      const newPrependNumber2 = prependNumber - 2;
      
      const slidesHTML = [
        `<div class="swiper-slide">Slide ${newPrependNumber2}</div>`,
        `<div class="swiper-slide">Slide ${newPrependNumber1}</div>`,
      ];
      
      console.log('Slides to prepend:', slidesHTML);
      
      swiperRef.prependSlide(slidesHTML);
      setPrependNumber(newPrependNumber2);
      
      // 추가된 슬라이드 개수만큼 인덱스를 조정해서 원래 활성 슬라이드 유지
      const newActiveIndex = currentActiveIndex + 2; // 2개 슬라이드를 앞에 추가했으므로
      console.log('Moving to new active index:', newActiveIndex);
      
      // 약간의 지연 후 slideTo 실행 (DOM 업데이트 완료 후)
      setTimeout(() => {
        swiperRef.slideTo(newActiveIndex, 0); // 0은 애니메이션 없이 즉시 이동
      }, 10);
      
      console.log('prependSlide executed successfully');
    } catch (error) {
      console.error('Error in prependSlide:', error);
      // fallback to state method
      prepend2WithState();
    }
  };

  // 방법 2: React State 관리 (권장 방법)
  const prepend2WithState = () => {
    console.log('prepend2WithState called');
    
    if (!swiperRef) {
      console.error('swiperRef is null');
      return;
    }

    // 현재 활성 슬라이드 인덱스 저장
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
    
    // Swiper가 변경사항을 인지하도록 update 호출 후 원래 위치로 이동
    if (typeof swiperRef.update === 'function' && typeof swiperRef.slideTo === 'function') {
      setTimeout(() => {
        swiperRef.update();
        
        // 추가된 슬라이드 개수만큼 인덱스를 조정해서 원래 활성 슬라이드 유지
        const newActiveIndex = currentActiveIndex + 2; // 2개 슬라이드를 앞에 추가했으므로
        console.log('Moving to new active index:', newActiveIndex);
        
        // 약간의 지연 후 이동 (update 완료 후)
        setTimeout(() => {
          swiperRef.slideTo(newActiveIndex, 0); // 0은 애니메이션 없이 즉시 이동
        }, 10);
      }, 0);
    }
  };

  const prependWithState = () => {
    if (!swiperRef) return;

    // 현재 활성 슬라이드 인덱스 저장
    const currentActiveIndex = swiperRef.activeIndex;
    
    const newPrependNumber = prependNumber - 1;
    const newSlides = [`Slide ${newPrependNumber}`, ...slides];
    
    setSlides(newSlides);
    setPrependNumber(newPrependNumber);
    
    if (typeof swiperRef.update === 'function' && typeof swiperRef.slideTo === 'function') {
      setTimeout(() => {
        swiperRef.update();
        
        // 1개 슬라이드를 앞에 추가했으므로 +1
        const newActiveIndex = currentActiveIndex + 1;
        setTimeout(() => {
          swiperRef.slideTo(newActiveIndex, 0);
        }, 10);
      }, 0);
    }
  };

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

  // 슬라이드 제거 (State 방식) - 인덱스 조정 포함
  const removeFirstSlide = () => {
    if (slides.length <= 1 || !swiperRef) return;
    
    const currentActiveIndex = swiperRef.activeIndex;
    const newSlides = slides.slice(1);
    setSlides(newSlides);
    
    if (typeof swiperRef.update === 'function' && typeof swiperRef.slideTo === 'function') {
      setTimeout(() => {
        swiperRef.update();
        
        // 첫 번째 슬라이드를 제거했으므로 -1 (단, 0보다 작아지면 0으로)
        const newActiveIndex = Math.max(0, currentActiveIndex - 1);
        setTimeout(() => {
          swiperRef.slideTo(newActiveIndex, 0);
        }, 10);
      }, 0);
    }
  };

  const removeLastSlide = () => {
    if (slides.length <= 1 || !swiperRef) return;
    
    const currentActiveIndex = swiperRef.activeIndex;
    const newSlides = slides.slice(0, -1);
    setSlides(newSlides);
    
    if (typeof swiperRef.update === 'function' && typeof swiperRef.slideTo === 'function') {
      setTimeout(() => {
        swiperRef.update();
        
        // 마지막 슬라이드를 제거한 경우, 현재 인덱스가 범위를 벗어났는지 확인
        const maxIndex = newSlides.length - 1;
        const newActiveIndex = Math.min(currentActiveIndex, maxIndex);
        
        if (newActiveIndex !== currentActiveIndex) {
          setTimeout(() => {
            swiperRef.slideTo(newActiveIndex, 0);
          }, 10);
        }
      }, 0);
    }
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
      <p>Current Slide Info: {getCurrentSlideInfo()}</p>
      <p>Current Prepend Number: {prependNumber}</p>
      <p>Current Append Number: {appendNumber}</p>
      <p>Total Slides: {slides.length}</p>
      <p>Slides: {slides.join(', ')}</p>
      {swiperRef && (
        <>
          <p>prependSlide method: {typeof swiperRef.prependSlide}</p>
          <p>appendSlide method: {typeof swiperRef.appendSlide}</p>
          <p>slideTo method: {typeof swiperRef.slideTo}</p>
          <p>update method: {typeof swiperRef.update}</p>
        </>
      )}
    </div>
  );

  return (
    <>
      <div style={{ padding: '20px' }}>
        <h2>Swiper Test - Fixed Version with Active Index Preservation</h2>
        
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

        <div className="append-buttons">
          <h3>Swiper API Methods (문제가 있을 수 있음)</h3>
          <button onClick={prepend2WithAPI} className="prepend-2-slides">
            Prepend 2 Slides (API) - 활성 슬라이드 유지
          </button>
          
          <h3>React State Methods (권장) - 활성 슬라이드 유지</h3>
          <button onClick={prepend2WithState} className="prepend-2-slides">
            Prepend 2 Slides (State)
          </button>
          <button onClick={prependWithState} className="prepend-slide">
            Prepend Slide (State)
          </button>
          <button onClick={appendWithState} className="append-slide">
            Append Slide (State)
          </button>
          <button onClick={append2WithState} className="append-2-slides">
            Append 2 Slides (State)
          </button>
          
          <h3>Remove Methods - 활성 슬라이드 조정</h3>
          <button onClick={removeFirstSlide} style={{ backgroundColor: '#ff6b6b', color: 'white' }}>
            Remove First Slide
          </button>
          <button onClick={removeLastSlide} style={{ backgroundColor: '#ff6b6b', color: 'white', marginLeft: '10px' }}>
            Remove Last Slide
          </button>
        </div>

        {renderDebugInfo()}
      </div>
    </>
  );
}