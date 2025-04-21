// src/pages/about.tsx
import styles from '@/assets/scss/pages/about.module.scss';
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button } from '@/components/common';

function About() {
  usePageLayout({
    title: 'About Us',
    leftButtons: <Button to="/">Home</Button>,
    rightButtons: (
      <>
        <Button className="primary">Contact</Button>
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
