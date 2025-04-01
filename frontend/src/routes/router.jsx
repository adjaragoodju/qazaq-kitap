import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './error-page';

// Lazy load components
const Root = lazy(() => import('./root'));
const BookDetail = lazy(() => import('./bookdetail'));
const ProfilePage = lazy(() => import('./profile'));
const CartPage = lazy(() => import('./cart'));
const RegisterPage = lazy(() => import('./auth/register'));
const LoginPage = lazy(() => import('./auth/login'));
const FavoritesPage = lazy(() => import('./favorites'));

// Loading component
const LoadingComponent = () => (
  <div className='flex justify-center items-center min-h-screen'>
    <div className='inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-qazaq-blue border-r-transparent'></div>
    <p className='ml-3 text-lg'>Жүктелуде...</p>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <Root />
      </Suspense>
    ),
  },
  {
    path: '/book/:id',
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <BookDetail />
      </Suspense>
    ),
  },
  {
    path: '/profile',
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <ProfilePage />
      </Suspense>
    ),
  },
  {
    path: '/cart',
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <CartPage />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: '/favorites',
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <FavoritesPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

export default router;
