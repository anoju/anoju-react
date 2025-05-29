// src/components/common/Popup/usePopupAccessibility.ts
import { useEffect, useRef } from 'react';

interface UsePopupAccessibilityProps {
  isOpen: boolean;
  title?: string;
  description?: string;
}

/**
 * 팝업 접근성 훅 - ARIA 속성 및 스크린 리더 지원
 */
export const usePopupAccessibility = ({ 
  isOpen, 
  title, 
  description 
}: UsePopupAccessibilityProps) => {
  const titleId = useRef(`popup-title-${Date.now()}`);
  const descriptionId = useRef(`popup-desc-${Date.now()}`);
  const originalBodyAriaHidden = useRef<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // body의 나머지 내용을 스크린 리더에서 숨김
      const body = document.body;
      originalBodyAriaHidden.current = body.getAttribute('aria-hidden');
      
      // 팝업 외부 요소들에 aria-hidden 추가
      const elementsToHide = document.querySelectorAll('body > *:not([data-popup-container])');
      elementsToHide.forEach((element) => {
        if (!element.getAttribute('aria-hidden')) {
          element.setAttribute('aria-hidden', 'true');
          element.setAttribute('data-popup-hidden', 'true');
        }
      });
    } else {
      // 팝업이 닫힐 때 aria-hidden 복원
      const elementsToShow = document.querySelectorAll('[data-popup-hidden]');
      elementsToShow.forEach((element) => {
        element.removeAttribute('aria-hidden');
        element.removeAttribute('data-popup-hidden');
      });
    }

    return () => {
      // 클린업 시에도 복원
      if (isOpen) {
        const elementsToShow = document.querySelectorAll('[data-popup-hidden]');
        elementsToShow.forEach((element) => {
          element.removeAttribute('aria-hidden');
          element.removeAttribute('data-popup-hidden');
        });
      }
    };
  }, [isOpen]);

  return {
    titleId: titleId.current,
    descriptionId: descriptionId.current,
    ariaProps: {
      'aria-labelledby': title ? titleId.current : undefined,
      'aria-describedby': description ? descriptionId.current : undefined,
      'aria-modal': true,
      'role': 'dialog',
    },
  };
};
