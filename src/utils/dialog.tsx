// src/utils/dialog.tsx
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import Popup from '@/components/common/Popup/Popup';
import { Button } from '@/components/common';

// 알럿 옵션 인터페이스
export interface AlertOptions {
  title?: string;
  content?: React.ReactNode;
  okText?: string;
  className?: string;
  width?: string | number;
  onOk?: () => void;
  keyboard?: boolean;
  maskClosable?: boolean;
}

// 컨펌 옵션 인터페이스
export interface ConfirmOptions {
  title?: string;
  content?: React.ReactNode;
  okText?: string;
  cancelText?: string;
  className?: string;
  width?: string | number;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
  keyboard?: boolean;
  maskClosable?: boolean;
}

// 다이얼로그 인스턴스 관리
interface DialogInstance {
  id: string;
  root: Root;
  container: HTMLDivElement;
  destroy: () => void;
}

// 활성 다이얼로그 인스턴스들
const activeDialogs: Map<string, DialogInstance> = new Map();

// 고유 ID 생성
let dialogCounter = 0;
const generateDialogId = (): string => {
  return `dialog_${++dialogCounter}_${Date.now()}`;
};

// 다이얼로그 컨테이너 생성
const createDialogContainer = (id: string): HTMLDivElement => {
  const container = document.createElement('div');
  container.id = `dialog-container-${id}`;
  container.style.position = 'relative';
  container.style.zIndex = '1000';
  document.body.appendChild(container);
  return container;
};

// 다이얼로그 정리
const cleanupDialog = (id: string): void => {
  const instance = activeDialogs.get(id);
  if (instance) {
    // React 루트 언마운트
    setTimeout(() => {
      try {
        instance.root.unmount();
      } catch (error) {
        console.warn('Error unmounting dialog root:', error);
      }
      
      // DOM 요소 제거
      if (instance.container && instance.container.parentNode) {
        instance.container.parentNode.removeChild(instance.container);
      }
    }, 100);
    
    activeDialogs.delete(id);
  }
};

// 모든 다이얼로그 정리
const cleanupAllDialogs = (): void => {
  activeDialogs.forEach((_, id) => {
    cleanupDialog(id);
  });
  activeDialogs.clear();
};

// 알럿 컴포넌트
interface AlertComponentProps {
  id: string;
  options: AlertOptions;
}

const AlertComponent: React.FC<AlertComponentProps> = ({ id, options }) => {
  const {
    title = '알림',
    content,
    okText = '확인',
    className = '',
    width = 400,
    onOk,
    keyboard = true,
    maskClosable = false,
  } = options;

  const handleOk = () => {
    if (onOk) {
      onOk();
    }
    cleanupDialog(id);
  };

  const handleClose = () => {
    cleanupDialog(id);
  };

  return (
    <Popup
      id={`alert-${id}`}
      visible={true}
      title={title}
      type="modal"
      className={`alert ${className}`}
      width={width}
      onClose={handleClose}
      keyboard={keyboard}
      maskClosable={maskClosable}
      footer={
        <Button 
          className="primary" 
          onClick={handleOk}
          autoFocus
        >
          {okText}
        </Button>
      }
    >
      {typeof content === 'string' ? <p>{content}</p> : content}
    </Popup>
  );
};

// 컨펌 컴포넌트
interface ConfirmComponentProps {
  id: string;
  options: ConfirmOptions;
}

const ConfirmComponent: React.FC<ConfirmComponentProps> = ({ id, options }) => {
  const {
    title = '확인',
    content,
    okText = '확인',
    cancelText = '취소',
    className = '',
    width = 400,
    onOk,
    onCancel,
    keyboard = true,
    maskClosable = false,
  } = options;

  const [loading, setLoading] = React.useState(false);

  const handleOk = async () => {
    if (onOk) {
      try {
        setLoading(true);
        await onOk();
        cleanupDialog(id);
      } catch (error) {
        console.error('Error in confirm onOk:', error);
        setLoading(false);
      }
    } else {
      cleanupDialog(id);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    cleanupDialog(id);
  };

  const handleClose = () => {
    handleCancel();
  };

  return (
    <Popup
      id={`confirm-${id}`}
      visible={true}
      title={title}
      type="modal"
      className={`alert ${className}`}
      width={width}
      onClose={handleClose}
      keyboard={keyboard}
      maskClosable={maskClosable}
      footer={
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button 
            onClick={handleCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button 
            className="primary" 
            onClick={handleOk}
            disabled={loading}
            autoFocus
          >
            {loading ? '처리 중...' : okText}
          </Button>
        </div>
      }
    >
      {typeof content === 'string' ? <p>{content}</p> : content}
    </Popup>
  );
};

// 알럿 함수
export const $alert = (
  content: React.ReactNode,
  options: Omit<AlertOptions, 'content'> = {}
): Promise<void> => {
  return new Promise((resolve) => {
    const id = generateDialogId();
    const container = createDialogContainer(id);
    const root = createRoot(container);
    
    const alertOptions: AlertOptions = {
      ...options,
      content,
      onOk: () => {
        if (options.onOk) {
          options.onOk();
        }
        resolve();
      },
    };

    // 인스턴스 저장
    const instance: DialogInstance = {
      id,
      root,
      container,
      destroy: () => cleanupDialog(id),
    };
    
    activeDialogs.set(id, instance);

    // 컴포넌트 렌더링
    root.render(<AlertComponent id={id} options={alertOptions} />);
  });
};

// 컨펌 함수
export const $confirm = (
  content: React.ReactNode,
  options: Omit<ConfirmOptions, 'content'> = {}
): Promise<boolean> => {
  return new Promise((resolve) => {
    const id = generateDialogId();
    const container = createDialogContainer(id);
    const root = createRoot(container);
    
    const confirmOptions: ConfirmOptions = {
      ...options,
      content,
      onOk: async () => {
        if (options.onOk) {
          await options.onOk();
        }
        resolve(true);
      },
      onCancel: () => {
        if (options.onCancel) {
          options.onCancel();
        }
        resolve(false);
      },
    };

    // 인스턴스 저장
    const instance: DialogInstance = {
      id,
      root,
      container,
      destroy: () => cleanupDialog(id),
    };
    
    activeDialogs.set(id, instance);

    // 컴포넌트 렌더링
    root.render(<ConfirmComponent id={id} options={confirmOptions} />);
  });
};

// 편의 함수들
export const alert = $alert;
export const confirm = $confirm;

// 모든 다이얼로그 닫기
export const closeAllDialogs = (): void => {
  cleanupAllDialogs();
};

// 활성 다이얼로그 개수 확인
export const getActiveDialogCount = (): number => {
  return activeDialogs.size;
};

// 브라우저 새로고침/종료 시 정리
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', cleanupAllDialogs);
}

// 기본 내보내기
export default {
  $alert,
  $confirm,
  alert,
  confirm,
  closeAllDialogs,
  getActiveDialogCount,
};
