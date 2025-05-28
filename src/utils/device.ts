// src/utils/device.ts
// 디바이스 및 브라우저 감지 유틸리티

// 디바이스 타입 정의
export type DeviceType = 'pc' | 'tablet' | 'mobile';

// 브라우저 타입 정의 (PC용)
export type BrowserType =
  | 'chrome'
  | 'firefox'
  | 'safari'
  | 'edge'
  | 'opera'
  | 'ie'
  | 'unknown';

// 모바일 OS 타입 정의
export type MobileOSType = 'ios' | 'android' | 'unknown';

// 디바이스 정보 인터페이스
export interface DeviceInfo {
  type: DeviceType;
  browser?: BrowserType; // PC일 때만 사용
  os?: MobileOSType; // mobile/tablet일 때만 사용
  userAgent: string;
  isTouch: boolean;
  screenWidth: number;
  screenHeight: number;
}

// 브레이크포인트 설정 (ant-design 기준 참고)
export const BREAKPOINTS = {
  mobile: 576,
  tablet: 768,
  desktop: 992,
  large: 1200,
  xl: 1600,
} as const;

/**
 * User Agent를 기반으로 브라우저 타입을 감지합니다.
 * @param userAgent - navigator.userAgent 문자열
 * @returns BrowserType
 */
export function detectBrowser(userAgent: string): BrowserType {
  const ua = userAgent.toLowerCase();

  // Internet Explorer
  if (ua.includes('msie') || ua.includes('trident')) {
    return 'ie';
  }

  // Microsoft Edge
  if (ua.includes('edg/') || ua.includes('edge')) {
    return 'edge';
  }

  // Opera
  if (ua.includes('opr/') || ua.includes('opera')) {
    return 'opera';
  }

  // Chrome (Edge와 Opera 체크 후에 확인해야 함)
  if (ua.includes('chrome') && !ua.includes('edg') && !ua.includes('opr')) {
    return 'chrome';
  }

  // Firefox
  if (ua.includes('firefox')) {
    return 'firefox';
  }

  // Safari (Chrome 체크 후에 확인해야 함)
  if (ua.includes('safari') && !ua.includes('chrome')) {
    return 'safari';
  }

  return 'unknown';
}

/**
 * User Agent를 기반으로 모바일 OS를 감지합니다.
 * @param userAgent - navigator.userAgent 문자열
 * @returns MobileOSType
 */
export function detectMobileOS(userAgent: string): MobileOSType {
  const ua = userAgent.toLowerCase();

  // iOS 감지
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    return 'ios';
  }

  // Android 감지
  if (ua.includes('android')) {
    return 'android';
  }

  return 'unknown';
}

/**
 * 터치 디바이스인지 확인합니다.
 * @returns boolean
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    ((navigator as unknown as { msMaxTouchPoints?: number }).msMaxTouchPoints ?? 0) > 0
  );
}

/**
 * 화면 크기를 기반으로 디바이스 타입을 감지합니다.
 * @param width - 화면 너비 (기본값: window.innerWidth)
 * @returns DeviceType
 */
export function detectDeviceByScreenSize(width?: number): DeviceType {
  const screenWidth =
    width ?? (typeof window !== 'undefined' ? window.innerWidth : 1200);
  if (screenWidth < BREAKPOINTS.mobile) {
    return 'mobile';
  }

  if (screenWidth < BREAKPOINTS.tablet) {
    return 'mobile';
  }

  if (screenWidth < BREAKPOINTS.desktop) {
    return 'tablet';
  }

  return 'pc';
}

/**
 * User Agent와 화면 크기를 종합하여 디바이스 타입을 정확히 감지합니다.
 * @param userAgent - navigator.userAgent 문자열
 * @param screenWidth - 화면 너비
 * @returns DeviceType
 */
export function detectDeviceType(
  userAgent?: string,
  screenWidth?: number
): DeviceType {
  const ua = (
    userAgent ?? (typeof navigator !== 'undefined' ? navigator.userAgent : '')
  ).toLowerCase();
  const width =
    screenWidth ?? (typeof window !== 'undefined' ? window.innerWidth : 1200);

  // 명확한 모바일 디바이스 식별자가 있는 경우
  const mobileKeywords = [
    'mobile',
    'android',
    'iphone',
    'ipod',
    'blackberry',
    'windows phone',
    'webos',
  ];

  const isDefinitelyMobile = mobileKeywords.some((keyword) =>
    ua.includes(keyword)
  );

  if (isDefinitelyMobile) {
    return 'mobile';
  }

  // iPad나 태블릿 식별자가 있는 경우
  const tabletKeywords = ['ipad', 'tablet'];
  const isDefinitelyTablet = tabletKeywords.some((keyword) =>
    ua.includes(keyword)
  );

  if (isDefinitelyTablet) {
    return 'tablet';
  }

  // User Agent로 명확히 구분되지 않는 경우 화면 크기로 판단
  return detectDeviceByScreenSize(width);
}

