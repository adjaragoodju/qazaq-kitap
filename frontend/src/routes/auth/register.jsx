import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const onSwitchToLogin = () => {
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    const username = e.target.username.value;
    const password = e.target.password.value;
    const email = e.target.email.value;
    if (!email || !password || !username) {
      setError('Барлық өрістерді толтырыңыз');
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({ email, password, username });
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
    <div className='fixed inset-0 bg-[#191923] bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-[#282837] p-8 rounded-xl w-full max-w-md'>
        <h2 className='text-3xl font-bold mb-6 text-center'>Тіркелу</h2>

        {error && (
          <div className='bg-red-500 text-white p-3 rounded mb-4'>{error}</div>
        )}

        <form onSubmit={(e) => handleSubmit(e)}>
          <div className='mb-4'>
            <label className='block mb-2'>Электрондық пошта</label>
            <input
              type='email'
              name='email'
              className='w-full p-3 bg-[#1D1D2A] rounded-md'
              placeholder='Пошта адресіңізді енгізіңіз'
              disabled={isLoading}
            />
          </div>

          <div className='mb-6'>
            <label className='block mb-2'>username</label>
            <input
              type='text'
              name='username'
              className='w-full p-3 bg-[#1D1D2A] rounded-md'
              placeholder='Парольді енгізіңіз'
              disabled={isLoading}
            />
          </div>

          <div className='mb-6'>
            <label className='block mb-2'>Пароль</label>
            <input
              type='password'
              name='password'
              className='w-full p-3 bg-[#1D1D2A] rounded-md'
              placeholder='Парольді енгізіңіз'
              disabled={isLoading}
            />
          </div>
          <button
            type='submit'
            className='w-full bg-qazaq-blue p-3.5 rounded-md text-xl font-bold disabled:opacity-50'
            disabled={isLoading}
          >
            {isLoading ? 'Жүктелуде...' : 'Кіру'}
          </button>
        </form>

        <div className='mt-4 text-center'>
          <p className='mb-2'>
            Аккаунтыңыз бар ма?{' '}
            <button
              onClick={onSwitchToLogin}
              className='text-qazaq-blue hover:underline'
              disabled={isLoading}
            >
              Кіру
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
