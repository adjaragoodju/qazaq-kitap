import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/logo';
import Footer from '../components/footer';
import Navbar from '../components/navbar';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [userOrders, setUserOrders] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    // Get orders from localStorage instead of static data
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setUserOrders(savedOrders);
  }, []);

  if (!user) {
    return (
      <div className='container mx-auto px-4 py-10 text-center'>
        <Logo />
        <h1 className='text-4xl font-bold mt-10 mb-4'>
          Кіруге рұқсат етілмеген
        </h1>
        <p className='text-xl'>Профильге кіру үшін жүйеге кіріңіз</p>
        <button
          onClick={() => navigate('/login')}
          className='mt-6 bg-qazaq-blue px-8 py-3 rounded-md text-lg font-bold'
        >
          Кіру
        </button>
      </div>
    );
  }

  return (
    <>
      <div className='px-2 container mx-auto'>
        <Navbar />

        <div className='bg-[#282837] p-8 rounded-xl mt-10'>
          <h1 className='text-4xl font-bold mb-6'>Профиль</h1>

          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h2 className='text-2xl font-semibold mb-4'>Жеке мәліметтер</h2>
              <div className='bg-[#1D1D2A] p-6 rounded-md'>
                <p className='text-lg mb-3'>
                  <strong className='text-qazaq-blue'>Аты-жөні:</strong>{' '}
                  {user.name}
                </p>
                <p className='text-lg mb-3'>
                  <strong className='text-qazaq-blue'>
                    Электрондық пошта:
                  </strong>{' '}
                  {user.email}
                </p>
                <button
                  onClick={handleLogout}
                  className='mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition duration-300'
                >
                  Шығу
                </button>
              </div>
            </div>

            <div>
              <h2 className='text-2xl font-semibold mb-4'>
                Тапсырыстар тарихы
              </h2>
              {userOrders.length === 0 ? (
                <div className='bg-[#1D1D2A] p-6 rounded-md text-center'>
                  <p className='text-lg mb-3'>Тапсырыстар жоқ</p>
                  <button
                    onClick={() => navigate('/')}
                    className='mt-2 bg-qazaq-blue px-6 py-2 rounded-md transition duration-300'
                  >
                    Кітаптарды шолу
                  </button>
                </div>
              ) : (
                <div className='space-y-4 max-h-96 overflow-y-auto pr-2'>
                  {userOrders.map((order) => (
                    <div key={order.id} className='bg-[#1D1D2A] p-4 rounded-md'>
                      <div className='border-b border-gray-700 pb-2 mb-3'>
                        <p className='text-lg'>
                          <strong className='text-qazaq-blue'>
                            Тапсырыс №:
                          </strong>{' '}
                          {order.id}
                        </p>
                        <p>
                          <strong className='text-qazaq-blue'>Күні:</strong>{' '}
                          {order.date}
                        </p>
                        <p>
                          <strong className='text-qazaq-blue'>Сомасы:</strong>{' '}
                          {order.total} ₸
                        </p>
                      </div>
                      <div>
                        <strong className='text-qazaq-blue'>Кітаптар:</strong>
                        <ul className='mt-2 space-y-2'>
                          {order.items.map((book, index) => (
                            <li key={index} className='flex items-center'>
                              <img
                                src={`http://localhost:3000/uploads/${book.image}`}
                                alt={book.title}
                                className='w-12 h-16 object-cover rounded mr-3'
                              />
                              <div>
                                <p className='font-semibold'>{book.title}</p>
                                <p className='text-sm text-gray-400'>
                                  {book.author} x{book.quantity}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProfilePage;
