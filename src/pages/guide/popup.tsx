// src/pages/guide/popup.tsx
import { useState } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight } from '@/components/common';
import { Popup, usePopup, usePopups } from '@/components/common/Popup';
import styles from '@/assets/scss/pages/guide.module.scss';

const PopupGuide = () => {
  usePageLayout({
    title: '팝업 / 컴포넌트 가이드',
    rightButtons: (
      <>
        <Button to="/" size="sm">
          Home
        </Button>
      </>
    ),
  });

  // 단일 팝업 관리
  const basicPopup = usePopup();
  const fullPopup = usePopup();
  const bottomPopup = usePopup();

  // 여러 팝업 관리
  const multiPopups = usePopups();

  // 커스텀 푸터 팝업
  const [footerPopupVisible, setFooterPopupVisible] = useState(false);

  // 콜백 이벤트 확인용
  const [eventLog, setEventLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setEventLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Popup Component</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>import</h2>
        <CodeHighlight
          code={`import { Popup, usePopup, usePopups } from '@/components/common/Popup';`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>기본 사용법 (Modal)</h2>
        <div className={styles.showcase}>
          <Button className="primary" onClick={basicPopup.open}>
            기본 팝업 열기
          </Button>

          <Popup
            title="기본 팝업"
            visible={basicPopup.visible}
            onClose={basicPopup.close}
          >
            <p>기본 모달 팝업입니다.</p>
            <p>ESC 키를 누르거나 외부 영역을 클릭하면 닫힙니다.</p>
          </Popup>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// usePopup 훅 사용
const basicPopup = usePopup();

// JSX
<Button onClick={basicPopup.open}>
  기본 팝업 열기
</Button>

<Popup
  title="기본 팝업"
  visible={basicPopup.visible}
  onClose={basicPopup.close}
>
  <p>기본 모달 팝업입니다.</p>
  <p>ESC 키를 누르거나 외부 영역을 클릭하면 닫힙니다.</p>
</Popup>`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>풀 팝업 (Full)</h2>
        <div className={styles.showcase}>
          <Button className="primary" onClick={fullPopup.open}>
            풀 팝업 열기
          </Button>

          <Popup
            type="full"
            title="풀 팝업"
            visible={fullPopup.visible}
            onClose={fullPopup.close}
          >
            <div style={{ padding: '20px' }}>
              <h2>전체 화면 팝업</h2>
              <p>화면 전체를 차지하는 풀 팝업입니다.</p>
              <p>모바일 환경에서 유용합니다.</p>
            </div>
          </Popup>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Popup
  type="full"
  title="풀 팝업"
  visible={fullPopup.visible}
  onClose={fullPopup.close}
>
  <div style={{ padding: '20px' }}>
    <h2>전체 화면 팝업</h2>
    <p>화면 전체를 차지하는 풀 팝업입니다.</p>
  </div>
</Popup>`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>바텀시트 (Bottom)</h2>
        <div className={styles.showcase}>
          <Button className="primary" onClick={bottomPopup.open}>
            바텀시트 열기
          </Button>

          <Popup
            type="bottom"
            title="바텀시트"
            visible={bottomPopup.visible}
            onClose={bottomPopup.close}
          >
            <div style={{ padding: '20px' }}>
              <h3>바텀시트 팝업</h3>
              <p>화면 하단에서 올라오는 바텀시트입니다.</p>
              <p>모바일 UI에서 자주 사용됩니다.</p>
              <ul>
                <li>옵션 1</li>
                <li>옵션 2</li>
                <li>옵션 3</li>
              </ul>
            </div>
          </Popup>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Popup
  type="bottom"
  title="바텀시트"
  visible={bottomPopup.visible}
  onClose={bottomPopup.close}
>
  <div style={{ padding: '20px' }}>
    <h3>바텀시트 팝업</h3>
    <p>화면 하단에서 올라오는 바텀시트입니다.</p>
  </div>
</Popup>`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>커스텀 푸터</h2>
        <div className={styles.showcase}>
          <Button className="primary" onClick={() => setFooterPopupVisible(true)}>
            푸터가 있는 팝업
          </Button>

          <Popup
            title="확인이 필요한 팝업"
            visible={footerPopupVisible}
            onClose={() => setFooterPopupVisible(false)}
            footer={
              <>
                <Button className="line" onClick={() => setFooterPopupVisible(false)}>
                  취소
                </Button>
                <Button 
                  className="primary" 
                  onClick={() => {
                    alert('확인되었습니다!');
                    setFooterPopupVisible(false);
                  }}
                >
                  확인
                </Button>
              </>
            }
          >
            <p>정말로 삭제하시겠습니까?</p>
            <p>이 작업은 되돌릴 수 없습니다.</p>
          </Popup>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>여러 팝업 관리</h2>
        <div className={styles.showcase}>
          <div className={styles['control-buttons']}>
            <Button className="primary" onClick={() => multiPopups.open('popup1')}>
              팝업 1 열기
            </Button>
            <Button className="primary" onClick={() => multiPopups.open('popup2')}>
              팝업 2 열기
            </Button>
            <Button className="primary" onClick={() => multiPopups.open('popup3')}>
              팝업 3 열기
            </Button>
          </div>

          <Popup
            id="popup1"
            title="첫 번째 팝업"
            visible={multiPopups.isOpen('popup1')}
            onClose={() => multiPopups.close('popup1')}
          >
            <p>첫 번째 팝업입니다.</p>
            <Button 
              className="primary" 
              onClick={() => multiPopups.open('popup2')}
            >
              두 번째 팝업 열기
            </Button>
          </Popup>

          <Popup
            id="popup2"
            title="두 번째 팝업"
            visible={multiPopups.isOpen('popup2')}
            onClose={() => multiPopups.close('popup2')}
          >
            <p>두 번째 팝업입니다.</p>
            <p>첫 번째 팝업 위에 표시됩니다.</p>
            <Button 
              className="primary" 
              onClick={() => multiPopups.open('popup3')}
            >
              세 번째 팝업 열기
            </Button>
          </Popup>

          <Popup
            id="popup3"
            title="세 번째 팝업"
            visible={multiPopups.isOpen('popup3')}
            onClose={() => multiPopups.close('popup3')}
          >
            <p>세 번째 팝업입니다.</p>
            <p>가장 위에 표시됩니다.</p>
          </Popup>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>콜백 이벤트</h2>
        <div className={styles.showcase}>
          <Button 
            className="primary" 
            onClick={() => {
              setEventLog([]);
              basicPopup.open();
            }}
          >
            이벤트 확인 팝업 열기
          </Button>

          <Popup
            title="이벤트 확인 팝업"
            visible={basicPopup.visible}
            onClose={() => {
              addLog('onClose 호출됨');
              basicPopup.close();
            }}
            afterOpen={() => {
              addLog('afterOpen 호출됨');
            }}
            afterClose={() => {
              addLog('afterClose 호출됨');
            }}
          >
            <p>팝업 열기/닫기 시 콜백 이벤트가 발생합니다.</p>
            <p>아래 로그를 확인하세요.</p>
          </Popup>

          {eventLog.length > 0 && (
            <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
              <h4>이벤트 로그:</h4>
              {eventLog.map((log, index) => (
                <div key={index} style={{ fontSize: '12px', marginTop: '4px' }}>
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PopupGuide;
