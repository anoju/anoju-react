// src/components/common/Popup/PopupManager.ts
import AriaHiddenManager from '@/utils/AriaHiddenManager';

type PopupChangeListener = (id: string, isTopPopup: boolean) => void;

interface PopupInfo {
  additionalZIndex: number;
  onStateChange?: PopupChangeListener;
}

class PopupManagerClass {
  private popups: Map<string, PopupInfo> = new Map();
  private currentMaxAdditional: number = -1; // 현재 최대 추가 z-index (-1부터 시작)
  private globalListeners: Set<() => void> = new Set();

  // 팝업 등록 및 추가 z-index 반환
  register(id: string, onStateChange?: PopupChangeListener): number {
    // 이미 등록된 팝업인지 확인
    if (this.popups.has(id)) {
      // 이미 등록된 팝업이면 기존 값 반환하되 콜백 업데이트
      const existingInfo = this.popups.get(id)!;
      if (onStateChange) {
        existingInfo.onStateChange = onStateChange;
        this.popups.set(id, existingInfo);
      }
      return existingInfo.additionalZIndex;
    }

    // 새로운 팝업 등록
    let additionalZIndex: number;

    if (this.popups.size === 0) {
      // 첫 번째 팝업: 추가 zIndex 0 (CSS 기본값 사용)
      additionalZIndex = 0;
      this.currentMaxAdditional = 0;

      // 첫 번째 팝업이 열리면 레이아웃에 aria-hidden 설정
      AriaHiddenManager.setLayoutAriaHidden(true);
    } else {
      // 두 번째 팝업부터: 1, 2, 3... 순으로 증가
      this.currentMaxAdditional += 1;
      additionalZIndex = this.currentMaxAdditional;
    }

    this.popups.set(id, {
      additionalZIndex,
      onStateChange,
    });

    // 모든 팝업의 상태 업데이트
    this.notifyAllPopupsStateChange();
    this.notifyGlobalListeners();

    return additionalZIndex;
  }

  // 팝업 등록 해제
  unregister(id: string): void {
    this.popups.delete(id);

    // 모든 팝업이 닫히면 초기화
    if (this.popups.size === 0) {
      this.currentMaxAdditional = -1;
      AriaHiddenManager.setLayoutAriaHidden(false);
    }

    // 남은 팝업들의 상태 업데이트
    this.notifyAllPopupsStateChange();
    this.notifyGlobalListeners();
  }

  // 현재 열려있는 팝업 개수
  getOpenCount(): number {
    return this.popups.size;
  }

  // 특정 팝업이 최상위인지 확인
  isTopPopup(id: string): boolean {
    const popupInfo = this.popups.get(id);
    if (!popupInfo) return false;

    let maxAdditional = -1;
    this.popups.forEach((info) => {
      if (info.additionalZIndex > maxAdditional) {
        maxAdditional = info.additionalZIndex;
      }
    });

    return popupInfo.additionalZIndex === maxAdditional;
  }

  // 최상위 팝업 ID 가져오기
  getTopPopupId(): string | null {
    if (this.popups.size === 0) return null;

    let maxAdditional = -1;
    let topPopupId: string | null = null;

    this.popups.forEach((info, id) => {
      if (info.additionalZIndex > maxAdditional) {
        maxAdditional = info.additionalZIndex;
        topPopupId = id;
      }
    });

    return topPopupId;
  }

  // 모든 팝업 닫기
  closeAll(): void {
    this.popups.clear();
    this.currentMaxAdditional = -1;
    AriaHiddenManager.setLayoutAriaHidden(false);
    this.notifyGlobalListeners();
  }

  // 등록된 팝업 목록 (디버깅용)
  getRegisteredPopups(): Map<string, number> {
    const result = new Map<string, number>();
    this.popups.forEach((info, id) => {
      result.set(id, info.additionalZIndex);
    });
    return result;
  }

  // 전역 리스너 등록 (PopupManager 전체 상태 변화 감지)
  addGlobalListener(listener: () => void): void {
    this.globalListeners.add(listener);
  }

  // 전역 리스너 제거
  removeGlobalListener(listener: () => void): void {
    this.globalListeners.delete(listener);
  }

  // 특정 팝업의 상태 변화 콜백 등록
  setPopupStateChangeCallback(id: string, callback: PopupChangeListener): void {
    const popupInfo = this.popups.get(id);
    if (popupInfo) {
      popupInfo.onStateChange = callback;
      this.popups.set(id, popupInfo);
    }
  }

  // 특정 팝업의 상태 변화 콜백 제거
  removePopupStateChangeCallback(id: string): void {
    const popupInfo = this.popups.get(id);
    if (popupInfo) {
      popupInfo.onStateChange = undefined;
      this.popups.set(id, popupInfo);
    }
  }

  // 모든 팝업에게 상태 변화 알림
  private notifyAllPopupsStateChange(): void {
    this.popups.forEach((info, id) => {
      if (info.onStateChange) {
        const isTop = this.isTopPopup(id);
        info.onStateChange(id, isTop);
      }
    });
  }

  // 전역 리스너들에게 알림
  private notifyGlobalListeners(): void {
    this.globalListeners.forEach((listener) => listener());
  }

  // 디버깅을 위한 현재 상태 출력
  debug(): void {
    console.log('=== PopupManager Debug ===');
    console.log('Total popups:', this.popups.size);
    console.log('Current max additional:', this.currentMaxAdditional);
    console.log('Top popup ID:', this.getTopPopupId());
    console.log('Registered popups:');
    this.popups.forEach((info, id) => {
      console.log(
        `  ${id}: additionalZIndex=${info.additionalZIndex}, isTop=${this.isTopPopup(id)}`
      );
    });
    console.log('========================');
  }
}

// 싱글톤 인스턴스
const PopupManager = new PopupManagerClass();

export default PopupManager;
