// src/components/common/Dialog/ConfirmComponent.tsx
import React from 'react';
import Popup from '../Popup/Popup';
import { Button } from '@/components/common';

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

interface ConfirmComponentProps {
  id: string;
  options: ConfirmOptions;
  onClose: (result: boolean) => void;
}

const ConfirmComponent: React.FC<ConfirmComponentProps> = ({ 
  id, 
  options, 
  onClose 
}) => {
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
  const [isClosing, setIsClosing] = React.useState(false);

  const handleOk = async () => {
    if (onOk) {
      try {
        setLoading(true);
        await onOk();
        handleClose(true);
      } catch (error) {
        console.error('Error in confirm onOk:', error);
        setLoading(false);
      }
    } else {
      handleClose(true);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    handleClose(false);
  };

  const handleClose = (result: boolean) => {
    if (isClosing) return; // 중복 호출 방지
    setIsClosing(true);
    
    // 애니메이션 완료 후 정리
    setTimeout(() => {
      onClose(result);
    }, 300);
  };

  // ESC 키나 외부 클릭으로 닫을 때는 취소로 처리
  const handlePopupClose = () => {
    handleCancel();
  };

  return (
    <Popup
      id={`confirm-${id}`}
      visible={!isClosing}
      title={title}
      type="modal"
      className={`alert ${className}`}
      width={width}
      onClose={handlePopupClose}
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

export default ConfirmComponent;
