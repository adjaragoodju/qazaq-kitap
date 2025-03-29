import { useRouteError } from 'react-router-dom';
import Logo from '../components/logo';

export default function ErrorPage() {
  return (
    <div className='container mx-auto px-4 py-10 text-center'>
      <Logo />
      <h1 className='text-4xl font-bold mt-10 mb-4'>Қателік орын алды</h1>
      <p className='text-xl mb-4'>Кешіріңіз, бір нәрсе дұрыс болмады.</p>
    </div>
  );
}
