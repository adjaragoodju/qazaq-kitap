import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const RegisterModal = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('Барлық өрістерді толтырыңыз');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Парольдер сәйкес келмейді');
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль кемінде 6 таңбадан тұруы керек');
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Тіркеу кезінде қате туындады');
      }
    } catch (err) {
      setError('Тіркеу кезінде қате туындады');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-[#282837] p-8 rounded-xl w-full max-w-md'>
        <h2 className='text-3xl font-bold mb-6 text-center'>Тіркелу</h2>

        {error && (
          <div className='bg-red-500 text-white p-3 rounded mb-4'>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block mb-2'>Аты-жөні</label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='w-full p-3 bg-[#1D1D2A] rounded-md'
              placeholder='Аты-жөніңізді енгізіңіз'
              disabled={isLoading}
            />
          </div>

          <div className='mb-4'>
            <label className='block mb-2'>Электрондық пошта</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full p-3 bg-[#1D1D2A] rounded-md'
              placeholder='Пошта адресіңізді енгізіңіз'
              disabled={isLoading}
            />
          </div>

          <div className='mb-4'>
            <label className='block mb-2'>Пароль</label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='w-full p-3 bg-[#1D1D2A] rounded-md'
              placeholder='Парольді енгізіңіз'
              disabled={isLoading}
            />
          </div>

          <div className='mb-6'>
            <label className='block mb-2'>Парольді қайталаңыз</label>
            <input
              type='password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              className='w-full p-3 bg-[#1D1D2A] rounded-md'
              placeholder='Парольді қайтадан енгізіңіз'
              disabled={isLoading}
            />
          </div>

          <button
            type='submit'
            className='w-full bg-qazaq-blue p-3.5 rounded-md text-xl font-bold disabled:opacity-50'
            disabled={isLoading}
          >
            {isLoading ? 'Жүктелуде...' : 'Тіркелу'}
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
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white'
            disabled={isLoading}
          >
            Болдырмау
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
