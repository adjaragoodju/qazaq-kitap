import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login: loginUser } = useAuth();
  const navigate = useNavigate();

  const onSwitchRegister = () => {
    navigate('/register');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    const password = e.target.password.value;
    const login = e.target.login.value;

    if (!login || !password) {
      setError('Барлық өрістерді толтырыңыз');
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginUser({ login, password });
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Кіру қателігі');
      }
    } catch (err) {
      setError('Кіру қателігі туындады');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-[#191923] bg-opacity-50 flex justify-center items-center z-50 p-4'>
      <div className='bg-[#282837] p-5 sm:p-8 rounded-xl w-full max-w-md'>
        <h2 className='text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center'>
          Кіру
        </h2>

        {error && (
          <div className='bg-red-500 text-white p-3 rounded mb-4 text-sm sm:text-base'>
            {error}
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e)}>
          <div className='mb-4'>
            <label className='block mb-2 text-sm sm:text-base'>
              Логин/Электрондық пошта
            </label>
            <input
              type='text'
              name='login'
              className='w-full p-2 sm:p-3 bg-[#1D1D2A] rounded-md text-sm sm:text-base'
              placeholder='Логин/Пошта адресіңізді енгізіңіз'
              disabled={isLoading}
            />
          </div>

          <div className='mb-5 sm:mb-6'>
            <label className='block mb-2 text-sm sm:text-base'>Пароль</label>
            <input
              type='password'
              name='password'
              className='w-full p-2 sm:p-3 bg-[#1D1D2A] rounded-md text-sm sm:text-base'
              placeholder='Парольді енгізіңіз'
              disabled={isLoading}
            />
          </div>

          <button
            type='submit'
            className='w-full bg-qazaq-blue p-3 sm:p-3.5 rounded-md text-lg sm:text-xl font-bold disabled:opacity-50'
            disabled={isLoading}
          >
            {isLoading ? 'Жүктелуде...' : 'Кіру'}
          </button>
        </form>

        <div className='mt-4 text-center'>
          <p className='mb-2 text-sm sm:text-base'>
            Аккаунтыңыз жоқ ма?{' '}
            <button
              onClick={onSwitchRegister}
              className='text-qazaq-blue hover:underline'
              disabled={isLoading}
            >
              Тіркелуіру
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
