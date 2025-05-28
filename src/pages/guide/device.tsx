// src/pages/guide/device.tsx
import { useState, useEffect } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import {
  useDevice,
  useIsPC,
  useIsMobile,
  useIsTablet,
  useIsMobileDevice,
  useIsIOS,
  useIsAndroid,
  useIsChrome,
  useIsFirefox,
  useIsSafari,
  useIsEdge,
  useIsIE,
  useBreakpoint,
  useMediaQuery,
  useBrowserSupport,
} from '@/hooks/useDevice';
import {
  getDeviceInfo,
  getDeviceDescription,
  isPC,
  isMobile,
  isTablet,
  isMobileDevice,
  isIOS,
  isAndroid,
  isChrome,
  isFirefox,
  isSafari,
  isEdge,
  isIE,
} from '@/utils/device';
import { Button, CodeHighlight } from '@/components/common';
import styles from '@/assets/scss/pages/guide.module.scss';

const DeviceGuide = () => {
  usePageLayout({
    title: '디바이스 감지 / 유틸리티 가이드',
    rightButtons: (
      <>
        <Button to="/" size="sm">
          Home
        </Button>
      </>
    ),
  });

  // 현재 디바이스 정보
  const device = useDevice();
  const [staticDeviceInfo] = useState(() => getDeviceInfo());

  // 디바이스 타입 훅들
  const isPCHook = useIsPC();
  const isMobileHook = useIsMobile();
  const isTabletHook = useIsTablet();
  const isMobileDeviceHook = useIsMobileDevice();

  // OS 훅들
  const isIOSHook = useIsIOS();
  const isAndroidHook = useIsAndroid();

  // 브라우저 훅들
  const isChromeHook = useIsChrome();
  const isFirefoxHook = useIsFirefox();
  const isSafariHook = useIsSafari();
  const isEdgeHook = useIsEdge();
  const isIEHook = useIsIE();

  // 브레이크포인트 및 기타 훅들
  const breakpoints = useBreakpoint();
  const isLargeScreen = useMediaQuery('(min-width: 1200px)');
  const browserSupport = useBrowserSupport();

  // 실시간 업데이트를 보여주기 위한 상태
  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setUpdateCount((prev) => prev + 1);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Device Detection</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>import</h2>
        <CodeHighlight
          code={`// 유틸리티 함수들
import { 
  getDeviceInfo, 
  isPC, 
  isMobile, 
  isTablet,
  isMobileDevice,
  isIOS,
  isAndroid,
  isChrome,
  isFirefox,
  // ... 기타 함수들
} from '@/utils/device';

// 커스텀 훅들
import { 
  useDevice, 
  useIsPC, 
  useIsMobile, 
  useIsTablet,
  useIsMobileDevice,
  useIsIOS,
  useIsAndroid,
  useBreakpoint,
  // ... 기타 훅들
} from '@/hooks/useDevice';`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>현재 디바이스 정보</h2>
        <div className={styles.showcase}>
          <div style={{ marginBottom: '20px' }}>
            <h4>실시간 정보 (useDevice 훅 사용)</h4>
            <p>
              <strong>디바이스 타입:</strong> {device.type}
            </p>
            <p>
              <strong>화면 크기:</strong> {device.screenWidth} x{' '}
              {device.screenHeight}
            </p>
            <p>
              <strong>터치 지원:</strong> {device.isTouch ? 'Yes' : 'No'}
            </p>
            {device.browser && (
              <p>
                <strong>브라우저:</strong> {device.browser}
              </p>
            )}
            {device.os && (
              <p>
                <strong>모바일 OS:</strong> {device.os}
              </p>
            )}
            <p>
              <strong>User Agent:</strong> {device.userAgent}
            </p>
            <p>
              <strong>업데이트 횟수:</strong> {updateCount}
            </p>
          </div>

          <div>
            <h4>정적 정보 (getDeviceInfo 함수 사용)</h4>
            <p>
              <strong>설명:</strong> {getDeviceDescription()}
            </p>
            <pre
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto',
              }}
            >
              {JSON.stringify(staticDeviceInfo, null, 2)}
            </pre>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>디바이스 타입 감지</h2>
        <div className={styles.showcase}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
            }}
          >
            <div>
              <h4>유틸리티 함수 결과</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>✓ PC: {isPC() ? 'True' : 'False'}</li>
                <li>✓ Mobile: {isMobile() ? 'True' : 'False'}</li>
                <li>✓ Tablet: {isTablet() ? 'True' : 'False'}</li>
                <li>✓ Mobile Device: {isMobileDevice() ? 'True' : 'False'}</li>
              </ul>
            </div>

            <div>
              <h4>커스텀 훅 결과</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>✓ PC: {isPCHook ? 'True' : 'False'}</li>
                <li>✓ Mobile: {isMobileHook ? 'True' : 'False'}</li>
                <li>✓ Tablet: {isTabletHook ? 'True' : 'False'}</li>
                <li>
                  ✓ Mobile Device: {isMobileDeviceHook ? 'True' : 'False'}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className={styles['sub-title']}>사용 예시</h3>
        <CodeHighlight
          code={`// 유틸리티 함수 사용 (한 번만 체크)
import { isPC, isMobile, isTablet } from '@/utils/device';

if (isPC()) {
  console.log('PC 환경입니다');
}

// 커스텀 훅 사용 (반응형 - 화면 크기 변경시 자동 업데이트)
import { useIsPC, useIsMobile, useIsTablet } from '@/hooks/useDevice';

function MyComponent() {
  const isPC = useIsPC();
  const isMobile = useIsMobile();
  
  return (
    <div>
      {isPC && <div>PC용 컴포넌트</div>}
      {isMobile && <div>모바일용 컴포넌트</div>}
    </div>
  );
}`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>브라우저 감지 (PC용)</h2>
        <div className={styles.showcase}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
            }}
          >
            <div>
              <h4>유틸리티 함수 결과</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>✓ Chrome: {isChrome() ? 'True' : 'False'}</li>
                <li>✓ Firefox: {isFirefox() ? 'True' : 'False'}</li>
                <li>✓ Safari: {isSafari() ? 'True' : 'False'}</li>
                <li>✓ Edge: {isEdge() ? 'True' : 'False'}</li>
                <li>✓ IE: {isIE() ? 'True' : 'False'}</li>
              </ul>
            </div>

            <div>
              <h4>커스텀 훅 결과</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>✓ Chrome: {isChromeHook ? 'True' : 'False'}</li>
                <li>✓ Firefox: {isFirefoxHook ? 'True' : 'False'}</li>
                <li>✓ Safari: {isSafariHook ? 'True' : 'False'}</li>
                <li>✓ Edge: {isEdgeHook ? 'True' : 'False'}</li>
                <li>✓ IE: {isIEHook ? 'True' : 'False'}</li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className={styles['sub-title']}>사용 예시</h3>
        <CodeHighlight
          code={`// 브라우저별 처리
import { isChrome, isSafari, isIE } from '@/utils/device';

if (isIE()) {
  // IE용 폴리필 로드
  loadPolyfills();
}

if (isSafari()) {
  // Safari 특화 처리
  applySafariFix();
}

// 훅 사용
import { useIsChrome, useIsIE } from '@/hooks/useDevice';

function MyComponent() {
  const isChrome = useIsChrome();
  const isIE = useIsIE();
  
  return (
    <div>
      {isIE && <div className="ie-warning">IE는 지원이 제한됩니다.</div>}
      {isChrome && <div>Chrome 최적화 기능 사용 가능</div>}
    </div>
  );
}`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>모바일 OS 감지</h2>
        <div className={styles.showcase}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
            }}
          >
            <div>
              <h4>유틸리티 함수 결과</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>✓ iOS: {isIOS() ? 'True' : 'False'}</li>
                <li>✓ Android: {isAndroid() ? 'True' : 'False'}</li>
              </ul>
            </div>

            <div>
              <h4>커스텀 훅 결과</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>✓ iOS: {isIOSHook ? 'True' : 'False'}</li>
                <li>✓ Android: {isAndroidHook ? 'True' : 'False'}</li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className={styles['sub-title']}>사용 예시</h3>
        <CodeHighlight
          code={`// OS별 처리
import { isIOS, isAndroid } from '@/utils/device';

if (isIOS()) {
  // iOS 특화 처리 (예: 스크롤 bounce 효과)
  document.body.style.overflow = 'hidden';
}

if (isAndroid()) {
  // Android 특화 처리
  enableAndroidOptimizations();
}

// 훅 사용
import { useIsIOS, useIsAndroid } from '@/hooks/useDevice';

function MobileComponent() {
  const isIOS = useIsIOS();
  const isAndroid = useIsAndroid();
  
  return (
    <div>
      {isIOS && <button className="ios-style-btn">iOS 스타일 버튼</button>}
      {isAndroid && <button className="material-btn">Material 스타일 버튼</button>}
    </div>
  );
}`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>브레이크포인트 및 반응형</h2>
        <div className={styles.showcase}>
          <div>
            <h4>현재 브레이크포인트 상태</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>✓ Mobile (xs): {breakpoints.mobile ? 'True' : 'False'}</li>
              <li>✓ Tablet (sm): {breakpoints.tablet ? 'True' : 'False'}</li>
              <li>✓ Desktop (md): {breakpoints.desktop ? 'True' : 'False'}</li>
              <li>✓ Large (lg): {breakpoints.large ? 'True' : 'False'}</li>
              <li>✓ XL: {breakpoints.xl ? 'True' : 'False'}</li>
            </ul>

            <div style={{ marginTop: '20px' }}>
              <h4>추가 디바이스 정보</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>✓ Mobile Size: {device.isMobileSize ? 'True' : 'False'}</li>
                <li>✓ Tablet Size: {device.isTabletSize ? 'True' : 'False'}</li>
                <li>
                  ✓ Desktop Size: {device.isDesktopSize ? 'True' : 'False'}
                </li>
                <li>
                  ✓ Large Screen (미디어쿼리):{' '}
                  {isLargeScreen ? 'True' : 'False'}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className={styles['sub-title']}>사용 예시</h3>
        <CodeHighlight
          code={`// 브레이크포인트 사용
import { useBreakpoint, useMediaQuery } from '@/hooks/useDevice';

function ResponsiveComponent() {
  const breakpoints = useBreakpoint();
  const isLargeScreen = useMediaQuery('(min-width: 1200px)');
  
  return (
    <div>
      {breakpoints.mobile && <div>모바일 레이아웃</div>}
      {breakpoints.tablet && <div>태블릿 레이아웃</div>}
      {breakpoints.desktop && <div>데스크톱 레이아웃</div>}
      {isLargeScreen && <div>큰 화면 전용 기능</div>}
    </div>
  );
}

// 화면 크기에 따른 조건부 렌더링
import { useDevice } from '@/hooks/useDevice';

function AdaptiveComponent() {
  const device = useDevice();
  
  // 화면 크기 변경 시 자동으로 리렌더링됨
  if (device.isMobileSize) {
    return <MobileLayout />;
  }
  
  if (device.isTabletSize) {
    return <TabletLayout />;
  }
  
  return <DesktopLayout />;
}`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>브라우저 기능 지원 확인</h2>
        <div className={styles.showcase}>
          <div>
            <h4>CSS 기능 지원</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>
                ✓ CSS Grid: {browserSupport.supportsGrid ? 'True' : 'False'}
              </li>
              <li>
                ✓ Flexbox: {browserSupport.supportsFlexbox ? 'True' : 'False'}
              </li>
              <li>
                ✓ CSS Variables:{' '}
                {browserSupport.supportsCustomProperties ? 'True' : 'False'}
              </li>
            </ul>

            <h4>JavaScript API 지원</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>
                ✓ IntersectionObserver:{' '}
                {browserSupport.supportsIntersectionObserver ? 'True' : 'False'}
              </li>
              <li>
                ✓ ResizeObserver:{' '}
                {browserSupport.supportsResizeObserver ? 'True' : 'False'}
              </li>
              <li>✓ WebP: {browserSupport.supportsWebP ? 'True' : 'False'}</li>
            </ul>

            <h4>기타 특성</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>
                ✓ Modern Browser:{' '}
                {browserSupport.isModernBrowser ? 'True' : 'False'}
              </li>
              <li>
                ✓ Requires Polyfill:{' '}
                {browserSupport.requiresPolyfill ? 'True' : 'False'}
              </li>
              <li>✓ Has Hover: {browserSupport.hasHover ? 'True' : 'False'}</li>
              <li>✓ Has Touch: {browserSupport.hasTouch ? 'True' : 'False'}</li>
            </ul>
          </div>
        </div>

        <h3 className={styles['sub-title']}>사용 예시</h3>
        <CodeHighlight
          code={`// 브라우저 기능 지원 확인
import { useBrowserSupport } from '@/hooks/useDevice';

function FeatureComponent() {
  const support = useBrowserSupport();
  
  return (
    <div>
      {support.supportsGrid ? (
        <div className="grid-layout">CSS Grid 사용</div>
      ) : (
        <div className="fallback-layout">Fallback 레이아웃</div>
      )}
      
      {support.requiresPolyfill && (
        <div>폴리필이 필요한 브라우저입니다.</div>
      )}
      
      {support.hasHover ? (
        <button className="hover-effects">호버 효과 있는 버튼</button>
      ) : (
        <button className="touch-friendly">터치 친화적 버튼</button>
      )}
    </div>
  );
}`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>실용적인 사용 패턴</h2>

        <h3 className={styles['sub-title']}>1. 조건부 컴포넌트 렌더링</h3>
        <CodeHighlight
          code={`// 디바이스별 다른 컴포넌트 렌더링
import { useDevice } from '@/hooks/useDevice';

function App() {
  const device = useDevice();
  
  return (
    <div>
      {device.type === 'mobile' && <MobileNavigation />}
      {device.type === 'tablet' && <TabletNavigation />}
      {device.type === 'pc' && <DesktopNavigation />}
      
      <main>
        {device.isMobileDevice ? (
          <MobileContent />
        ) : (
          <DesktopContent />
        )}
      </main>
    </div>
  );
}`}
          language="typescript"
        />

        <h3 className={styles['sub-title']}>2. CSS 클래스 동적 적용</h3>
        <CodeHighlight
          code={`// 디바이스별 CSS 클래스 적용
import { useDevice } from '@/hooks/useDevice';
import { cx } from '@/utils/cx';

function ResponsiveComponent() {
  const device = useDevice();
  
  const className = cx({
    'component-base': true,
    'component-mobile': device.type === 'mobile',
    'component-tablet': device.type === 'tablet',
    'component-desktop': device.type === 'pc',
    'component-touch': device.isTouch,
    'component-ios': device.os === 'ios',
    'component-android': device.os === 'android',
    'component-chrome': device.browser === 'chrome',
  });
  
  return <div className={className}>반응형 컴포넌트</div>;
}`}
          language="typescript"
        />

        <h3 className={styles['sub-title']}>3. 이벤트 핸들러 분기</h3>
        <CodeHighlight
          code={`// 디바이스별 다른 이벤트 처리
import { useDevice } from '@/hooks/useDevice';

function InteractiveComponent() {
  const device = useDevice();
  
  const handleInteraction = () => {
    if (device.isTouch) {
      // 터치 디바이스용 처리
      handleTouchInteraction();
    } else {
      // 마우스 디바이스용 처리
      handleMouseInteraction();
    }
  };
  
  const eventProps = device.isTouch 
    ? { onTouchStart: handleInteraction }
    : { onClick: handleInteraction };
  
  return <button {...eventProps}>상호작용 버튼</button>;
}`}
          language="typescript"
        />

        <h3 className={styles['sub-title']}>4. 성능 최적화</h3>
        <CodeHighlight
          code={`// 디바이스별 리소스 로딩 최적화
import { useDevice } from '@/hooks/useDevice';
import { lazy, Suspense } from 'react';

// 디바이스별 지연 로딩
const DesktopChart = lazy(() => import('./DesktopChart'));
const MobileChart = lazy(() => import('./MobileChart'));

function ChartComponent() {
  const device = useDevice();
  
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      {device.isMobileDevice ? (
        <MobileChart />
      ) : (
        <DesktopChart />
      )}
    </Suspense>
  );
}

// 이미지 해상도 최적화
function OptimizedImage({ src, alt }: { src: string; alt: string }) {
  const device = useDevice();
  
  const imageSrc = device.isMobileDevice 
    ? src.replace('.jpg', '-mobile.jpg')
    : device.screenWidth > 1920
    ? src.replace('.jpg', '-hd.jpg')
    : src;
  
  return <img src={imageSrc} alt={alt} />;
}`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>타입 정의</h2>
        <CodeHighlight
          code={`// 디바이스 관련 타입들
export type DeviceType = 'pc' | 'tablet' | 'mobile';

export type BrowserType = 
  | 'chrome' 
  | 'firefox' 
  | 'safari' 
  | 'edge' 
  | 'opera' 
  | 'ie' 
  | 'unknown';

export type MobileOSType = 'ios' | 'android' | 'unknown';

export interface DeviceInfo {
  type: DeviceType;
  browser?: BrowserType; // PC일 때만
  os?: MobileOSType; // mobile/tablet일 때만
  userAgent: string;
  isTouch: boolean;
  screenWidth: number;
  screenHeight: number;
}

// 브레이크포인트 상수
export const BREAKPOINTS = {
  mobile: 576,
  tablet: 768,
  desktop: 992,
  large: 1200,
  xl: 1600,
} as const;`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>주의사항 및 팁</h2>
        <div className={styles.showcase}>
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              <strong>SSR 호환성:</strong> 서버 사이드 렌더링 시 window 객체가
              없으므로 초기값을 적절히 설정했습니다.
            </li>
            <li>
              <strong>성능 최적화:</strong> useDevice 훅은 디바운싱을 통해
              리사이즈 이벤트를 최적화합니다.
            </li>
            <li>
              <strong>정적 vs 동적:</strong> 한 번만 체크하려면 유틸리티 함수를,
              반응형이 필요하면 훅을 사용하세요.
            </li>
            <li>
              <strong>User Agent 한계:</strong> User Agent는 변조 가능하므로
              중요한 보안 로직에는 사용하지 마세요.
            </li>
            <li>
              <strong>브레이크포인트:</strong> CSS와 JavaScript의
              브레이크포인트를 일치시켜 사용하는 것이 좋습니다.
            </li>
            <li>
              <strong>터치 감지:</strong> 터치 지원과 실제 터치 디바이스는 다를
              수 있습니다 (예: Surface Pro).
            </li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>브라우저 지원</h2>
        <div className={styles.showcase}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>기능</th>
                <th>Chrome</th>
                <th>Firefox</th>
                <th>Safari</th>
                <th>Edge</th>
                <th>IE11</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>기본 감지</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
                <td>⚠️</td>
              </tr>
              <tr>
                <td>matchMedia</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>ResizeObserver</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
                <td>❌</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DeviceGuide;
