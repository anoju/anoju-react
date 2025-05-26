// src/App.tsx
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { LayoutProvider } from './contexts/LayoutContext';
import { LoadingProvider } from './components/providers';
import Loading from './components/common/Loading';

const App = () => {
  return (
    <LoadingProvider>
      <LayoutProvider>
        <RouterProvider router={router} />
        <Loading />
      </LayoutProvider>
    </LoadingProvider>
  );
};

export default App;
