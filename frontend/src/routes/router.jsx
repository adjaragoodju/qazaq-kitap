import { createBrowserRouter } from 'react-router-dom';
import Root from './root';
import BookDetail from './bookdetail';
import ErrorPage from './error-page';
import ProfilePage from './profile';
import CartPage from './cart';
import RegisterPage from './auth/register';
import LoginPage from './auth/login';
import FavoritesPage from './favorites';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
  {
    path: '/book/:id',
    element: <BookDetail />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/cart',
    element: <CartPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/favorites',
    element: <FavoritesPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

export default router;
