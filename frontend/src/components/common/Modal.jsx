import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const LoginModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError('Барлық өрістерді толтырыңыз');
      return;
    }

    // Simulate login (replace with actual authentication later)
    try {
      // This would typically be an API call
      const userData = {
        id: 1,
        email,
        name: 'Қолданушы',
      };

      login(userData);
      onClose();
    } catch (err) {
      setError('Кіру қателігі');
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-[#282837] p-8 rounded-xl w-full max-w-md'>
        <h2 className='text-3xl font-bold mb-6 text-center'>Кіру</h2>

        {error && (
          <div className='bg-red-500 text-white p-3 rounded mb-4'>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block mb-2'>Электрондық пошта</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full p-3 bg-[#1D1D2A] rounded-md'
              placeholder='Пошта адресіңізді енгізіңіз'
            />
          </div>

          <div className='mb-6'>
            <label className='block mb-2'>Пароль</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-3 bg-[#1D1D2A] rounded-md'
              placeholder='Парольді енгізіңіз'
            />
          </div>

          <button
            type='submit'
            className='w-full bg-qazaq-blue p-3.5 rounded-md text-xl font-bold'
          >
            Кіру
          </button>
        </form>

        <div className='text-center mt-4'>
          <button onClick={onClose} className='text-gray-400 hover:text-white'>
            Болдырмау
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
