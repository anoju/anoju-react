// src/utils/AriaHiddenManager.ts
import { isMobile } from '@/utils/device';

/**
 * 웹접근성을 위한 aria-hidden/inert 속성 관리 유틸리티
 * 디바이스 타입에 따라 다른 접근성 속성을 사용:
 * - 모바일: aria-hidden 속성 (inert 지원 제한적)
 * - PC/태블릿: inert 속성 (더 강력한 접근성 차단)
 * 팝업, 모달, 사이드바 등에서 공통으로 사용 가능
 */
interface AriaHiddenOptions {
  targetSelector?: string; // 대상 요소 선택자 (기본: #root)
  excludeSelectors?: string[]; // 제외할 요소들의 선택자
}

class AriaHiddenManagerClass {
  private defaultOptions: AriaHiddenOptions = {
    targetSelector: '#root',
    excludeSelectors: [],
  };

  /**
   * 레이아웃 요소에 접근성 속성 설정/제거
   * 모바일: aria-hidden 사용, PC/태블릿: inert 사용
   * @param hidden - true면 속성 설정, false면 속성 제거
   * @param options - 설정 옵션
   */
  setLayoutAccessibility(
    hidden: boolean,
    options: AriaHiddenOptions = {}
  ): boolean {
    const config = { ...this.defaultOptions, ...options };
    const isMobileDevice = typeof window !== 'undefined' ? isMobile() : false;

    try {
      // 대상 요소 찾기
      const targetElement = document.querySelector(config.targetSelector!);

      if (!targetElement) {
        console.warn(
          `AriaHiddenManager: Target element not found: ${config.targetSelector}`
        );
        return false;
      }

      if (hidden) {
        if (isMobileDevice) {
          // 모바일: aria-hidden 사용
          targetElement.setAttribute('aria-hidden', 'true');
        } else {
          // PC/태블릿: inert 사용
          (targetElement as HTMLElement).inert = true;
        }

        // 제외할 요소들의 속성 제거
        if (config.excludeSelectors && config.excludeSelectors.length > 0) {
          config.excludeSelectors.forEach((selector) => {
            const excludeElements = document.querySelectorAll(selector);
            excludeElements.forEach((element) => {
              if (isMobileDevice) {
                element.removeAttribute('aria-hidden');
              } else {
                (element as HTMLElement).inert = false;
              }
            });
          });
        }
      } else {
        if (isMobileDevice) {
          // aria-hidden 속성 제거
          targetElement.removeAttribute('aria-hidden');
        } else {
          // inert 속성 제거
          (targetElement as HTMLElement).inert = false;
        }
      }

      return true;
    } catch (error) {
      console.error(
        'AriaHiddenManager: Error setting layout accessibility:',
        error
      );
      return false;
    }
  }

  /**
   * 특정 요소에 접근성 속성 설정/제거
   * 모바일: aria-hidden 사용, PC/태블릿: inert 사용
   * @param element - 대상 요소
   * @param hidden - true면 속성 설정, false면 속성 제거
   */
  setElementAccessibility(
    element: HTMLElement | null,
    hidden: boolean
  ): boolean {
    if (!element) {
      return false;
    }

    const isMobileDevice = typeof window !== 'undefined' ? isMobile() : false;

    try {
      if (hidden) {
        if (isMobileDevice) {
          element.setAttribute('aria-hidden', 'true');
        } else {
          element.inert = true;
        }
      } else {
        if (isMobileDevice) {
          element.removeAttribute('aria-hidden');
        } else {
          element.inert = false;
        }
      }
      return true;
    } catch (error) {
      console.error(
        'AriaHiddenManager: Error setting element accessibility:',
        error
      );
      return false;
    }
  }

  /**
   * 요소의 현재 접근성 상태 확인
   * 모바일: aria-hidden 검사, PC/태블릿: inert 검사
   * @param element - 확인할 요소
   * @returns 속성이 설정되어 있으면 true
   */
  isElementAccessibilityHidden(element: HTMLElement | null): boolean {
    if (!element) {
      return false;
    }

    const isMobileDevice = typeof window !== 'undefined' ? isMobile() : false;

    if (isMobileDevice) {
      return element.getAttribute('aria-hidden') === 'true';
    } else {
      return element.inert === true;
    }
  }

  /**
   * 레이아웃 요소의 현재 접근성 상태 확인
   * 모바일: aria-hidden 검사, PC/태블릿: inert 검사
   * @param targetSelector - 대상 요소 선택자 (기본: #root)
   * @returns 속성이 설정되어 있으면 true
   */
  isLayoutAccessibilityHidden(targetSelector: string = '#root'): boolean {
    try {
      const targetElement = document.querySelector(targetSelector);
      return this.isElementAccessibilityHidden(targetElement as HTMLElement);
    } catch (error) {
      console.error(
        'AriaHiddenManager: Error checking layout accessibility:',
        error
      );
      return false;
    }
  }

  /**
   * 여러 요소들에 접근성 속성 일괄 설정/제거
   * 모바일: aria-hidden 사용, PC/태블릿: inert 사용
   * @param elements - 대상 요소들
   * @param hidden - true면 속성 설정, false면 속성 제거
   */
  setMultipleElementsAccessibility(
    elements: (HTMLElement | null)[],
    hidden: boolean
  ): boolean {
    try {
      elements.forEach((element) => {
        this.setElementAccessibility(element, hidden);
      });
      return true;
    } catch (error) {
      console.error(
        'AriaHiddenManager: Error setting multiple elements accessibility:',
        error
      );
      return false;
    }
  }

  // 하위 호환성을 위한 기존 메서드들 (내부에서 새 메서드 호출)
  /**
   * @deprecated setLayoutAccessibility를 사용하세요
   */
  setLayoutAriaHidden(
    hidden: boolean,
    options: AriaHiddenOptions = {}
  ): boolean {
    return this.setLayoutAccessibility(hidden, options);
  }

  /**
   * @deprecated setElementAccessibility를 사용하세요
   */
  setElementAriaHidden(element: HTMLElement | null, hidden: boolean): boolean {
    return this.setElementAccessibility(element, hidden);
  }

  /**
   * @deprecated isElementAccessibilityHidden을 사용하세요
   */
  isElementAriaHidden(element: HTMLElement | null): boolean {
    return this.isElementAccessibilityHidden(element);
  }

  /**
   * @deprecated isLayoutAccessibilityHidden을 사용하세요
   */
  isLayoutAriaHidden(targetSelector: string = '#root'): boolean {
    return this.isLayoutAccessibilityHidden(targetSelector);
  }

  /**
   * @deprecated setMultipleElementsAccessibility를 사용하세요
   */
  setMultipleElementsAriaHidden(
    elements: (HTMLElement | null)[],
    hidden: boolean
  ): boolean {
    return this.setMultipleElementsAccessibility(elements, hidden);
  }
}

// 싱글톤 인스턴스
const AriaHiddenManager = new AriaHiddenManagerClass();

export default AriaHiddenManager;
export type { AriaHiddenOptions };
