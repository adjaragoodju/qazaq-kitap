import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/logo';
import Footer from '../components/footer';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    // Simulate fetching user orders
    // In a real app, this would be an API call
    const mockOrders = [
      {
        id: 1,
        date: '2024-03-15',
        total: 5000,
        books: [
          { title: 'Құлагер: поэмалар', author: 'Ілияс Жансүгіров' },
          { title: 'Абайдың қара сөздері', author: 'МухтарӘуезов' },
        ],
      },
    ];
    setUserOrders(mockOrders);
  }, []);

  if (!user) {
    return (
      <div className='container mx-auto px-4 py-10 text-center'>
        <Logo />
        <h1 className='text-4xl font-bold mt-10 mb-4'>
          Кіруге рұқсат етілмеген
        </h1>
        <p className='text-xl'>Профильге кіру үшін жүйеге кіріңіз</p>
      </div>
    );
  }

  return (
    <>
      <div className='px-2 container mx-auto'>
        <header className='py-6'>
          <nav className='flex justify-between items-center'>
            <Logo />
            <button
              onClick={logout}
              className='bg-red-600 text-white px-4 py-2 rounded'
            >
              Шығу
            </button>
          </nav>
        </header>

        <div className='bg-[#282837] p-8 rounded-xl mt-10'>
          <h1 className='text-4xl font-bold mb-6'>Профиль</h1>

          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h2 className='text-2xl font-semibold mb-4'>Жеке мәліметтер</h2>
              <p>
                <strong>Аты-жөні:</strong> {user.name}
              </p>
              <p>
                <strong>Электрондық пошта:</strong> {user.email}
              </p>
            </div>

            <div>
              <h2 className='text-2xl font-semibold mb-4'>
                Тапсырыстар тарихы
              </h2>
              {userOrders.length === 0 ? (
                <p>Тапсырыстар жоқ</p>
              ) : (
                userOrders.map((order) => (
                  <div
                    key={order.id}
                    className='bg-[#1D1D2A] p-4 rounded-md mb-4'
                  >
                    <p>
                      <strong>Тапсырыс №:</strong> {order.id}
                    </p>
                    <p>
                      <strong>Күні:</strong> {order.date}
                    </p>
                    <p>
                      <strong>Сомасы:</strong> {order.total} ₸
                    </p>
                    <div>
                      <strong>Кітаптар:</strong>
                      <ul>
                        {order.books.map((book, index) => (
                          <li key={index}>
                            {book.title} - {book.author}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
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
