// src/pages/guide/popup.tsx
import { useState } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import {
  Button,
  CodeHighlight,
  Popup,
  usePopup,
  usePopups,
} from '@/components/common';
import { $alert, $confirm } from '@/utils/dialog';
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

  // 팝업 상태 관리
  const [basicPopupVisible, setBasicPopupVisible] = useState(false);
  const [fullPopupVisible, setFullPopupVisible] = useState(false);
  const [bottomPopupVisible, setBottomPopupVisible] = useState(false);
  const [footerPopupVisible, setFooterPopupVisible] = useState(false);
  const [eventPopupVisible, setEventPopupVisible] = useState(false);
  const [optionPopupVisible, setOptionPopupVisible] = useState(false);

  // 여러 팝업 상태
  const [popup1Visible, setPopup1Visible] = useState(false);
  const [popup2Visible, setPopup2Visible] = useState(false);
  const [popup3Visible, setPopup3Visible] = useState(false);

  // 콜백 이벤트 확인용
  const [eventLog, setEventLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setEventLog((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  // usePopup 훅 사용 예제 컴포넌트
  const HookPopupExample = () => {
    const popup = usePopup();

    return (
      <>
        <Button className="primary" onClick={popup.open}>
          usePopup 훅으로 팝업 열기
        </Button>

        <Popup
          title="usePopup 훅 사용 예제"
          visible={popup.visible}
          onClose={popup.close}
        >
          <p>usePopup 훅을 사용하면 상태 관리가 간편해집니다.</p>
          <div style={{ marginTop: '16px' }}>
            <Button
              className="line"
              onClick={popup.close}
              style={{ marginRight: '8px' }}
            >
              닫기
            </Button>
            <Button className="primary" onClick={popup.toggle}>
              토글
            </Button>
          </div>
        </Popup>
      </>
    );
  };

  // usePopups 훅 사용 예제 컴포넌트
  const MultiplePopupExample = () => {
    const popups = usePopups();

    return (
      <>
        <div className={styles['control-buttons']}>
          <Button
            className="primary"
            onClick={() => popups.open('hook-popup1')}
          >
            팝업 1 열기
          </Button>
          <Button
            className="primary"
            onClick={() => popups.open('hook-popup2')}
          >
            팝업 2 열기
          </Button>
          <Button className="line" onClick={popups.closeAll}>
            모든 팝업 닫기
          </Button>
        </div>

        <Popup
          title="usePopups - 첫 번째 팝업"
          visible={popups.isOpen('hook-popup1')}
          onClose={() => popups.close('hook-popup1')}
        >
          <p>usePopups 훅으로 관리되는 첫 번째 팝업입니다.</p>
          <Button
            className="primary"
            onClick={() => popups.open('hook-popup2')}
          >
            두 번째 팝업 열기
          </Button>
        </Popup>

        <Popup
          title="usePopups - 두 번째 팝업"
          visible={popups.isOpen('hook-popup2')}
          onClose={() => popups.close('hook-popup2')}
        >
          <p>usePopups 훅으로 관리되는 두 번째 팝업입니다.</p>
        </Popup>
      </>
    );
  };

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Popup Component</h1>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>import</h2>
        <CodeHighlight
          code={`import { Popup } from '@/components/common';
// 훅도 함께 사용하는 경우
import { Popup, usePopup, usePopups } from '@/components/common';
// Alert, Confirm 함수 사용하는 경우
import { $alert, $confirm } from '@/utils/dialog';`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>$alert 함수 사용법</h2>
        <p className={styles.txt}>
          $alert 함수를 사용하면 프로그래밍 방식으로 간단한 알림 팝업을 표시할
          수 있습니다.
        </p>

        <div className={styles.showcase}>
          <div className={styles['control-buttons']}>
            <Button
              className="primary"
              onClick={() => $alert('기본 알림 메시지입니다.')}
            >
              기본 알럿
            </Button>

            <Button
              className="primary"
              onClick={() =>
                $alert('커스텀 제목 알림입니다.', {
                  title: '커스텀 제목',
                  okText: '확인했습니다',
                  onOk: () => console.log('알럿 확인됨'),
                })
              }
            >
              커스텀 알럿
            </Button>

            <Button
              className="primary"
              onClick={() =>
                $alert(
                  <div>
                    <p>JSX 내용을 포함한 알럿입니다.</p>
                    <p style={{ color: 'red' }}>
                      중요한 정보를 강조할 수 있습니다.
                    </p>
                  </div>,
                  { title: 'JSX 내용 알럿' }
                )
              }
            >
              JSX 내용 알럿
            </Button>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`import { $alert } from '@/utils/dialog';

// 기본 알럿
$alert('기본 알림 메시지입니다.');

// 커스텀 옵션 알럿
$alert('커스텀 제목 알림입니다.', {
  title: '커스텀 제목',
  okText: '확인했습니다',
  width: 400,
  onOk: () => console.log('알럿 확인됨')
});

// JSX 내용 알럿
$alert(
  <div>
    <p>JSX 내용을 포함한 알럿입니다.</p>
    <p style={{ color: 'red' }}>중요한 정보를 강조할 수 있습니다.</p>
  </div>,
  { title: 'JSX 내용 알럿' }
);

// Promise 방식으로 사용
$alert('작업이 완료되었습니다.').then(() => {
  console.log('알럿이 닫혔습니다.');
});`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>$confirm 함수 사용법</h2>
        <p className={styles.txt}>
          $confirm 함수를 사용하면 프로그래밍 방식으로 확인/취소 팝업을 표시할
          수 있습니다.
        </p>

        <div className={styles.showcase}>
          <div className={styles['control-buttons']}>
            <Button
              className="primary"
              onClick={async () => {
                const result = await $confirm('정말로 삭제하시겠습니까?');
                if (result) {
                  $alert('삭제되었습니다.');
                } else {
                  $alert('취소되었습니다.');
                }
              }}
            >
              기본 컨펌
            </Button>

            <Button
              className="primary"
              onClick={() => {
                $confirm('이 작업을 계속하시겠습니까?', {
                  title: '작업 확인',
                  okText: '계속하기',
                  cancelText: '중단하기',
                  onOk: async () => {
                    // 비동기 작업 시뮬레이션
                    return new Promise((resolve) => {
                      setTimeout(() => {
                        console.log('작업 완료');
                        resolve();
                      }, 2000);
                    });
                  },
                  onCancel: () => console.log('작업 중단됨'),
                }).then((result) => {
                  console.log('컨펌 결과:', result);
                });
              }}
            >
              비동기 컨펌
            </Button>

            <Button
              className="primary"
              onClick={() => {
                $confirm(
                  <div>
                    <p>다음 항목들이 삭제됩니다:</p>
                    <ul style={{ margin: '16px 0', paddingLeft: '20px' }}>
                      <li>문서 1</li>
                      <li>문서 2</li>
                      <li>문서 3</li>
                    </ul>
                    <p style={{ color: 'red', fontWeight: 'bold' }}>
                      이 작업은 되돌릴 수 없습니다.
                    </p>
                  </div>,
                  {
                    title: '항목 삭제 확인',
                    okText: '삭제',
                    cancelText: '취소',
                    width: 500,
                  }
                ).then((result) => {
                  if (result) {
                    $alert('선택된 항목들이 삭제되었습니다.');
                  }
                });
              }}
            >
              상세 컨펌
            </Button>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`import { $confirm, $alert } from '@/utils/dialog';

// 기본 컨펌
const handleDelete = async () => {
  const result = await $confirm('정말로 삭제하시겠습니까?');
  if (result) {
    // 삭제 로직 실행
    $alert('삭제되었습니다.');
  }
};

// 커스텀 옵션 컨펌
$confirm('이 작업을 계속하시겠습니까?', {
  title: '작업 확인',
  okText: '계속하기',
  cancelText: '중단하기',
  width: 400,
  onOk: async () => {
    // 비동기 작업 처리
    await performAsyncTask();
  },
  onCancel: () => {
    console.log('작업이 취소되었습니다.');
  }
}).then(result => {
  console.log('컨펌 결과:', result); // true 또는 false
});

// JSX 내용 컨펌
$confirm(
  <div>
    <p>다음 항목들이 삭제됩니다:</p>
    <ul>
      <li>문서 1</li>
      <li>문서 2</li>
    </ul>
    <p style={{ color: 'red' }}>이 작업은 되돌릴 수 없습니다.</p>
  </div>,
  { title: '삭제 확인', okText: '삭제', cancelText: '취소' }
);`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>전역 함수 사용법</h2>
        <p className={styles.txt}>
          main.tsx에서 globalDialog를 import하면 어디서든 window.$alert,
          window.$confirm을 사용할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <div className={styles['control-buttons']}>
            <Button
              className="primary"
              onClick={() => {
                if (typeof window !== 'undefined' && window.$alert) {
                  window.$alert('전역 함수로 호출된 알럿입니다!');
                }
              }}
            >
              window.$alert 사용
            </Button>

            <Button
              className="primary"
              onClick={async () => {
                if (typeof window !== 'undefined' && window.$confirm) {
                  const result =
                    await window.$confirm('전역 함수로 호출된 컨펌입니다.');
                  if (result && window.$alert) {
                    window.$alert('확인을 선택하셨습니다.');
                  }
                }
              }}
            >
              window.$confirm 사용
            </Button>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// main.tsx에서 전역 함수 등록
import '@/utils/globalDialog';

// 어디서든 사용 가능
window.$alert('전역 알럿입니다!');

// TypeScript 타입 안전성을 위한 체크
if (typeof window !== 'undefined' && window.$alert) {
  window.$alert('타입 안전한 전역 알럿');
}

// 비동기 처리
const handleGlobalConfirm = async () => {
  if (window.$confirm) {
    const result = await window.$confirm('전역 컨펌입니다.');
    console.log('결과:', result);
  }
};`}
          language="typescript"
        />
      </section>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>기본 사용법 (Modal)</h2>
        <div className={styles.showcase}>
          <Button
            className="primary"
            onClick={() => setBasicPopupVisible(true)}
          >
            기본 팝업 열기
          </Button>

          <Popup
            title="기본 팝업"
            visible={basicPopupVisible}
            onClose={() => setBasicPopupVisible(false)}
          >
            <p>기본 모달 팝업입니다.</p>
            <p>ESC 키를 누르거나 외부 영역을 클릭하면 닫힙니다.</p>
            <p>팝업은 #root 요소 밖에 렌더링됩니다.</p>
          </Popup>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 상태 관리
const [basicPopupVisible, setBasicPopupVisible] = useState(false);

// JSX
<Button onClick={() => setBasicPopupVisible(true)}>
  기본 팝업 열기
</Button>

<Popup
  title="기본 팝업"
  visible={basicPopupVisible}
  onClose={() => setBasicPopupVisible(false)}
>
  <p>기본 모달 팝업입니다.</p>
  <p>ESC 키를 누르거나 외부 영역을 클릭하면 닫힙니다.</p>
</Popup>`}
          language="typescript"
        />
      </section>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>usePopup 훅 사용법</h2>
        <p className={styles.txt}>
          usePopup 훅을 사용하면 팝업 상태를 더 간편하게 관리할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <HookPopupExample />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`import { usePopup } from '@/components/common';

const MyComponent = () => {
  const popup = usePopup();
  
  return (
    <>
      <Button className="primary" onClick={popup.open}>
        팝업 열기
      </Button>
      
      <Popup
        title="usePopup 훅 사용"
        visible={popup.visible}
        onClose={popup.close}
      >
        <p>usePopup 훅을 사용한 간편한 상태 관리</p>
        <Button onClick={popup.toggle}>토글</Button>
      </Popup>
    </>
  );
};`}
          language="typescript"
        />
      </section>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>
          usePopups 훅 (다중 팝업 관리)
        </h2>
        <p className={styles.txt}>
          usePopups 훅을 사용하면 여러 팝업을 ID로 관리할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <MultiplePopupExample />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`import { usePopups } from '@/components/common';

const MyComponent = () => {
  const popups = usePopups();
  
  return (
    <>
      <Button onClick={() => popups.open('popup1')}>팝업 1 열기</Button>
      <Button onClick={() => popups.open('popup2')}>팝업 2 열기</Button>
      <Button onClick={popups.closeAll}>모든 팝업 닫기</Button>
      
      <Popup
        title="팝업 1"
        visible={popups.isOpen('popup1')}
        onClose={() => popups.close('popup1')}
      >
        첫 번째 팝업 내용
      </Popup>
      
      <Popup
        title="팝업 2"
        visible={popups.isOpen('popup2')}
        onClose={() => popups.close('popup2')}
      >
        두 번째 팝업 내용
      </Popup>
    </>
  );
};`}
          language="typescript"
        />
      </section>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>풀 팝업 (Full)</h2>
        <div className={styles.showcase}>
          <Button className="primary" onClick={() => setFullPopupVisible(true)}>
            풀 팝업 열기
          </Button>

          <Popup
            type="full"
            title="풀 팝업"
            visible={fullPopupVisible}
            onClose={() => setFullPopupVisible(false)}
          >
            <h2>전체 화면 팝업</h2>
            <p>화면 전체를 차지하는 풀 팝업입니다.</p>
            <p>모바일 환경에서 유용합니다.</p>
            <br />
            <Button
              className="primary"
              onClick={() => setFullPopupVisible(false)}
            >
              닫기
            </Button>
          </Popup>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Popup
  type="full"
  title="풀 팝업"
  visible={fullPopupVisible}
  onClose={() => setFullPopupVisible(false)}
>
  <h2>전체 화면 팝업</h2>
  <p>화면 전체를 차지하는 풀 팝업입니다.</p>
</Popup>`}
          language="typescript"
        />
      </section>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>바텀시트 (Bottom)</h2>
        <div className={styles.showcase}>
          <Button
            className="primary"
            onClick={() => setBottomPopupVisible(true)}
          >
            바텀시트 열기
          </Button>

          <Popup
            type="bottom"
            title="바텀시트"
            visible={bottomPopupVisible}
            onClose={() => setBottomPopupVisible(false)}
          >
            <h3>바텀시트 팝업</h3>
            <p>화면 하단에서 올라오는 바텀시트입니다.</p>
            <p>모바일 UI에서 자주 사용됩니다.</p>
            <ul>
              <li>옵션 1</li>
              <li>옵션 2</li>
              <li>옵션 3</li>
              <li>옵션 4</li>
              <li>옵션 5</li>
            </ul>
          </Popup>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Popup
  type="bottom"
  title="바텀시트"
  visible={bottomPopupVisible}
  onClose={() => setBottomPopupVisible(false)}
>
  <h3>바텀시트 팝업</h3>
  <p>화면 하단에서 올라오는 바텀시트입니다.</p>
</Popup>`}
          language="typescript"
        />
      </section>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>커스텀 푸터</h2>
        <div className={styles.showcase}>
          <Button
            className="primary"
            onClick={() => setFooterPopupVisible(true)}
          >
            푸터가 있는 팝업
          </Button>

          <Popup
            title="확인이 필요한 팝업"
            visible={footerPopupVisible}
            onClose={() => setFooterPopupVisible(false)}
            footer={
              <>
                <Button
                  className="line"
                  onClick={() => setFooterPopupVisible(false)}
                >
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

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Popup
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
</Popup>`}
          language="typescript"
        />
      </section>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>여러 팝업 관리</h2>
        <div className={styles.showcase}>
          <div className={styles['control-buttons']}>
            <Button className="primary" onClick={() => setPopup1Visible(true)}>
              팝업 1 열기
            </Button>
            <Button className="primary" onClick={() => setPopup2Visible(true)}>
              팝업 2 열기
            </Button>
            <Button className="primary" onClick={() => setPopup3Visible(true)}>
              팝업 3 열기
            </Button>
          </div>

          <Popup
            id="popup1"
            title="첫 번째 팝업"
            visible={popup1Visible}
            onClose={() => setPopup1Visible(false)}
          >
            <p>첫 번째 팝업입니다.</p>
            <Button className="primary" onClick={() => setPopup2Visible(true)}>
              두 번째 팝업 열기
            </Button>
          </Popup>

          <Popup
            id="popup2"
            title="두 번째 팝업"
            visible={popup2Visible}
            onClose={() => setPopup2Visible(false)}
          >
            <p>두 번째 팝업입니다.</p>
            <p>첫 번째 팝업 위에 표시됩니다.</p>
            <Button className="primary" onClick={() => setPopup3Visible(true)}>
              세 번째 팝업 열기
            </Button>
          </Popup>

          <Popup
            id="popup3"
            title="세 번째 팝업"
            visible={popup3Visible}
            onClose={() => setPopup3Visible(false)}
          >
            <p>세 번째 팝업입니다.</p>
            <p>가장 위에 표시됩니다.</p>
          </Popup>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 각 팝업의 상태 관리
const [popup1Visible, setPopup1Visible] = useState(false);
const [popup2Visible, setPopup2Visible] = useState(false);
const [popup3Visible, setPopup3Visible] = useState(false);

// JSX
<Popup
  id="popup1"
  title="첫 번째 팝업"
  visible={popup1Visible}
  onClose={() => setPopup1Visible(false)}
>
  <p>첫 번째 팝업입니다.</p>
</Popup>

<Popup
  id="popup2"
  title="두 번째 팝업"
  visible={popup2Visible}
  onClose={() => setPopup2Visible(false)}
>
  <p>두 번째 팝업입니다.</p>
</Popup>`}
          language="typescript"
        />
      </section>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>추가 옵션들</h2>
        <p className={styles.txt}>
          다양한 옵션을 통해 팝업의 동작을 세밀하게 제어할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <div className={styles['control-buttons']}>
            <Button
              className="primary"
              onClick={() => setOptionPopupVisible(true)}
            >
              다양한 옵션 팝업 열기
            </Button>
          </div>

          <Popup
            title="다양한 옵션"
            visible={optionPopupVisible}
            onClose={() => setOptionPopupVisible(false)}
            width={500}
            closeOnEsc={true}
            maskClosable={true}
            hideCloseButton={false}
            keyboard={true}
            focusTriggerAfterClose={true}
          >
            <p>다양한 옵션들이 적용된 팝업입니다.</p>
            <ul>
              <li>width: 500px로 고정</li>
              <li>ESC 키로 닫기 가능</li>
              <li>외부 클릭으로 닫기 가능</li>
              <li>닫기 버튼 표시</li>
              <li>키보드 지원</li>
              <li>닫은 후 이전 포커스로 복원</li>
            </ul>
          </Popup>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Popup
  title="다양한 옵션"
  visible={visible}
  onClose={() => setVisible(false)}
  width={500}                     // 너비 지정
  closeOnEsc={true}              // ESC 키로 닫기
  maskClosable={true}            // 외부 클릭으로 닫기
  hideCloseButton={false}        // 닫기 버튼 표시
  keyboard={true}                // 키보드 지원
  focusTriggerAfterClose={true}  // 포커스 복원
  zIndex={1050}                  // z-index 수동 지정
