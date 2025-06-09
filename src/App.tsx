// src/App.tsx
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { LayoutProvider } from './contexts/LayoutContext';
import { StickyWrapProvider } from './contexts/StickyWrapContext';
import Loading from './components/common/Loading';

const App = () => {
  return (
    <StickyWrapProvider>
      <LayoutProvider>
        <RouterProvider router={router} />
        <Loading />
      </LayoutProvider>
    </StickyWrapProvider>
  );
};

export default App;
