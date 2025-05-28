// src/components/common/Popup/PopupManager.ts
import AriaHiddenManager from '@/utils/AriaHiddenManager';

type PopupChangeListener = (id: string, isTopPopup: boolean) => void;

// 팝업 우선순위 타입
export type PopupPriority = 'normal' | 'high';

// 팝업 우선순위 상수
export const POPUP_PRIORITY = {
  NORMAL: 'normal' as const,
  HIGH: 'high' as const,
} as const;

interface PopupInfo {
  additionalZIndex: number;
  priority: PopupPriority;
  onStateChange?: PopupChangeListener;
}

class PopupManagerClass {
  private popups: Map<string, PopupInfo> = new Map();
  private currentMaxNormal: number = -1; // 일반 팝업의 현재 최대 추가 z-index
  private currentMaxHigh: number = -1; // 고우선순위 팝업의 현재 최대 추가 z-index
  private globalListeners: Set<() => void> = new Set();
  
  // 기본 z-index 값들
  private readonly BASE_Z_INDEX = 200; // 일반 팝업 기본 z-index
  private readonly HIGH_PRIORITY_BASE_Z_INDEX = 2000; // 고우선순위 팝업 기본 z-index

  // 팝업 등록 및 추가 z-index 반환
  register(
    id: string, 
    priority: PopupPriority = POPUP_PRIORITY.NORMAL,
    onStateChange?: PopupChangeListener
  ): number {
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

    let additionalZIndex: number;

    if (priority === POPUP_PRIORITY.HIGH) {
      // 고우선순위 팝업 처리
      if (this.getHighPriorityCount() === 0) {
        // 첫 번째 고우선순위 팝업: 기본 z-index 사용 (2000)
        additionalZIndex = 0;
        this.currentMaxHigh = 0;
      } else {
        // 두 번째 고우선순위 팝업부터: 1, 2, 3... 순으로 증가
        this.currentMaxHigh += 1;
        additionalZIndex = this.currentMaxHigh;
      }
    } else {
      // 일반 팝업 처리
      if (this.getNormalPriorityCount() === 0) {
        // 첫 번째 일반 팝업: 기본 z-index 사용 (200)
        additionalZIndex = 0;
        this.currentMaxNormal = 0;
      } else {
        // 두 번째 일반 팝업부터: 1, 2, 3... 순으로 증가
        this.currentMaxNormal += 1;
        additionalZIndex = this.currentMaxNormal;
      }
    }

    this.popups.set(id, {
      additionalZIndex,
      priority,
      onStateChange,
    });

    // 첫 번째 팝업이 열리면 레이아웃에 aria-hidden 설정
    if (this.popups.size === 1) {
      AriaHiddenManager.setLayoutAriaHidden(true);
    }

    // 상태 변화 알림을 비동기로 처리 (React 상태 업데이트 후 실행)
    setTimeout(() => {
      this.notifyAllPopupsStateChange();
      this.notifyGlobalListeners();
    }, 0);

    return additionalZIndex;
  }

  // 팝업 등록 해제
  unregister(id: string): void {
    const popupInfo = this.popups.get(id);
    if (!popupInfo) return;

    this.popups.delete(id);

    // 모든 팝업이 닫히면 초기화
    if (this.popups.size === 0) {
      this.currentMaxNormal = -1;
      this.currentMaxHigh = -1;
      AriaHiddenManager.setLayoutAriaHidden(false);
    } else {
      // 해당 우선순위의 팝업이 모두 닫히면 해당 우선순위 카운터 초기화
      if (popupInfo.priority === POPUP_PRIORITY.HIGH && this.getHighPriorityCount() === 0) {
        this.currentMaxHigh = -1;
      } else if (popupInfo.priority === POPUP_PRIORITY.NORMAL && this.getNormalPriorityCount() === 0) {
        this.currentMaxNormal = -1;
      }
    }

    // 상태 변화 알림을 비동기로 처리
    setTimeout(() => {
      this.notifyAllPopupsStateChange();
      this.notifyGlobalListeners();
    }, 0);
  }

  // 일반 우선순위 팝업 개수
  private getNormalPriorityCount(): number {
    return Array.from(this.popups.values()).filter(
      info => info.priority === POPUP_PRIORITY.NORMAL
    ).length;
  }

  // 고우선순위 팝업 개수
  private getHighPriorityCount(): number {
    return Array.from(this.popups.values()).filter(
      info => info.priority === POPUP_PRIORITY.HIGH
    ).length;
  }

  // 현재 열려있는 팝업 개수
  getOpenCount(): number {
    return this.popups.size;
  }

