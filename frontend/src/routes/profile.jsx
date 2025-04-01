import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/logo';
import Footer from '../components/footer';
import Navbar from '../components/navbar';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [userOrders, setUserOrders] = useState([]);
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'orders', 'books'
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    // Get orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    // Sort orders by date (newest first)
    const sortedOrders = savedOrders.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    setUserOrders(sortedOrders);

    // Extract all purchased books from orders (removing duplicates)
    const allBooks = [];
    const bookIds = new Set();

    savedOrders.forEach((order) => {
      order.items.forEach((book) => {
        if (!bookIds.has(book.id)) {
          bookIds.add(book.id);
          allBooks.push({
            ...book,
            purchaseDate: order.date,
          });
        }
      });
    });

    setPurchasedBooks(allBooks);
  }, []);

  // Open the book PDF directly
  const openBook = (bookTitle) => {
    // Convert book title to PDF filename (matches your file structure)
    // This assumes your PDFs are named the same way as in your uploads folder
    const pdfFilename = `${bookTitle.toLowerCase().replace(/\s+/g, '')}.pdf`;

    // Open PDF in new tab
    window.open(
      `http://localhost:3000/static/uploads/books/${pdfFilename}`,
      '_blank'
    );
  };

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

          {/* Tab Navigation */}
          <div className='flex mb-6 border-b border-gray-700'>
            <button
              className={`px-4 py-2 ${
                activeTab === 'profile'
                  ? 'border-b-2 border-qazaq-blue text-qazaq-blue'
                  : 'text-gray-400'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Профиль
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === 'orders'
                  ? 'border-b-2 border-qazaq-blue text-qazaq-blue'
                  : 'text-gray-400'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              Тапсырыстар
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === 'books'
                  ? 'border-b-2 border-qazaq-blue text-qazaq-blue'
                  : 'text-gray-400'
              }`}
              onClick={() => setActiveTab('books')}
            >
              Менің кітаптарым
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className='bg-[#1D1D2A] p-6 rounded-md'>
              <h2 className='text-2xl font-semibold mb-4'>Жеке мәліметтер</h2>
              <p className='text-lg mb-3'>
                <strong className='text-qazaq-blue'>Email:</strong> {user.email}
              </p>
              <p className='text-lg mb-3'>
                <strong className='text-qazaq-blue'>Пайдаланушы аты:</strong>{' '}
                {user.username}
              </p>
              <button
                onClick={handleLogout}
                className='mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition duration-300'
              >
                Шығу
              </button>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
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
                <div className='space-y-4 max-h-[600px] overflow-y-auto pr-2'>
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
                                src={`http://localhost:3000/static/uploads/${book.image}`}
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
          )}

          {/* Books Tab */}
          {activeTab === 'books' && (
            <div>
              <h2 className='text-2xl font-semibold mb-4'>Менің кітаптарым</h2>
              {purchasedBooks.length === 0 ? (
                <div className='bg-[#1D1D2A] p-6 rounded-md text-center'>
                  <p className='text-lg mb-3'>Сатып алынған кітаптар жоқ</p>
                  <button
                    onClick={() => navigate('/')}
                    className='mt-2 bg-qazaq-blue px-6 py-2 rounded-md transition duration-300'
                  >
                    Кітаптарды шолу
                  </button>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {purchasedBooks.map((book) => (
                    <div
                      key={book.id}
                      className='bg-[#1D1D2A] p-4 rounded-md flex'
                    >
                      <img
                        src={`http://localhost:3000/static/uploads/${book.image}`}
                        alt={book.title}
                        className='w-20 h-28 object-cover rounded mr-3'
                      />
                      <div className='flex flex-col justify-between flex-1'>
                        <div>
                          <h3 className='font-semibold text-lg'>
                            {book.title}
                          </h3>
                          <p className='text-sm text-gray-400'>{book.author}</p>
                          <p className='text-xs text-gray-500'>
                            Сатып алынған: {book.purchaseDate}
                          </p>
                        </div>
                        <div className='mt-2'>
                          <a
                            href={`http://localhost:3000/static/uploads/books/${book.bookUrl}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='px-4 py-2 bg-qazaq-blue rounded text-sm inline-block text-center w-full'
                          >
                            Оқу
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProfilePage;
