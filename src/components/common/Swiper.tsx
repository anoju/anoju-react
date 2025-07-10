// src/components/common/Swiper.tsx
import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  ReactNode,
  ReactElement,
} from 'react';
import { Swiper as SwiperCore, SwiperSlide } from 'swiper/react';
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectFade,
  EffectCube,
  EffectCoverflow,
  EffectCards,
  Thumbs,
  FreeMode,
} from 'swiper/modules';
import type { SwiperModule } from 'swiper/types';

// Swiper CSS 임포트
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-cube';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-cards';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

import type {
  Swiper as SwiperType,
  SwiperOptions,
  AutoplayOptions,
  PaginationOptions,
  NavigationOptions,
} from 'swiper/types';

import styles from '@/assets/scss/components/swiper.module.scss';

// Preset 타입 정의
export type SwiperPreset =
  | 'basic'
  | 'autoplay'
  | 'card'
  | 'banner'
  | 'gallery'
  | 'thumbs'
  | 'fade'
  | 'cube'
  | 'coverflow'
  | 'cards';

// 반응형 설정 타입
interface ResponsiveSettings {
  [key: number]: Partial<SwiperOptions>;
}

// 메인 Swiper Props
export interface SwiperProps {
  children: ReactNode;

  // Preset 설정
  preset?: SwiperPreset;

  // 기본 설정
  slidesPerView?: number | 'auto';
  spaceBetween?: number;
  loop?: boolean;
  centeredSlides?: boolean;
  initialSlide?: number;
  allowTouchMove?: boolean;
  autoHeight?: boolean;

  // 자동재생
  autoplay?: boolean | AutoplayOptions;

  // 네비게이션 & 페이지네이션
  navigation?: boolean | NavigationOptions;
  pagination?: boolean | PaginationOptions;

  // 이펙트
  effect?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'cards';

  // 반응형
  responsive?: ResponsiveSettings;

  // 썸네일 연동
  thumbsSwiper?: SwiperType | null;

  // 스타일
  className?: string;
  wrapperClassName?: string;
  slideClassName?: string;

  // 이벤트 핸들러
  onSlideChange?: (swiper: SwiperType) => void;
  onSlideChangeTransitionEnd?: (swiper: SwiperType) => void; // 추가
  onSwiper?: (swiper: SwiperType) => void;
  onReachEnd?: (swiper: SwiperType) => void;
  onReachBeginning?: (swiper: SwiperType) => void;

  // 고급 설정 (직접 swiper 옵션 전달)
  swiperOptions?: Partial<SwiperOptions>;
}

// Swiper 인스턴스 ref 타입
export interface SwiperRef {
  swiper: SwiperType | null;
  slideTo: (index: number, speed?: number) => void;
  slideNext: () => void;
  slidePrev: () => void;
  update: () => void;
}

// Preset 설정 함수
const getPresetOptions = (preset: SwiperPreset): Partial<SwiperOptions> => {
  const presets: Record<SwiperPreset, Partial<SwiperOptions>> = {
    basic: {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: false,
    },
    autoplay: {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
    },
    card: {
      slidesPerView: 'auto',
      spaceBetween: 20,
      centeredSlides: true,
      loop: true,
    },
    banner: {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        clickable: true,
      },
    },
    gallery: {
      slidesPerView: 3,
      spaceBetween: 10,
      navigation: true,
      pagination: {
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
      },
    },
    thumbs: {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    },
    fade: {
      slidesPerView: 1,
      spaceBetween: 0,
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
    },
    cube: {
      slidesPerView: 1,
      spaceBetween: 0,
      effect: 'cube',
      cubeEffect: {
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94,
      },
    },
    coverflow: {
      slidesPerView: 3,
      spaceBetween: 0,
      centeredSlides: true,
      effect: 'coverflow',
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
    },
    cards: {
      slidesPerView: 1,
      spaceBetween: 0,
      effect: 'cards',
      cardsEffect: {
        slideShadows: true,
        // transformEl 제거 (최신 버전에서 지원하지 않음)
      },
    },
  };

  return presets[preset] || presets.basic;
};

// 필요한 모듈들을 자동으로 결정
const getRequiredModules = (
  options: Partial<SwiperOptions>,
  navigation?: boolean | NavigationOptions,
  pagination?: boolean | PaginationOptions,
  autoplay?: boolean | AutoplayOptions,
  effect?: string
): SwiperModule[] => {
  const modules: SwiperModule[] = [];

  if (navigation || options.navigation) {
    modules.push(Navigation);
  }

  if (pagination || options.pagination) {
    modules.push(Pagination);
  }

  if (autoplay || options.autoplay) {
    modules.push(Autoplay);
  }

  if (options.thumbs) {
    modules.push(Thumbs);
  }

  if (options.freeMode) {
    modules.push(FreeMode);
  }

  // 이펙트별 모듈 추가
  switch (effect || options.effect) {
    case 'fade':
      modules.push(EffectFade);
      break;
    case 'cube':
      modules.push(EffectCube);
      break;
    case 'coverflow':
      modules.push(EffectCoverflow);
      break;
    case 'cards':
      modules.push(EffectCards);
      break;
  }

  return modules;
};

