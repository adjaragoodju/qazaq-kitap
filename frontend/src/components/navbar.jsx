import { Link } from 'react-router-dom';
import Logo from './logo';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className='py-6'>
      <div className='flex justify-between items-center'>
        {/* Logo */}
        <div className='flex items-center'>
          <Logo />
        </div>

        {/* Mobile menu button */}
        <button className='md:hidden text-white' onClick={toggleMobileMenu}>
          {mobileMenuOpen ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          )}
        </button>

        {/* Desktop navigation */}
        <div className='hidden md:flex items-center space-x-4'>
          <Link
            to='/favorites'
            className='text-white hover:text-qazaq-blue transition-colors'
          >
            <div className='flex items-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 mr-1'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                />
              </svg>
              Таңдаулылар
            </div>
          </Link>
          <Link
            to='/cart'
            className='text-white hover:text-qazaq-blue transition-colors'
          >
            <div className='flex items-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 mr-1'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
              Себет
            </div>
          </Link>
        </div>

        {/* Auth buttons - desktop */}
        <div className='hidden md:block'>
          {!user ? (
            <div className='flex space-x-4'>
              <button
                onClick={() => navigate('/login')}
                className='bg-qazaq-blue px-6 py-2 rounded-md'
              >
                Кіру
              </button>
              <button
                onClick={() => navigate('/register')}
                className='border border-qazaq-blue text-qazaq-blue px-6 py-2 rounded-md'
              >
                Тіркелу
              </button>
            </div>
          ) : (
            <div className='flex items-center space-x-4'>
              <Link
                to='/profile'
                className='bg-qazaq-blue px-4 py-2 rounded-md'
              >
                Профиль
              </Link>
              <button
                onClick={handleLogout}
                className='border border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition-colors'
              >
                Шығу
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className='md:hidden mt-4 bg-[#282837] rounded-lg p-4'>
          <div className='flex flex-col space-y-4'>
            <Link
              to='/favorites'
              className='text-white hover:text-qazaq-blue transition-colors'
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className='flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 mr-1'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                  />
                </svg>
                Таңдаулылар
              </div>
            </Link>
            <Link
              to='/cart'
              className='text-white hover:text-qazaq-blue transition-colors'
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className='flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 mr-1'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
                Себет
              </div>
            </Link>

            {/* Auth buttons - mobile */}
            {!user ? (
              <div className='flex flex-col space-y-2 pt-2 border-t border-gray-700'>
                <button
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className='bg-qazaq-blue px-6 py-2 rounded-md w-full text-center'
                >
                  Кіру
                </button>
                <button
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                  className='border border-qazaq-blue text-qazaq-blue px-6 py-2 rounded-md w-full text-center'
                >
                  Тіркелу
                </button>
              </div>
            ) : (
              <div className='flex flex-col space-y-2 pt-2 border-t border-gray-700'>
                <Link
                  to='/profile'
                  className='bg-qazaq-blue px-4 py-2 rounded-md w-full text-center'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Профиль
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className='border border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition-colors w-full'
                >
                  Шығу
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
