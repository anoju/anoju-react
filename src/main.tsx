import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/assets/scss/app.scss';
import '@/utils/globalDialog'; // 전역 dialog 함수 등록
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