// 메인 Swiper 컴포넌트
export const Swiper = forwardRef<SwiperRef, SwiperProps>(
  (
    {
      children,
      preset,
      slidesPerView,
      spaceBetween,
      loop,
      centeredSlides,
      initialSlide,
      allowTouchMove,
      autoHeight,
      autoplay,
      navigation,
      pagination,
      effect,
      responsive,
      thumbsSwiper,
      className = '',
      wrapperClassName = '',
      slideClassName = '',
      onSlideChange,
      onSlideChangeTransitionEnd, // 추가
      onSwiper,
      onReachEnd,
      onReachBeginning,
      swiperOptions = {},
    },
    ref
  ) => {
    const swiperRef = useRef<SwiperType | null>(null);

    // ref 인터페이스 구현
    useImperativeHandle(ref, () => ({
      swiper: swiperRef.current,
      slideTo: (index: number, speed?: number) => {
        swiperRef.current?.slideTo(index, speed);
      },
      slideNext: () => {
        swiperRef.current?.slideNext();
      },
      slidePrev: () => {
        swiperRef.current?.slidePrev();
      },
      update: () => {
        swiperRef.current?.update();
      },
    }));

    // preset이 있으면 preset 옵션을 기본으로 사용
    const presetOptions = preset ? getPresetOptions(preset) : {};

    // 최종 swiper 설정 병합 (우선순위: swiperOptions > props > preset)
    const finalOptions: SwiperOptions = {
      ...presetOptions,
      ...(slidesPerView !== undefined && { slidesPerView }),
      ...(spaceBetween !== undefined && { spaceBetween }),
      ...(loop !== undefined && { loop }),
      ...(centeredSlides !== undefined && { centeredSlides }),
      ...(initialSlide !== undefined && { initialSlide }),
      ...(allowTouchMove !== undefined && { allowTouchMove }),
      ...(autoHeight !== undefined && { autoHeight }),
      ...(effect && { effect }),
      ...(thumbsSwiper && { thumbs: { swiper: thumbsSwiper } }),
      ...swiperOptions,
    };

    // 반응형 설정 병합
    if (responsive) {
      finalOptions.breakpoints = {
        ...finalOptions.breakpoints,
        ...responsive,
      };
    }

    // 자동재생 설정
    if (autoplay) {
      if (typeof autoplay === 'boolean') {
        finalOptions.autoplay = {
          delay: 3000,
          disableOnInteraction: false,
        };
      } else {
        finalOptions.autoplay = autoplay;
      }
    }

    // 네비게이션 설정
    if (navigation) {
      if (typeof navigation === 'boolean') {
        finalOptions.navigation = {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        };
      } else {
        finalOptions.navigation = navigation;
      }
    }

    // 페이지네이션 설정
    if (pagination) {
      if (typeof pagination === 'boolean') {
        finalOptions.pagination = {
          el: '.swiper-pagination',
          clickable: true,
        };
      } else {
        finalOptions.pagination = pagination;
      }
    }

    // 필요한 모듈들 결정
    const modules = getRequiredModules(
      finalOptions,
      navigation,
      pagination,
      autoplay,
      effect
    );

    // Swiper 이벤트 핸들러
    const handleSwiper = (swiper: SwiperType) => {
      swiperRef.current = swiper;
      onSwiper?.(swiper);
    };

    // 클래스명 조합
    const swiperClassName = [
      styles.swiper,
      preset && styles[`preset-${preset}`],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={`${styles['swiper-container']} ${wrapperClassName}`}>
        <SwiperCore
          {...finalOptions}
          modules={modules}
          className={swiperClassName}
          onSwiper={handleSwiper}
          onSlideChange={onSlideChange}
          onSlideChangeTransitionEnd={onSlideChangeTransitionEnd} // 추가
          onReachEnd={onReachEnd}
          onReachBeginning={onReachBeginning}
        >
          {React.Children.map(children, (child) => {
            if (
              React.isValidElement<{ className?: string }>(child) &&
              child.type === SwiperSlide
            ) {
              // SwiperSlide인 경우 slideClassName 추가
              return React.cloneElement(
                child as ReactElement<{ className?: string }>,
                {
                  className:
                    `${child.props.className || ''} ${slideClassName}`.trim(),
                }
              );
            }
            // SwiperSlide가 아닌 경우 SwiperSlide로 감싸기
            return (
              <SwiperSlide className={slideClassName}>{child}</SwiperSlide>
            );
          })}

          {/* 네비게이션 버튼 */}
          {navigation && (
            <>
              <div className="swiper-button-prev"></div>
              <div className="swiper-button-next"></div>
            </>
          )}

          {/* 페이지네이션 */}
          {pagination && <div className="swiper-pagination"></div>}
        </SwiperCore>
      </div>
    );
  }
);

Swiper.displayName = 'Swiper';

// SwiperSlide re-export
export { SwiperSlide };

// 기본 export
export default Swiper;
