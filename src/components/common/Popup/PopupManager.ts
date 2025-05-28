// src/components/common/Popup/PopupManager.ts

class PopupManagerClass {
  private popups: Map<string, number> = new Map();
  private currentMaxAdditional: number = -1; // 현재 최대 추가 z-index (-1부터 시작)
  private listeners: Set<() => void> = new Set();

  // 팝업 등록 및 추가 z-index 반환
  register(id: string): number {
    // 이미 등록된 팝업인지 확인
    if (this.popups.has(id)) {
      // 이미 등록된 팝업이면 기존 값 반환
      return this.popups.get(id)!;
    }
    
    // 새로운 팝업 등록
    let additionalZIndex: number;
    
    if (this.popups.size === 0) {
      // 첫 번째 팝업: 추가 zIndex 0 (CSS 기본값 사용)
      additionalZIndex = 0;
      this.currentMaxAdditional = 0;
    } else {
      // 두 번째 팝업부터: 1, 2, 3... 순으로 증가
      this.currentMaxAdditional += 1;
      additionalZIndex = this.currentMaxAdditional;
    }
    
    this.popups.set(id, additionalZIndex);
    this.notifyListeners();
    
    return additionalZIndex;
  }

  // 팝업 등록 해제
  unregister(id: string): void {
    this.popups.delete(id);
    this.notifyListeners();
    
    // 모든 팝업이 닫히면 초기화
    if (this.popups.size === 0) {
      this.currentMaxAdditional = -1;
    }
  }

  // 현재 열려있는 팝업 개수
  getOpenCount(): number {
    return this.popups.size;
  }

  // 특정 팝업이 최상위인지 확인
  isTopPopup(id: string): boolean {
    const popupAdditional = this.popups.get(id);
    if (popupAdditional === undefined) return false;
    
    let maxAdditional = -1;
    this.popups.forEach((additional) => {
      if (additional > maxAdditional) {
        maxAdditional = additional;
      }
    });
    
    return popupAdditional === maxAdditional;
  }

  // 모든 팝업 닫기
  closeAll(): void {
    this.popups.clear();
    this.currentMaxAdditional = -1;
    this.notifyListeners();
  }

  // 등록된 팝업 목록 (디버깅용)
  getRegisteredPopups(): Map<string, number> {
    return new Map(this.popups);
  }

  // 리스너 등록
  addListener(listener: () => void): void {
    this.listeners.add(listener);
  }

  // 리스너 제거
  removeListener(listener: () => void): void {
    this.listeners.delete(listener);
  }

  // 리스너들에게 알림
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

// 싱글톤 인스턴스
const PopupManager = new PopupManagerClass();

export default PopupManager;