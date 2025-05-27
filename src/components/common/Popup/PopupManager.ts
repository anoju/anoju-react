// src/components/common/Popup/PopupManager.ts

class PopupManagerClass {
  private popups: Map<string, number> = new Map();
  private baseZIndex: number = 1000;
  private currentZIndex: number = this.baseZIndex;
  private listeners: Set<() => void> = new Set();

  // 팝업 등록 및 z-index 반환
  register(id: string): number {
    this.currentZIndex += 10;
    this.popups.set(id, this.currentZIndex);
    this.notifyListeners();
    return this.currentZIndex;
  }

  // 팝업 등록 해제
  unregister(id: string): void {
    this.popups.delete(id);
    this.notifyListeners();
    
    // 모든 팝업이 닫히면 z-index 초기화
    if (this.popups.size === 0) {
      this.currentZIndex = this.baseZIndex;
    }
  }

  // 현재 열려있는 팝업 개수
  getOpenCount(): number {
    return this.popups.size;
  }

  // 특정 팝업이 최상위인지 확인
  isTopPopup(id: string): boolean {
    const popupZIndex = this.popups.get(id);
    if (!popupZIndex) return false;
    
    let maxZIndex = 0;
    this.popups.forEach((zIndex) => {
      if (zIndex > maxZIndex) {
        maxZIndex = zIndex;
      }
    });
    
    return popupZIndex === maxZIndex;
  }

  // 모든 팝업 닫기
  closeAll(): void {
    this.popups.clear();
    this.currentZIndex = this.baseZIndex;
    this.notifyListeners();
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
