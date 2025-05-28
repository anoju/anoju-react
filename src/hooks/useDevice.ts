// src/hooks/useDevice.ts
import { useState, useEffect, useCallback } from 'react';
import {
  getDeviceInfo,
  type DeviceInfo,
  type DeviceType,
  type BrowserType,
  type MobileOSType,
  BREAKPOINTS,
} from '@/utils/device';

// 디바이스 상태 인터페이스
export interface DeviceState extends DeviceInfo {
  // 추가적인 반응형 상태들
  isMobileSize: boolean;
  isTabletSize: boolean;
  isDesktopSize: boolean;
  isLargeSize: boolean;
  isXLSize: boolean;
  // 브라우저 호환성 관련
  isModernBrowser: boolean;
  isMobileDevice: boolean;
}

/**
 * 디바이스 정보와 화면 크기 변화를 추적하는 커스텀 훅
 * @param options - 설정 옵션
 * @returns DeviceState
 */
export function useDevice(options: {
  /** 리사이즈 이벤트의 디바운스 지연 시간 (ms) */
  debounceMs?: number;
  /** 초기 렌더링 시에만 감지하고 이후 업데이트하지 않음 */
  static?: boolean;
} = {}): DeviceState {
  const { debounceMs = 250, static: isStatic = false } = options;

  // 디바이스 상태 생성 함수
  const createDeviceState = useCallback((info: DeviceInfo): DeviceState => {
    const width = info.screenWidth;
    
    return {
      ...info,
      // 반응형 브레이크포인트 상태
      isMobileSize: width < BREAKPOINTS.mobile,
      isTabletSize: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.desktop,
      isDesktopSize: width >= BREAKPOINTS.desktop,
      isLargeSize: width >= BREAKPOINTS.large,
      isXLSize: width >= BREAKPOINTS.xl,
      // 브라우저 호환성
      isModernBrowser: info.browser !== 'ie',
      isMobileDevice: info.type === 'mobile' || info.type === 'tablet',
    };
  }, []);

  // 초기 디바이스 정보
  const [deviceState, setDeviceState] = useState<DeviceState>(() => {
    const info = getDeviceInfo();
    return createDeviceState(info);
  });

  // 디바이스 정보 업데이트 함수
  const updateDeviceInfo = useCallback(() => {
    const newInfo = getDeviceInfo();
    const newState = createDeviceState(newInfo);
    
    setDeviceState(prevState => {
      // 상태가 실제로 변경되었을 때만 업데이트
      if (
        prevState.type !== newState.type ||
        prevState.screenWidth !== newState.screenWidth ||
        prevState.screenHeight !== newState.screenHeight ||
        prevState.isTouch !== newState.isTouch
      ) {
        return newState;
      }
      return prevState;
    });
  }, [createDeviceState]);

  // 디바운스된 리사이즈 핸들러
  useEffect(() => {
    if (isStatic) return;

    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        updateDeviceInfo();
      }, debounceMs);
    };

    // 윈도우 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', handleResize, { passive: true });

    // orientation change 이벤트 리스너 등록 (모바일용)
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [updateDeviceInfo, debounceMs, isStatic]);

  return deviceState;
}

/**
 * 특정 디바이스 타입인지 확인하는 훅
 * @param targetType - 확인할 디바이스 타입
 * @returns boolean
 */
export function useIsDevice(targetType: DeviceType): boolean {
  const device = useDevice();
  return device.type === targetType;
}

/**
 * PC 환경인지 확인하는 훅
 * @returns boolean
 */
export function useIsPC(): boolean {
  return useIsDevice('pc');
}

/**
 * 태블릿 환경인지 확인하는 훅
 * @returns boolean
 */
export function useIsTablet(): boolean {
  return useIsDevice('tablet');
}

/**
 * 모바일 환경인지 확인하는 훅
 * @returns boolean
 */
export function useIsMobile(): boolean {
  return useIsDevice('mobile');
}

/**
 * 모바일 또는 태블릿 환경인지 확인하는 훅
 * @returns boolean
 */
export function useIsMobileDevice(): boolean {
  const device = useDevice();
  return device.isMobileDevice;
}

/**
 * 특정 브라우저인지 확인하는 훅 (PC 환경에서만 유효)
 * @param targetBrowser - 확인할 브라우저 타입
 * @returns boolean
 */
export function useIsBrowser(targetBrowser: BrowserType): boolean {
  const device = useDevice();
  return device.type === 'pc' && device.browser === targetBrowser;
}

/**
 * 특정 모바일 OS인지 확인하는 훅
 * @param targetOS - 확인할 OS 타입
 * @returns boolean
 */
export function useIsMobileOS(targetOS: MobileOSType): boolean {
  const device = useDevice();
  return device.isMobileDevice && device.os === targetOS;
}

/**
 * iOS 디바이스인지 확인하는 훅
 * @returns boolean
 */
export function useIsIOS(): boolean {
  return useIsMobileOS('ios');
}

/**
 * Android 디바이스인지 확인하는 훅
 * @returns boolean
 */
export function useIsAndroid(): boolean {
  return useIsMobileOS('android');
}

/**
 * 터치 디바이스인지 확인하는 훅
 * @returns boolean
 */
export function useIsTouch(): boolean {
  const device = useDevice();
  return device.isTouch;
}

/**
 * 현재 화면 크기 브레이크포인트를 반환하는 훅
 * @returns object
 */
export function useBreakpoint() {
  const device = useDevice();
  
  return {
    xs: device.isMobileSize,
    sm: device.isTabletSize,
    md: device.isDesktopSize,
    lg: device.isLargeSize,
    xl: device.isXLSize,
    // ant-design 스타일 별칭
    mobile: device.isMobileSize,
    tablet: device.isTabletSize,
    desktop: device.isDesktopSize,
    large: device.isLargeSize,
  };
}

/**
 * 미디어 쿼리를 JavaScript에서 사용할 수 있는 훅
 * @param query - CSS 미디어 쿼리 문자열
 * @returns boolean
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 최신 브라우저용
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
    
    // 구형 브라우저용 fallback
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, [query]);

  return matches;
}

/**
 * 브라우저별 특정 기능 지원 여부를 확인하는 훅
 * @returns object
 */
export function useBrowserSupport() {
  const device = useDevice();
  
  return {
    // CSS 기능 지원
    supportsGrid: CSS.supports('display', 'grid'),
    supportsFlexbox: CSS.supports('display', 'flex'),
    supportsCustomProperties: CSS.supports('--custom-property', 'value'),
    
    // JavaScript API 지원
    supportsIntersectionObserver: 'IntersectionObserver' in window,
    supportsResizeObserver: 'ResizeObserver' in window,
    supportsWebP: typeof window !== 'undefined' && 
      window.document.createElement('canvas').toDataURL('image/webp').indexOf('webp') > -1,
    
    // 브라우저별 특성
    isModernBrowser: device.isModernBrowser,
    requiresPolyfill: device.browser === 'ie',
    
    // 디바이스별 특성
    hasHover: !device.isMobileDevice,
    hasTouch: device.isTouch,
  };
}

// 자주 사용되는 브라우저 체크 훅들
export const useIsChrome = (): boolean => useIsBrowser('chrome');
export const useIsFirefox = (): boolean => useIsBrowser('firefox');
export const useIsSafari = (): boolean => useIsBrowser('safari');
export const useIsEdge = (): boolean => useIsBrowser('edge');
export const useIsOpera = (): boolean => useIsBrowser('opera');
export const useIsIE = (): boolean => useIsBrowser('ie');
