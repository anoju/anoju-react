// src/App.tsx
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { LayoutProvider } from './contexts/LayoutContext';

const App = () => {
  return (
    <LayoutProvider>
      <RouterProvider router={router} />
    </LayoutProvider>
  );
};

export default App;
