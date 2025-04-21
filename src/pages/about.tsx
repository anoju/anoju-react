// src/pages/about.tsx
import styles from '@/assets/scss/pages/about.module.scss';
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button } from '@/components/common';

function About() {
  usePageLayout({
    title: 'About Us',
    leftButtons: (
      <Button to="/" size="sm">
        Home
      </Button>
    ),
    rightButtons: (
      <>
        <Button className="primary" size="sm" to="/empty">
          empty
        </Button>
      </>
    ),
  });

  return (
    <div className={styles.home}>
      <h1>About page</h1>
      <p>This is the about page with custom layout configuration.</p>
    </div>
  );
}

export default About;
