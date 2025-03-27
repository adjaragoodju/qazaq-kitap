import { createBrowserRouter } from 'react-router-dom';
import Root from './root';
import BookDetail from './bookdetail';
import ErrorPage from './error-page';
import ProfilePage from './profile';
import CartPage from './cart';

// Wrap routes with AuthProvider in main.jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/book/:title',
    element: <BookDetail />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/cart',
    element: <CartPage />,
  }
]);

export default router;