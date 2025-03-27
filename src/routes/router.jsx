import { createBrowserRouter } from 'react-router-dom';
import Root from './root';
import BookDetail from './bookdetail';
import ErrorPage from './error-page';

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
]);

export default router;
