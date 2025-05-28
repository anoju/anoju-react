// src/components/common/Dialog/Alert.tsx
import React from 'react';
import Popup from './Popup';
import { Button } from '@/components/common';
import styles from '@/assets/scss/components/popup.module.scss';
import cx from '@/utils/cx';

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

interface AlertProps {
  id: string;
  options: AlertOptions;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ id, options, onClose }) => {
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

  const [isClosing, setIsClosing] = React.useState(false);

  const handleOk = () => {
    if (onOk) {
      onOk();
    }
    handleClose();
  };

  const handleClose = () => {
    if (isClosing) return; // 중복 호출 방지
    setIsClosing(true);

    // Popup의 visible을 false로 만들어 닫기 애니메이션 시작
    // 애니메이션이 완료된 후 onClose가 호출됨
    setTimeout(() => {
      onClose();
    }, 300); // Popup 애니메이션 시간과 동일
  };

  return (
    <Popup
      id={`alert-${id}`}
      visible={!isClosing}
      title={title}
      type="modal"
      className={cx(styles.alert, className)}
      width={width}
      onClose={handleClose}
      keyboard={keyboard}
      maskClosable={maskClosable}
      footer={
        <Button className="primary" onClick={handleOk} autoFocus>
          {okText}
        </Button>
      }
    >
      {typeof content === 'string' ? <p>{content}</p> : content}
    </Popup>
  );
};

export default Alert;
