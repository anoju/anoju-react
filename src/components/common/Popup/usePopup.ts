// src/components/common/Popup/usePopup.ts
import { useState, useCallback, useEffect } from 'react';
import PopupManager from './PopupManager';

export interface UsePopupReturn {
  visible: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setVisible: (visible: boolean) => void;
}

export const usePopup = (defaultVisible = false): UsePopupReturn => {
  const [visible, setVisible] = useState(defaultVisible);

  const open = useCallback(() => {
    setVisible(true);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  const toggle = useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  return {
    visible,
    open,
    close,
    toggle,
    setVisible,
  };
};

// 여러 팝업을 관리하기 위한 훅
export interface UsePopupsReturn {
  popups: Record<string, boolean>;
  open: (id: string) => void;
  close: (id: string) => void;
  toggle: (id: string) => void;
  closeAll: () => void;
  isOpen: (id: string) => boolean;
  getOpenPopupIds: () => string[];
  getOpenCount: () => number;
  isTopPopup: (id: string) => boolean;
  getTopPopupId: () => string | null;
}

export const usePopups = (): UsePopupsReturn => {
  const [popups, setPopups] = useState<Record<string, boolean>>({});
  const [, forceUpdate] = useState<number>(0);

  // PopupManager의 상태 변화를 감지하여 강제 업데이트
  const handleManagerChange = useCallback(() => {
    forceUpdate(prev => prev + 1);
  }, []);

  // PopupManager의 전역 리스너 등록
  useEffect(() => {
    PopupManager.addGlobalListener(handleManagerChange);
    
    return () => {
      PopupManager.removeGlobalListener(handleManagerChange);
    };
  }, [handleManagerChange]);

  const open = useCallback((id: string) => {
    setPopups((prev) => {
      const newPopups = { ...prev, [id]: true };
      return newPopups;
    });
  }, []);

  const close = useCallback((id: string) => {
    setPopups((prev) => {
      const newPopups = { ...prev, [id]: false };
      return newPopups;
    });
  }, []);

  const toggle = useCallback((id: string) => {
    setPopups((prev) => {
      const newPopups = { ...prev, [id]: !prev[id] };
      return newPopups;
    });
  }, []);

  const closeAll = useCallback(() => {
    setPopups({});
    // PopupManager도 초기화
    PopupManager.closeAll();
  }, []);

  const isOpen = useCallback((id: string) => {
    return !!popups[id];
  }, [popups]);

  // 현재 열려있는 팝업 ID 목록
  const getOpenPopupIds = useCallback(() => {
    return Object.keys(popups).filter(id => popups[id]);
  }, [popups]);

  // 현재 열려있는 팝업 개수
  const getOpenCount = useCallback(() => {
    return getOpenPopupIds().length;
  }, [getOpenPopupIds]);

  // 특정 팝업이 최상위인지 확인 (PopupManager와 동기화)
  const isTopPopup = useCallback((id: string) => {
    return PopupManager.isTopPopup(id);
  }, []);

  // 최상위 팝업 ID 가져오기
  const getTopPopupId = useCallback(() => {
    return PopupManager.getTopPopupId();
  }, []);

  return {
    popups,
    open,
    close,
    toggle,
    closeAll,
    isOpen,
    getOpenPopupIds,
    getOpenCount,
    isTopPopup,
    getTopPopupId,
  };
};
