// This file defines the Login page component for user authentication
// It provides a form for users to enter credentials and handles the login process

import { useState } from 'react'; // Import useState hook for local state management
import { useAuth } from '../../context/AuthContext'; // Import authentication context
import { useNavigate } from 'react-router-dom'; // Import navigation hook

const LoginPage = () => {
  // State for error messages and loading status
  const [error, setError] = useState(''); // Store error messages
  const [isLoading, setIsLoading] = useState(false); // Track loading state during login

  // Get login function from auth context and navigation function
  const { login: loginUser } = useAuth();
  const navigate = useNavigate();

  // Handler to navigate to registration page
  const onSwitchRegister = () => {
    navigate('/register');
  };

  // Form submission handler for login
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setError(''); // Clear any previous errors

    // Get form values
    const password = e.target.password.value;
    const login = e.target.login.value;

    // Validate form inputs
    if (!login || !password) {
      setError('Барлық өрістерді толтырыңыз'); // Error: Fill all fields
      return;
    }

    setIsLoading(true); // Set loading state
    try {
      // Call login function from auth context
      const result = await loginUser({ login, password });
      if (result.success) {
        navigate('/'); // Redirect to homepage on success
      } else {
        setError(result.error || 'Кіру қателігі'); // Display error message
      }
    } catch (err) {
      setError('Кіру қателігі туындады'); // Generic error message on exception
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    // Modal-like overlay that covers the entire screen
    <div className='fixed inset-0 bg-[#191923] bg-opacity-50 flex justify-center items-center z-50'>
      {/* Login form container */}
      <div className='bg-[#282837] p-8 rounded-xl w-full max-w-md'>
        {/* Login title */}
        <h2 className='text-3xl font-bold mb-6 text-center'>Кіру</h2>

        {/* Conditional error message display */}
        {error && (
          <div className='bg-red-500 text-white p-3 rounded mb-4'>{error}</div>
        )}

        {/* Login form */}
        <form onSubmit={(e) => handleSubmit(e)}>
          {/* Login field */}
          <div className='mb-4'>
            <label className='block mb-2'>login</label>
            <input
              type='text'
              name='login'
              className='w-full p-3 bg-[#1D1D2A] rounded-md'
              placeholder='Пошта адресіңізді енгізіңіз'
              disabled={isLoading}
            />
          </div>

          {/* Password field */}
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

          {/* Submit button - shows loading state */}
          <button
            type='submit'
            className='w-full bg-qazaq-blue p-3.5 rounded-md text-xl font-bold disabled:opacity-50'
            disabled={isLoading}
          >
            {isLoading ? 'Жүктелуде...' : 'Кіру'}
          </button>
        </form>

        {/* Link to registration page */}
        <div className='mt-4 text-center'>
          <p className='mb-2'>
            Аккаунтыңыз бар ма?{' '}
            <button
              onClick={onSwitchRegister}
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

export default LoginPage; // Export the LoginPage component