>
  <p>다양한 옵션들이 적용된 팝업입니다.</p>
</Popup>`}
          language="typescript"
        />
      </section>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>콜백 이벤트</h2>
        <div className={styles.showcase}>
          <Button
            className="primary"
            onClick={() => {
              setEventLog([]);
              setEventPopupVisible(true);
            }}
          >
            이벤트 확인 팝업 열기
          </Button>

          <Popup
            title="이벤트 확인 팝업"
            visible={eventPopupVisible}
            onClose={() => {
              addLog('onClose 호출됨');
              setEventPopupVisible(false);
            }}
            onOpen={() => {
              addLog('onOpen 호출됨');
            }}
          >
            <p>팝업 열기/닫기 시 콜백 이벤트가 발생합니다.</p>
            <p>아래 로그를 확인하세요.</p>
          </Popup>

          {eventLog.length > 0 && (
            <div
              style={{
                marginTop: '20px',
                padding: '10px',
                background: '#f5f5f5',
                borderRadius: '4px',
              }}
            >
              <h4>이벤트 로그:</h4>
              {eventLog.map((log, index) => (
                <div key={index} style={{ fontSize: '12px', marginTop: '4px' }}>
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 이벤트 로그 상태
const [eventLog, setEventLog] = useState<string[]>([]);

const addLog = (message: string) => {
  setEventLog(prev => [...prev, \`\${new Date().toLocaleTimeString()}: \${message}\`]);
};

<Popup
  title="이벤트 확인 팝업"
  visible={eventPopupVisible}
  onClose={() => {
    addLog('onClose 호출됨');
    setEventPopupVisible(false);
  }}
  onOpen={() => {
    addLog('onOpen 호출됨');
  }}
>
  <p>콜백 이벤트 확인</p>
</Popup>`}
          language="typescript"
        />
      </section>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Props API</h2>
        <div className={styles.showcase}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>속성</th>
                <th>타입</th>
                <th>기본값</th>
                <th>설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>title</td>
                <td>ReactNode</td>
                <td>-</td>
                <td>팝업 제목</td>
              </tr>
              <tr>
                <td>visible</td>
                <td>boolean</td>
                <td>false</td>
                <td>팝업 표시 여부</td>
              </tr>
              <tr>
                <td>type</td>
                <td>'modal' | 'full' | 'bottom'</td>
                <td>'modal'</td>
                <td>팝업 타입</td>
              </tr>
              <tr>
                <td>width</td>
                <td>string | number</td>
                <td>-</td>
                <td>팝업 너비 (modal 타입에서만 적용)</td>
              </tr>
              <tr>
                <td>header</td>
                <td>ReactNode</td>
                <td>-</td>
                <td>커스텀 헤더 내용</td>
              </tr>
              <tr>
                <td>footer</td>
                <td>ReactNode</td>
                <td>-</td>
                <td>커스텀 푸터 내용</td>
              </tr>
              <tr>
                <td>onClose</td>
                <td>{'() => void'}</td>
                <td>-</td>
                <td>닫기 이벤트 핸들러</td>
              </tr>
              <tr>
                <td>onOpen</td>
                <td>{'() => void'}</td>
                <td>-</td>
                <td>열기 완료 이벤트 핸들러</td>
              </tr>
              <tr>
                <td>maskClosable</td>
                <td>boolean</td>
                <td>true</td>
                <td>외부 클릭으로 닫기 가능 여부</td>
              </tr>
              <tr>
                <td>closeOnEsc</td>
                <td>boolean</td>
                <td>true</td>
                <td>ESC 키로 닫기 가능 여부</td>
              </tr>
              <tr>
                <td>hideHeader</td>
                <td>boolean</td>
                <td>false</td>
                <td>헤더 숨김 여부</td>
              </tr>
              <tr>
                <td>hideCloseButton</td>
                <td>boolean</td>
                <td>false</td>
                <td>닫기 버튼 숨김 여부</td>
              </tr>
              <tr>
                <td>keyboard</td>
                <td>boolean</td>
                <td>true</td>
                <td>키보드 지원 여부</td>
              </tr>
              <tr>
                <td>focusTriggerAfterClose</td>
                <td>boolean</td>
                <td>true</td>
                <td>닫힌 후 이전 포커스 복원 여부</td>
              </tr>
              <tr>
                <td>zIndex</td>
                <td>number</td>
                <td>자동 계산</td>
                <td>z-index 값 (수동 지정 가능)</td>
              </tr>
              <tr>
                <td>className</td>
                <td>string</td>
                <td>''</td>
                <td>추가 CSS 클래스</td>
              </tr>
              <tr>
                <td>style</td>
                <td>CSSProperties</td>
                <td>-</td>
                <td>인라인 스타일</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Alert & Confirm API</h2>
        <div className={styles.showcase}>
          <h3 className={styles['sub-title']}>$alert(content, options?)</h3>
          <p className={styles.txt}>알림 팝업을 표시하는 함수입니다.</p>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>매개변수</th>
                <th>타입</th>
                <th>기본값</th>
                <th>설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>content</td>
                <td>React.ReactNode</td>
                <td>필수</td>
                <td>알림 내용 (문자열 또는 JSX)</td>
              </tr>
              <tr>
                <td>options.title</td>
                <td>string</td>
                <td>'알림'</td>
                <td>팝업 제목</td>
              </tr>
              <tr>
                <td>options.okText</td>
                <td>string</td>
                <td>'확인'</td>
                <td>확인 버튼 텍스트</td>
              </tr>
              <tr>
                <td>options.width</td>
                <td>string | number</td>
                <td>400</td>
                <td>팝업 너비</td>
              </tr>
              <tr>
                <td>options.className</td>
                <td>string</td>
                <td>''</td>
                <td>추가 CSS 클래스</td>
              </tr>
              <tr>
                <td>options.onOk</td>
                <td>{'() => void'}</td>
                <td>-</td>
                <td>확인 버튼 클릭 시 콜백</td>
              </tr>
              <tr>
                <td>options.keyboard</td>
                <td>boolean</td>
                <td>true</td>
                <td>ESC 키로 닫기 가능 여부</td>
              </tr>
              <tr>
                <td>options.maskClosable</td>
                <td>boolean</td>
                <td>false</td>
                <td>외부 클릭으로 닫기 가능 여부</td>
              </tr>
            </tbody>
          </table>

          <h3 className={styles['sub-title']}>$confirm(content, options?)</h3>
          <p className={styles.txt}>확인/취소 팝업을 표시하는 함수입니다.</p>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>매개변수</th>
                <th>타입</th>
                <th>기본값</th>
                <th>설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>content</td>
                <td>React.ReactNode</td>
                <td>필수</td>
                <td>확인 내용 (문자열 또는 JSX)</td>
              </tr>
              <tr>
                <td>options.title</td>
                <td>string</td>
                <td>'확인'</td>
                <td>팝업 제목</td>
              </tr>
              <tr>
                <td>options.okText</td>
                <td>string</td>
                <td>'확인'</td>
                <td>확인 버튼 텍스트</td>
              </tr>
              <tr>
                <td>options.cancelText</td>
                <td>string</td>
                <td>'취소'</td>
                <td>취소 버튼 텍스트</td>
              </tr>
              <tr>
                <td>options.width</td>
                <td>string | number</td>
                <td>400</td>
                <td>팝업 너비</td>
              </tr>
              <tr>
                <td>options.className</td>
                <td>string</td>
                <td>''</td>
                <td>추가 CSS 클래스</td>
              </tr>
              <tr>
                <td>options.onOk</td>
                <td>{'() => void | Promise<void>'}</td>
                <td>-</td>
                <td>확인 버튼 클릭 시 콜백 (비동기 지원)</td>
              </tr>
              <tr>
                <td>options.onCancel</td>
                <td>{'() => void'}</td>
                <td>-</td>
                <td>취소 버튼 클릭 시 콜백</td>
              </tr>
              <tr>
                <td>options.keyboard</td>
                <td>boolean</td>
                <td>true</td>
                <td>ESC 키로 닫기 가능 여부</td>
              </tr>
              <tr>
                <td>options.maskClosable</td>
                <td>boolean</td>
                <td>false</td>
                <td>외부 클릭으로 닫기 가능 여부</td>
              </tr>
            </tbody>
          </table>

          <h3 className={styles['sub-title']}>반환값</h3>
          <ul>
            <li>
              <strong>$alert:</strong> Promise&lt;void&gt; - 팝업이 닫히면
              resolve
            </li>
            <li>
              <strong>$confirm:</strong> Promise&lt;boolean&gt; - 확인 시 true,
              취소 시 false
            </li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Hook API</h2>
        <div className={styles.showcase}>
          <h3 className={styles['sub-title']}>usePopup()</h3>
          <p className={styles.txt}>단일 팝업 상태를 관리하는 훅입니다.</p>

          <div className={styles.showcase}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>속성</th>
                  <th>타입</th>
                  <th>설명</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>visible</td>
                  <td>boolean</td>
                  <td>현재 팝업 표시 상태</td>
                </tr>
                <tr>
                  <td>open</td>
                  <td>{'() => void'}</td>
                  <td>팝업 열기 함수</td>
                </tr>
                <tr>
                  <td>close</td>
                  <td>{'() => void'}</td>
                  <td>팝업 닫기 함수</td>
                </tr>
                <tr>
                  <td>toggle</td>
                  <td>{'() => void'}</td>
                  <td>팝업 열기/닫기 토글 함수</td>
                </tr>
                <tr>
                  <td>setVisible</td>
                  <td>{'(visible: boolean) => void'}</td>
                  <td>팝업 상태 직접 설정 함수</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className={styles['sub-title']}>usePopups()</h3>
          <p className={styles.txt}>여러 팝업을 ID로 관리하는 훅입니다.</p>

          <div className={styles.showcase}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>속성</th>
                  <th>타입</th>
                  <th>설명</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>popups</td>
                  <td>{'Record<string, boolean>'}</td>
                  <td>팝업 ID별 표시 상태 객체</td>
                </tr>
                <tr>
                  <td>open</td>
                  <td>{'(id: string) => void'}</td>
                  <td>특정 팝업 열기 함수</td>
                </tr>
                <tr>
                  <td>close</td>
                  <td>{'(id: string) => void'}</td>
                  <td>특정 팝업 닫기 함수</td>
                </tr>
                <tr>
                  <td>toggle</td>
                  <td>{'(id: string) => void'}</td>
                  <td>특정 팝업 토글 함수</td>
                </tr>
                <tr>
                  <td>closeAll</td>
                  <td>{'() => void'}</td>
                  <td>모든 팝업 닫기 함수</td>
                </tr>
                <tr>
                  <td>isOpen</td>
                  <td>{'(id: string) => boolean'}</td>
                  <td>특정 팝업 열림 상태 확인 함수</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>팝업 매니저 (PopupManager)</h2>
        <p className={styles.txt}>
          PopupManager는 여러 팝업의 z-index를 자동으로 관리하고, 최상위 팝업을
          추적합니다.
        </p>

        <div className={styles.showcase}>
          <h3 className={styles['sub-title']}>주요 기능</h3>
          <ul>
            <li>
              <strong>자동 z-index 관리:</strong> 팝업이 열릴 때마다 자동으로
              z-index를 증가시켜 최상위에 표시
            </li>
            <li>
              <strong>최상위 팝업 추적:</strong> ESC 키 등의 이벤트를 최상위
              팝업에서만 처리
            </li>
            <li>
              <strong>포커스 관리:</strong> 팝업 간 포커스 이동과 복원을
              자동으로 처리
            </li>
            <li>
              <strong>메모리 관리:</strong> 팝업이 닫힐 때 자동으로 정리하여
              메모리 누수 방지
            </li>
          </ul>

          <h3 className={styles['sub-title']}>동작 방식</h3>
          <ol>
            <li>팝업이 열릴 때 PopupManager에 자동 등록</li>
            <li>각 팝업은 고유한 z-index를 할당받음 (기본 1000부터 시작)</li>
            <li>새로운 팝업이 열리면 이전 팝업보다 높은 z-index 할당</li>
            <li>팝업이 닫히면 PopupManager에서 자동 제거</li>
            <li>모든 팝업이 닫히면 z-index 카운터 초기화</li>
          </ol>
        </div>
      </section>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>접근성 (Accessibility)</h2>
        <p className={styles.txt}>
          Popup 컴포넌트는 웹 접근성 표준을 준수하여 구현되었습니다.
        </p>

        <div className={styles.showcase}>
          <h3 className={styles['sub-title']}>접근성 기능</h3>
          <ul>
            <li>
              <strong>ARIA 속성:</strong> role="dialog", aria-labelledby,
              aria-hidden 등 적절한 ARIA 속성 사용
            </li>
            <li>
              <strong>키보드 내비게이션:</strong> Tab, Shift+Tab으로 팝업 내
              요소 간 이동 가능
            </li>
            <li>
              <strong>포커스 관리:</strong> 팝업 열릴 때 첫 번째 포커스 가능한
              요소로 자동 이동
            </li>
            <li>
              <strong>포커스 트랩:</strong> 팝업 내에서만 포커스가 순환하도록
              제한
            </li>
            <li>
              <strong>ESC 키 지원:</strong> ESC 키로 팝업 닫기 가능
            </li>
            <li>
              <strong>스크린 리더 지원:</strong> 팝업 제목과 내용을 스크린
              리더가 올바르게 읽을 수 있도록 구조화
            </li>
          </ul>

          <h3 className={styles['sub-title']}>권장사항</h3>
          <ul>
            <li>팝업에는 반드시 의미있는 title을 제공하세요</li>
            <li>팝업 내용은 논리적인 순서로 배치하세요</li>
            <li>중요한 동작에는 확인 팝업을 사용하세요</li>
            <li>모바일에서는 바텀시트 타입을 고려하세요</li>
          </ul>
        </div>
      </section>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>성능 최적화</h2>
        <p className={styles.txt}>
          Popup 컴포넌트는 성능을 고려하여 최적화되었습니다.
        </p>

        <div className={styles.showcase}>
          <h3 className={styles['sub-title']}>최적화 기능</h3>
          <ul>
            <li>
              <strong>Portal 렌더링:</strong> 팝업이 DOM 트리의 최상위에
              렌더링되어 스타일 간섭 방지
            </li>
            <li>
              <strong>지연 렌더링:</strong> visible이 true일 때만 DOM에 렌더링
            </li>
            <li>
              <strong>애니메이션 최적화:</strong> CSS transform과 opacity를
              사용한 하드웨어 가속
            </li>
            <li>
              <strong>이벤트 리스너 관리:</strong> 필요할 때만 이벤트 리스너
              등록/해제
            </li>
            <li>
              <strong>메모리 정리:</strong> 팝업이 닫힐 때 DOM 요소와 이벤트
              리스너 완전 정리
            </li>
          </ul>

          <h3 className={styles['sub-title']}>권장사항</h3>
          <ul>
            <li>자주 열리지 않는 팝업은 조건부 렌더링을 사용하세요</li>
            <li>큰 데이터를 포함한 팝업은 lazy loading을 고려하세요</li>
            <li>
              애니메이션이 많은 팝업에서는 will-change CSS 속성을 활용하세요
            </li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>사용 팁</h2>
        <div className={styles.showcase}>
          <h3 className={styles['sub-title']}>모범 사례</h3>
          <ul>
            <li>
              <strong>상태 관리:</strong> 복잡한 팝업 로직에는 usePopup,
              usePopups 훅 활용
            </li>
            <li>
              <strong>타입 선택:</strong>
              <ul>
                <li>일반적인 알림/확인: modal</li>
                <li>전체 화면 필요시: full</li>
                <li>모바일 친화적 UI: bottom</li>
              </ul>
            </li>
            <li>
              <strong>버튼 배치:</strong> 주요 액션은 오른쪽, 취소는 왼쪽에 배치
            </li>
            <li>
              <strong>내용 구성:</strong> 제목, 설명, 액션 순서로 구성
            </li>
          </ul>

          <h3 className={styles['sub-title']}>주의사항</h3>
          <ul>
            <li>너무 많은 팝업을 동시에 열지 마세요 (UX 저해)</li>
            <li>중요한 정보는 팝업에만 의존하지 마세요</li>
            <li>모바일에서는 팝업 크기를 화면에 맞게 조정하세요</li>
            <li>자동으로 열리는 팝업은 사용자 경험을 해칠 수 있습니다</li>
          </ul>
        </div>
      </section>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>고급 사용법</h2>
        <div className={styles.showcase}>
          <h3 className={styles['sub-title']}>커스텀 애니메이션</h3>
          <CodeHighlight
            code={`// CSS 모듈로 커스텀 애니메이션 적용
<Popup
  title="커스텀 애니메이션"
  visible={visible}
  onClose={() => setVisible(false)}
  className="custom-popup-animation"
>
  <p>커스텀 애니메이션이 적용된 팝업입니다.</p>
</Popup>

// CSS
.custom-popup-animation {
  .pop-wrap {
    animation: customSlideIn 0.5s ease-out;
  }
}

@keyframes customSlideIn {
  from {
    transform: translateY(-100px) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}`}
            language="typescript"
          />

          <h3 className={styles['sub-title']}>동적 내용 로딩</h3>
          <CodeHighlight
            code={`const DynamicPopup = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleOpen = useCallback(async () => {
    setVisible(true);
    setLoading(true);
    
    try {
      const result = await fetchData();
      setData(result);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <Button onClick={handleOpen}>동적 내용 팝업 열기</Button>
      
      <Popup
        title="동적 내용"
        visible={visible}
        onClose={() => setVisible(false)}
      >
        {loading ? (
          <div>로딩 중...</div>
        ) : (
          <div>{data && <pre>{JSON.stringify(data, null, 2)}</pre>}</div>
        )}
      </Popup>
    </>
  );
};`}
            language="typescript"
          />
        </div>
      </section>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>트러블슈팅</h2>
        <div className={styles.showcase}>
          <h3 className={styles['sub-title']}>자주 발생하는 문제</h3>

          <h4 className={styles['sub-title']}>
            Q: 팝업이 화면 뒤에 숨어있어요
          </h4>
          <p className={styles.txt}>
            A: zIndex prop을 사용하여 수동으로 z-index를 높게 설정하거나, 다른
            요소의 z-index를 확인해보세요.
          </p>

          <h4 className={styles['sub-title']}>Q: 팝업이 닫히지 않아요</h4>
          <p className={styles.txt}>
            A: onClose 콜백이 올바르게 설정되었는지, visible 상태가 제대로
            업데이트되는지 확인하세요.
          </p>

          <h4 className={styles['sub-title']}>
            Q: 모바일에서 팝업이 잘려서 보여요
          </h4>
          <p className={styles.txt}>
            A: bottom 타입을 사용하거나, CSS로 모바일 뷰포트에 맞는 크기를
            설정하세요.
          </p>

          <h4 className={styles['sub-title']}>
            Q: 여러 팝업이 동시에 열릴 때 ESC 키가 작동하지 않아요
          </h4>
          <p className={styles.txt}>
            A: PopupManager가 최상위 팝업만 ESC 키에 반응하도록 설계되어
            있습니다. 가장 위에 있는 팝업만 ESC로 닫힙니다.
          </p>
        </div>
      </section>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>추가 기능 개선</h2>
        <p className={styles.txt}>
          Ant Design을 참고하여 추가할 수 있는 기능들입니다.
        </p>

        <div className={styles.showcase}>
          <h3 className={styles['sub-title']}>향후 추가 예정 기능</h3>
          <ul>
            <li>
              <strong>정적 메서드:</strong> Popup.confirm(), Popup.info() 등의
              프로그래밍 방식 팝업
            </li>
            <li>
              <strong>드래그 가능한 팝업:</strong> 제목 바를 드래그하여 팝업
              이동
            </li>
            <li>
              <strong>리사이즈 가능한 팝업:</strong> 모서리를 드래그하여 크기
              조정
            </li>
            <li>
              <strong>중첩 스크롤 처리:</strong> 팝업 내부와 외부 스크롤 동작
              개선
            </li>
            <li>
              <strong>애니메이션 커스터마이징:</strong> 다양한 진입/종료
              애니메이션 옵션
            </li>
            <li>
              <strong>위치 지정:</strong> 특정 요소 기준으로 팝업 위치 설정
            </li>
          </ul>

          <h3 className={styles['sub-title']}>기여하기</h3>
          <p className={styles.txt}>
            새로운 기능이나 개선사항이 있다면 GitHub 이슈를 통해 제안해주세요.
            Pull Request도 환영합니다!
          </p>
        </div>
      </section>
    </div>
  );
};

export default PopupGuide;
