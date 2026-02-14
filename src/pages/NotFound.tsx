import { FC, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common';
import { useLayout } from '@/contexts/LayoutContext';

const NotFound: FC = () => {
  const navigate = useNavigate();
  const { updateConfig } = useLayout();

  // 헤더 설정: 제목 "Error"
  const layoutConfig = useMemo(
    () => ({
      title: 'Error',
      showBackButton: true,
      showFooter: false,
    }),
    []
  );

  useEffect(() => {
    updateConfig(layoutConfig);
  }, [updateConfig, layoutConfig]);

  return (
    <div className="d-flex flex-column align-center justify-center h-100p">
      <div className="ta-center">
        <div className="fz-40 fw-bold mb-20">404</div>
        <div className="fz-18 mb-30">페이지를 찾을 수 없습니다.</div>
        <Button onClick={() => navigate('/')} className="primary" size="lg">
          메인으로 이동
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
