import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight } from '@/components/common';
import styles from '@/assets/scss/pages/guide.module.scss';

const ModalGuide = () => {
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

  return (
    <div className="page-inner">
      <h1 className={styles.title}>팝업 Component</h1>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>alert</h2>
        <div className={styles.showcase}>추가예정</div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight code={`//추가예정`} language="jsx" />
      </section>
    </div>
  );
};

export default ModalGuide;
