// src/components/common/Popup/usePopup.ts
import { useState, useCallback, useRef } from 'react';
import { PopupProps } from './Popup';

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
}

export const usePopups = (): UsePopupsReturn => {
  const [popups, setPopups] = useState<Record<string, boolean>>({});

  const open = useCallback((id: string) => {
    setPopups((prev) => ({ ...prev, [id]: true }));
  }, []);

  const close = useCallback((id: string) => {
    setPopups((prev) => ({ ...prev, [id]: false }));
  }, []);

  const toggle = useCallback((id: string) => {
    setPopups((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const closeAll = useCallback(() => {
    setPopups({});
  }, []);

  const isOpen = useCallback((id: string) => {
    return !!popups[id];
  }, [popups]);

  return {
    popups,
    open,
    close,
    toggle,
    closeAll,
    isOpen,
  };
};
