// src/App.tsx
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { LayoutProvider } from './contexts/LayoutContext';
import { StickyProvider } from './contexts/StickyContext';
import { ToastProvider } from './contexts/ToastContext';
import Loading from './components/common/Loading';
import { ToastContainer } from './components/common/Toast';

const App = () => {
  return (
    <ToastProvider>
      <StickyProvider>
        <LayoutProvider>
          <RouterProvider router={router} />
          <Loading />
          <ToastContainer />
        </LayoutProvider>
      </StickyProvider>
    </ToastProvider>
  );
};

export default App;