/**
 * 현재 디바이스의 상세 정보를 가져옵니다.
 * @returns DeviceInfo
 */
export function getDeviceInfo(): DeviceInfo {
  // 서버 사이드 렌더링 호환성을 위한 기본값 설정
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const deviceType = detectDeviceType(userAgent, screenWidth);
  const isTouch = isTouchDevice();

  const deviceInfo: DeviceInfo = {
    type: deviceType,
    userAgent,
    isTouch,
    screenWidth,
    screenHeight,
  };

  // PC인 경우 브라우저 정보 추가
  if (deviceType === 'pc') {
    deviceInfo.browser = detectBrowser(userAgent);
  }

  // 모바일이나 태블릿인 경우 OS 정보 추가
  if (deviceType === 'mobile' || deviceType === 'tablet') {
    deviceInfo.os = detectMobileOS(userAgent);
  }

  return deviceInfo;
}

/**
 * 특정 디바이스 타입인지 확인합니다.
 * @param targetType - 확인할 디바이스 타입
 * @returns boolean
 */
export function isDeviceType(targetType: DeviceType): boolean {
  return getDeviceInfo().type === targetType;
}

/**
 * PC 환경인지 확인합니다.
 * @returns boolean
 */
export function isPC(): boolean {
  return isDeviceType('pc');
}

/**
 * 태블릿 환경인지 확인합니다.
 * @returns boolean
 */
export function isTablet(): boolean {
  return isDeviceType('tablet');
}

/**
 * 모바일 환경인지 확인합니다.
 * @returns boolean
 */
export function isMobile(): boolean {
  return isDeviceType('mobile');
}

/**
 * 모바일 또는 태블릿 환경인지 확인합니다.
 * @returns boolean
 */
export function isMobileDevice(): boolean {
  const deviceType = getDeviceInfo().type;
  return deviceType === 'mobile' || deviceType === 'tablet';
}

/**
 * 특정 브라우저인지 확인합니다. (PC 환경에서만 유효)
 * @param targetBrowser - 확인할 브라우저 타입
 * @returns boolean
 */
export function isBrowser(targetBrowser: BrowserType): boolean {
  const deviceInfo = getDeviceInfo();
  return deviceInfo.type === 'pc' && deviceInfo.browser === targetBrowser;
}

/**
 * 특정 모바일 OS인지 확인합니다. (모바일/태블릿 환경에서만 유효)
 * @param targetOS - 확인할 OS 타입
 * @returns boolean
 */
export function isMobileOS(targetOS: MobileOSType): boolean {
  const deviceInfo = getDeviceInfo();
  return (
    (deviceInfo.type === 'mobile' || deviceInfo.type === 'tablet') &&
    deviceInfo.os === targetOS
  );
}

/**
 * iOS 디바이스인지 확인합니다.
 * @returns boolean
 */
export function isIOS(): boolean {
  return isMobileOS('ios');
}

/**
 * Android 디바이스인지 확인합니다.
 * @returns boolean
 */
export function isAndroid(): boolean {
  return isMobileOS('android');
}

/**
 * 디바이스 정보를 읽기 쉬운 문자열로 반환합니다.
 * @returns string
 */
export function getDeviceDescription(): string {
  const info = getDeviceInfo();

  let description = info.type.toUpperCase();

  if (info.browser) {
    description += ` - ${info.browser.toUpperCase()}`;
  }

  if (info.os) {
    description += ` - ${info.os.toUpperCase()}`;
  }

  if (info.isTouch) {
    description += ' (Touch)';
  }

  description += ` [${info.screenWidth}x${info.screenHeight}]`;

  return description;
}

// 상수로 현재 디바이스 정보 제공 (초기화 시점의 정보)
// 서버 사이드 렌더링에서는 지연 로딩
export const CURRENT_DEVICE =
  typeof window !== 'undefined'
    ? getDeviceInfo()
    : {
        type: 'pc' as DeviceType,
        browser: 'unknown' as BrowserType,
        userAgent: '',
        isTouch: false,
        screenWidth: 1200,
        screenHeight: 800,
      };

// 자주 사용되는 브라우저 체크 함수들
export const isChrome = (): boolean => isBrowser('chrome');
export const isFirefox = (): boolean => isBrowser('firefox');
export const isSafari = (): boolean => isBrowser('safari');
export const isEdge = (): boolean => isBrowser('edge');
export const isOpera = (): boolean => isBrowser('opera');
export const isIE = (): boolean => isBrowser('ie');
