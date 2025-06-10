// src/App.tsx
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { LayoutProvider } from './contexts/LayoutContext';
import { StickyWrapProvider } from './contexts/StickyWrapContext';
import { ToastProvider } from './contexts/ToastContext';
import Loading from './components/common/Loading';
import { ToastContainer } from './components/common/Toast';

const App = () => {
  return (
    <ToastProvider>
      <StickyWrapProvider>
        <LayoutProvider>
          <RouterProvider router={router} />
          <Loading />
          <ToastContainer />
        </LayoutProvider>
      </StickyWrapProvider>
    </ToastProvider>
  );
};

export default App;
