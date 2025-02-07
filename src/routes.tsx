import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Admin from './pages/Admin';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/admin',
    element: <Admin />,
  },
]); 