  // 특정 팝업이 최상위인지 확인
  isTopPopup(id: string): boolean {
    const popupInfo = this.popups.get(id);
    if (!popupInfo) return false;

    // 고우선순위 팝업이 있는 경우
    const highPriorityPopups = Array.from(this.popups.entries()).filter(
      ([, info]) => info.priority === POPUP_PRIORITY.HIGH
    );

    if (highPriorityPopups.length > 0) {
      // 고우선순위 팝업 중에서 최상위 확인
      if (popupInfo.priority === POPUP_PRIORITY.HIGH) {
        let maxAdditional = -1;
        highPriorityPopups.forEach(([, info]) => {
          if (info.additionalZIndex > maxAdditional) {
            maxAdditional = info.additionalZIndex;
          }
        });
        return popupInfo.additionalZIndex === maxAdditional;
      } else {
        // 일반 팝업은 고우선순위 팝업이 있으면 최상위가 될 수 없음
        return false;
      }
    } else {
      // 고우선순위 팝업이 없는 경우, 일반 팝업 중에서 최상위 확인
      let maxAdditional = -1;
      this.popups.forEach((info) => {
        if (info.priority === POPUP_PRIORITY.NORMAL && info.additionalZIndex > maxAdditional) {
          maxAdditional = info.additionalZIndex;
        }
      });
      return popupInfo.additionalZIndex === maxAdditional;
    }
  }

  // 최상위 팝업 ID 가져오기
  getTopPopupId(): string | null {
    if (this.popups.size === 0) return null;

    // 먼저 고우선순위 팝업 확인
    const highPriorityPopups = Array.from(this.popups.entries()).filter(
      ([, info]) => info.priority === POPUP_PRIORITY.HIGH
    );

    if (highPriorityPopups.length > 0) {
      let maxAdditional = -1;
      let topPopupId: string | null = null;

      highPriorityPopups.forEach(([id, info]) => {
        if (info.additionalZIndex > maxAdditional) {
          maxAdditional = info.additionalZIndex;
          topPopupId = id;
        }
      });

      return topPopupId;
    } else {
      // 고우선순위 팝업이 없으면 일반 팝업 중에서 찾기
      let maxAdditional = -1;
      let topPopupId: string | null = null;

      this.popups.forEach((info, id) => {
        if (info.priority === POPUP_PRIORITY.NORMAL && info.additionalZIndex > maxAdditional) {
          maxAdditional = info.additionalZIndex;
          topPopupId = id;
        }
      });

      return topPopupId;
    }
  }

  // 특정 우선순위의 최상위 팝업 ID 가져오기
  getTopPopupIdByPriority(priority: PopupPriority): string | null {
    const popupsOfPriority = Array.from(this.popups.entries()).filter(
      ([, info]) => info.priority === priority
    );

    if (popupsOfPriority.length === 0) return null;

    let maxAdditional = -1;
    let topPopupId: string | null = null;

    popupsOfPriority.forEach(([id, info]) => {
      if (info.additionalZIndex > maxAdditional) {
        maxAdditional = info.additionalZIndex;
        topPopupId = id;
      }
    });

    return topPopupId;
  }

  // 실제 z-index 값 계산
  calculateActualZIndex(id: string): number {
    const popupInfo = this.popups.get(id);
    if (!popupInfo) return this.BASE_Z_INDEX;

    const baseZIndex = popupInfo.priority === POPUP_PRIORITY.HIGH 
      ? this.HIGH_PRIORITY_BASE_Z_INDEX 
      : this.BASE_Z_INDEX;

    return popupInfo.additionalZIndex === 0 
      ? baseZIndex 
      : baseZIndex + popupInfo.additionalZIndex;
  }

  // 모든 팝업 닫기
  closeAll(): void {
    this.popups.clear();
    this.currentMaxNormal = -1;
    this.currentMaxHigh = -1;
    AriaHiddenManager.setLayoutAriaHidden(false);
    this.notifyGlobalListeners();
  }

  // 등록된 팝업 목록 (디버깅용)
  getRegisteredPopups(): Map<string, { zIndex: number; priority: PopupPriority }> {
    const result = new Map<string, { zIndex: number; priority: PopupPriority }>();
    this.popups.forEach((info, id) => {
      result.set(id, {
        zIndex: this.calculateActualZIndex(id),
        priority: info.priority,
      });
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
      
      // 콜백 등록 즉시 현재 상태 알림
      const isTop = this.isTopPopup(id);
      callback(id, isTop);
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

  // 강제로 모든 팝업 상태 업데이트 (외부에서 호출 가능)
  forceUpdateAllPopupsState(): void {
    this.notifyAllPopupsStateChange();
  }

  // 모든 팝업에게 상태 변화 알림
  private notifyAllPopupsStateChange(): void {
    this.popups.forEach((info, id) => {
      if (info.onStateChange) {
        const isTop = this.isTopPopup(id);
        // 다음 틱에서 실행하여 React 상태 업데이트와 동기화
        setTimeout(() => {
          info.onStateChange?.(id, isTop);
        }, 0);
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
    console.log('Normal priority count:', this.getNormalPriorityCount());
    console.log('High priority count:', this.getHighPriorityCount());
    console.log('Current max normal:', this.currentMaxNormal);
    console.log('Current max high:', this.currentMaxHigh);
    console.log('Top popup ID:', this.getTopPopupId());
    console.log('Registered popups:');
    this.popups.forEach((info, id) => {
      console.log(
        `  ${id}: priority=${info.priority}, additionalZIndex=${info.additionalZIndex}, actualZIndex=${this.calculateActualZIndex(id)}, isTop=${this.isTopPopup(id)}`
      );
    });
    console.log('========================');
  }
}

// 싱글톤 인스턴스
const PopupManager = new PopupManagerClass();

export default PopupManager;
