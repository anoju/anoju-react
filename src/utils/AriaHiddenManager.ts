// src/utils/AriaHiddenManager.ts
/**
 * 웹접근성을 위한 aria-hidden 속성 관리 유틸리티
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
   * 레이아웃 요소에 aria-hidden 속성 설정/제거
   * @param hidden - true면 aria-hidden="true" 설정, false면 속성 제거
   * @param options - 설정 옵션
   */
  setLayoutAriaHidden(
    hidden: boolean,
    options: AriaHiddenOptions = {}
  ): boolean {
    const config = { ...this.defaultOptions, ...options };

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
        // aria-hidden="true" 설정
        targetElement.setAttribute('aria-hidden', 'true');
        
        // 제외할 요소들의 aria-hidden 제거
        if (config.excludeSelectors && config.excludeSelectors.length > 0) {
          config.excludeSelectors.forEach(selector => {
            const excludeElements = document.querySelectorAll(selector);
            excludeElements.forEach(element => {
              element.removeAttribute('aria-hidden');
            });
          });
        }
      } else {
        // aria-hidden 속성 제거
        targetElement.removeAttribute('aria-hidden');
      }

      return true;
    } catch (error) {
      console.error('AriaHiddenManager: Error setting layout aria-hidden:', error);
      return false;
    }
  }

  /**
   * 특정 요소에 aria-hidden 속성 설정/제거
   * @param element - 대상 요소
   * @param hidden - true면 aria-hidden="true" 설정, false면 속성 제거
   */
  setElementAriaHidden(element: HTMLElement | null, hidden: boolean): boolean {
    if (!element) {
      return false;
    }

    try {
      if (hidden) {
        element.setAttribute('aria-hidden', 'true');
      } else {
        element.removeAttribute('aria-hidden');
      }
      return true;
    } catch (error) {
      console.error('AriaHiddenManager: Error setting element aria-hidden:', error);
      return false;
    }
  }

  /**
   * 요소의 현재 aria-hidden 상태 확인
   * @param element - 확인할 요소
   * @returns aria-hidden="true"이면 true, 그렇지 않으면 false
   */
  isElementAriaHidden(element: HTMLElement | null): boolean {
    if (!element) {
      return false;
    }

    return element.getAttribute('aria-hidden') === 'true';
  }

  /**
   * 레이아웃 요소의 현재 aria-hidden 상태 확인
   * @param targetSelector - 대상 요소 선택자 (기본: #root)
   * @returns aria-hidden="true"이면 true, 그렇지 않으면 false
   */
  isLayoutAriaHidden(targetSelector: string = '#root'): boolean {
    try {
      const targetElement = document.querySelector(targetSelector);
      return this.isElementAriaHidden(targetElement as HTMLElement);
    } catch (error) {
      console.error('AriaHiddenManager: Error checking layout aria-hidden:', error);
      return false;
    }
  }

  /**
   * 여러 요소들에 aria-hidden 속성 일괄 설정/제거
   * @param elements - 대상 요소들
   * @param hidden - true면 aria-hidden="true" 설정, false면 속성 제거
   */
  setMultipleElementsAriaHidden(
    elements: (HTMLElement | null)[],
    hidden: boolean
  ): boolean {
    try {
      elements.forEach(element => {
        this.setElementAriaHidden(element, hidden);
      });
      return true;
    } catch (error) {
      console.error('AriaHiddenManager: Error setting multiple elements aria-hidden:', error);
      return false;
    }
  }
}

// 싱글톤 인스턴스
const AriaHiddenManager = new AriaHiddenManagerClass();

export default AriaHiddenManager;
export type { AriaHiddenOptions };