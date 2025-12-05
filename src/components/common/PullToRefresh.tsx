import React, { useRef, useState, useEffect, useCallback, CSSProperties, ReactNode } from 'react';
import styles from '@/assets/scss/components/pullToRefresh.module.scss';

// Types
export interface PullToRefreshProps {
  children: ReactNode;
  pullText?: string;
  releaseText?: string;
  refreshText?: string;
  refreshTimeout?: number;
  scrollElement?: string | HTMLElement;
  distThreshold?: number;
  distMax?: number;
  scrollThreshold?: number;
  enableMouse?: boolean;
  onRefresh?: (close: () => void) => void;
  onProgress?: (payload: ProgressPayload) => void;
}

export interface ProgressPayload {
  progress: number;
  distance: number;
  isPulling: boolean;
  isReleasing: boolean;
}

export interface PullToRefreshRef {
  disabled: (val: boolean) => void;
  progress: number;
}

const PullToRefresh = React.forwardRef<PullToRefreshRef, PullToRefreshProps>(
  (
    {
      children,
      pullText,
      releaseText,
      refreshText,
      refreshTimeout = 5000,
      scrollElement,
      distThreshold = 104,
      distMax = 140,
      scrollThreshold = 20,
      enableMouse = false,
      onRefresh,
      onProgress,
    },
    ref
  ) => {
    // Refs
    const containerRef = useRef<HTMLDivElement | null>(null);
    const indicatorRef = useRef<HTMLDivElement | null>(null);

    // State
    const [isPulling, setIsPulling] = useState(false);
    const [isReleasing, setIsReleasing] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const [touchStartY, setTouchStartY] = useState(0);
    const [touchStartScrollTop, setTouchStartScrollTop] = useState(0);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);

    // Refs for timeout
    const closeTimeoutRef = useRef<number | null>(null);

    // Computed values
    const currentMessage = isRefreshing
      ? refreshText
      : isReleasing
        ? releaseText
        : isPulling
          ? pullText
          : '';

    const progress = Math.min(pullDistance / distThreshold, 1);

    const indicatorStyle: CSSProperties = {
      height: `${Math.min(pullDistance, distMax)}px`,
    };

    const contentStyle: CSSProperties = {
      opacity: 0.3 + progress * 0.7,
      transform: `scale(${0.3 + progress * 0.7})`,
    };

    const circleStyle: CSSProperties = isRefreshing
      ? {}
      : {
          strokeDasharray: `${1 + progress * 93}, 150`,
          strokeDashoffset: 0,
        };

    // Methods
    const shouldPullToRefresh = useCallback(() => {
      if (isDisabled) return false;
      return touchStartScrollTop <= scrollThreshold;
    }, [isDisabled, touchStartScrollTop, scrollThreshold]);

    const resistance = (t: number): number => {
      return Math.min(1, t / 2.5);
    };

    const resetPull = useCallback(() => {
      setIsClosing(true);
      setIsPulling(false);
      setIsReleasing(false);
      setIsRefreshing(false);
      setPullDistance(0);
      setTouchStartY(0);

      setTimeout(() => {
        setIsClosing(false);
      }, 300);
    }, []);

    const triggerRefresh = useCallback(() => {
      setIsPulling(false);
      setIsReleasing(false);
      setIsRefreshing(true);
      setPullDistance(distThreshold);

      const close = () => {
        setIsRefreshing(false);
        resetPull();
        if (closeTimeoutRef.current !== null) {
          clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = null;
        }
      };

      if (onRefresh) {
        onRefresh(close);
      }

      if (refreshTimeout) {
        closeTimeoutRef.current = window.setTimeout(() => {
          if (isRefreshing) {
            close();
          }
        }, refreshTimeout);
      }
    }, [distThreshold, isRefreshing, onRefresh, refreshTimeout, resetPull]);

    const handleTouchStart = useCallback(
      (e: TouchEvent | MouseEvent) => {
        if (isRefreshing || isDisabled) return;

        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          return;
        }

        if (e instanceof MouseEvent) {
          setIsMouseDown(true);
        }

        setTouchStartY('touches' in e ? e.touches[0].clientY : e.clientY);

        const targetElement =
          typeof scrollElement === 'string'
            ? document.querySelector(scrollElement)
            : scrollElement;

        setTouchStartScrollTop(
          (targetElement as HTMLElement)?.scrollTop ??
            window.pageYOffset ??
            document.documentElement.scrollTop ??
            0
        );
      },
      [isRefreshing, isDisabled, scrollElement]
    );

    const handleTouchMove = useCallback(
      (e: TouchEvent | MouseEvent) => {
        if (isRefreshing || isDisabled) return;

        if (e instanceof MouseEvent && !isMouseDown) {
          return;
        }

        if (!touchStartY) {
          return;
        }

        const touchY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const touchDiff = touchY - touchStartY;

        if (touchDiff <= 0) {
          if (isPulling || isReleasing) {
            resetPull();
          }
          return;
        }

        if (!shouldPullToRefresh()) {
          return;
        }

        if (e.cancelable) {
          e.preventDefault();
        }

        if (!isPulling && touchDiff > 0) {
          setIsPulling(true);
        }

        const resistedDistance = touchDiff * resistance(touchDiff / distThreshold);
        const newPullDistance = Math.min(resistedDistance, distMax);
        setPullDistance(newPullDistance);

        const currentProgress = Math.min(newPullDistance / distThreshold, 1);
        if (onProgress) {
          onProgress({
            progress: currentProgress,
            distance: newPullDistance,
            isPulling: true,
            isReleasing: newPullDistance >= distThreshold,
          });
        }

        if (newPullDistance >= distThreshold) {
          if (!isReleasing) {
            setIsReleasing(true);
          }
        } else {
          setIsReleasing(false);
        }
      },
      [
        isRefreshing,
        isDisabled,
        isMouseDown,
        touchStartY,
        isPulling,
        isReleasing,
        shouldPullToRefresh,
        distThreshold,
        distMax,
        onProgress,
        resetPull,
      ]
    );

    const handleTouchEnd = useCallback(() => {
      if (isRefreshing || isDisabled) return;

      setIsMouseDown(false);

      if (isReleasing) {
        triggerRefresh();
      } else {
        resetPull();
      }
    }, [isRefreshing, isDisabled, isReleasing, triggerRefresh, resetPull]);

    const handleVisibilityChange = useCallback(() => {
      if (document.hidden && (isPulling || isReleasing)) {
        resetPull();
      }
    }, [isPulling, isReleasing, resetPull]);

    const handleContextMenu = useCallback(
      (e: Event) => {
        if (isPulling || isReleasing) {
          e.preventDefault();
        }
      },
      [isPulling, isReleasing]
    );

    // Expose methods via ref
    React.useImperativeHandle(ref, () => ({
      disabled: (val: boolean) => {
        setIsDisabled(val);
      },
      progress,
    }));

    // Lifecycle
    useEffect(() => {
      const handleTouchStartEvent = (e: Event) => handleTouchStart(e as TouchEvent | MouseEvent);
      const handleTouchMoveEvent = (e: Event) => handleTouchMove(e as TouchEvent | MouseEvent);
      const handleTouchEndEvent = () => handleTouchEnd();

      window.addEventListener('touchstart', handleTouchStartEvent, { passive: false });
      window.addEventListener('touchmove', handleTouchMoveEvent, { passive: false });
      window.addEventListener('touchend', handleTouchEndEvent, { passive: false });
      window.addEventListener('contextmenu', handleContextMenu, { passive: false });

      if (enableMouse) {
        window.addEventListener('mousedown', handleTouchStartEvent, { passive: false });
        window.addEventListener('mousemove', handleTouchMoveEvent, { passive: false });
        window.addEventListener('mouseup', handleTouchEndEvent, { passive: false });
      }

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        window.removeEventListener('touchstart', handleTouchStartEvent);
        window.removeEventListener('touchmove', handleTouchMoveEvent);
        window.removeEventListener('touchend', handleTouchEndEvent);
        window.removeEventListener('contextmenu', handleContextMenu);

        if (enableMouse) {
          window.removeEventListener('mousedown', handleTouchStartEvent);
          window.removeEventListener('mousemove', handleTouchMoveEvent);
          window.removeEventListener('mouseup', handleTouchEndEvent);
        }

        document.removeEventListener('visibilitychange', handleVisibilityChange);

        if (closeTimeoutRef.current !== null) {
          clearTimeout(closeTimeoutRef.current);
        }
      };
    }, [
      enableMouse,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      handleContextMenu,
      handleVisibilityChange,
    ]);

    return (
      <div ref={containerRef}>
        {/* Pull Indicator */}
        {(isPulling || isReleasing || isRefreshing || isClosing) && (
          <div
            ref={indicatorRef}
            className={`${styles['sv-pull-to-refresh']} ${
              isPulling ? styles['is-pulling'] : ''
            } ${isReleasing ? styles['is-releasing'] : ''} ${
              isRefreshing ? styles['is-refreshing'] : ''
            } ${isClosing ? styles['is-closing'] : ''}`}
            style={indicatorStyle}
          >
            <div className={styles['sv-pull-to-refresh--content']} style={contentStyle}>
              <span className={styles['sv-pull-to-refresh--icon']}>
                <svg
                  className={`${styles['sv-pull-to-refresh--circle']} ${
                    isRefreshing ? styles['is-refreshing'] : ''
                  }`}
                  viewBox="0 0 40 40"
                  width="40"
                  height="40"
                >
                  <circle
                    cx="20"
                    cy="20"
                    r="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeMiterlimit="10"
                    transform="rotate(-90 20 20)"
                    style={circleStyle}
                  />
                </svg>
              </span>
              {currentMessage && (
                <span className={styles['sv-pull-to-refresh--text']}>{currentMessage}</span>
              )}
            </div>
          </div>
        )}

        {/* Slot Content */}
        {children}
      </div>
    );
  }
);

PullToRefresh.displayName = 'PullToRefresh';

export default PullToRefresh;
