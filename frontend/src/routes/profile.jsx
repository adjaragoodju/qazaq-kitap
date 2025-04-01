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

  // Helper function to get image URL with error handling
  const getImageUrl = (imageFilename) => {
    return `http://localhost:3000/api/static/uploads/${imageFilename}`;
  };

  // Helper function to get PDF URL with error handling
  const getPdfUrl = (pdfFilename) => {
    if (!pdfFilename) return null;
    // Make sure we have a valid filename using the books folder path
    return `http://localhost:3000/uploads/books/${pdfFilename.trim()}`;
  };

  if (!user) {
    return (
      <div className='container mx-auto px-4 py-10 text-center'>
        <Logo />
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold mt-10 mb-4'>
          Кіруге рұқсат етілмеген
        </h1>
        <p className='text-lg sm:text-xl'>Профильге кіру үшін жүйеге кіріңіз</p>
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
      <div className='px-4 container mx-auto'>
        <Navbar />

        <div className='bg-[#282837] p-4 sm:p-6 md:p-8 rounded-xl mt-6 sm:mt-10'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-6'>
            Профиль
          </h1>

          {/* Tab Navigation - Scrollable on mobile */}
          <div className='flex mb-6 border-b border-gray-700 overflow-x-auto pb-1 hide-scrollbar'>
            <button
              className={`px-3 sm:px-4 py-2 whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-b-2 border-qazaq-blue text-qazaq-blue'
                  : 'text-gray-400'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Профиль
            </button>
            <button
              className={`px-3 sm:px-4 py-2 whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-b-2 border-qazaq-blue text-qazaq-blue'
                  : 'text-gray-400'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              Тапсырыстар
            </button>
            <button
              className={`px-3 sm:px-4 py-2 whitespace-nowrap ${
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
            <div className='bg-[#1D1D2A] p-4 sm:p-6 rounded-md'>
              <h2 className='text-xl md:text-2xl font-semibold mb-4'>
                Жеке мәліметтер
              </h2>
              <p className='text-base md:text-lg mb-3'>
                <strong className='text-qazaq-blue'>Email:</strong> {user.email}
              </p>
              <p className='text-base md:text-lg mb-3'>
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
              <h2 className='text-xl md:text-2xl font-semibold mb-4'>
                Тапсырыстар тарихы
              </h2>
              {userOrders.length === 0 ? (
                <div className='bg-[#1D1D2A] p-4 sm:p-6 rounded-md text-center'>
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
                        <p className='text-base sm:text-lg'>
                          <strong className='text-qazaq-blue'>
                            Тапсырыс №:
                          </strong>{' '}
                          {order.id}
                        </p>
                        <p className='text-sm sm:text-base'>
                          <strong className='text-qazaq-blue'>Күні:</strong>{' '}
                          {order.date}
                        </p>
                        <p className='text-sm sm:text-base'>
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
                                src={getImageUrl(book.image)}
                                alt={book.title}
                                className='w-10 h-14 sm:w-12 sm:h-16 object-cover rounded mr-3'
                                onError={(e) => {
                                  e.target.src = getImageUrl('placeholder.png');
                                }}
                              />
                              <div>
                                <p className='font-semibold text-sm sm:text-base'>
                                  {book.title}
                                </p>
                                <p className='text-xs sm:text-sm text-gray-400'>
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
              <h2 className='text-xl md:text-2xl font-semibold mb-4'>
                Менің кітаптарым
              </h2>
              {purchasedBooks.length === 0 ? (
                <div className='bg-[#1D1D2A] p-4 sm:p-6 rounded-md text-center'>
                  <p className='text-lg mb-3'>Сатып алынған кітаптар жоқ</p>
                  <button
                    onClick={() => navigate('/')}
                    className='mt-2 bg-qazaq-blue px-6 py-2 rounded-md transition duration-300'
                  >
                    Кітаптарды шолу
                  </button>
                </div>
              ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {purchasedBooks.map((book) => (
                    <div
                      key={book.id}
                      className='bg-[#1D1D2A] p-4 rounded-md flex'
                    >
                      <img
                        src={getImageUrl(book.image)}
                        alt={book.title}
                        className='w-16 h-24 sm:w-20 sm:h-28 object-cover rounded mr-3'
                        onError={(e) => {
                          e.target.src = getImageUrl('placeholder.png');
                        }}
                      />
                      <div className='flex flex-col justify-between flex-1'>
                        <div>
                          <h3 className='font-semibold text-base sm:text-lg line-clamp-2'>
                            {book.title}
                          </h3>
                          <p className='text-xs sm:text-sm text-gray-400'>
                            {book.author}
                          </p>
                          <p className='text-xs text-gray-500'>
                            Сатып алынған: {book.purchaseDate}
                          </p>
                        </div>
                        <div className='mt-2'>
                          <button
                            onClick={async (e) => {
                              e.preventDefault();
                              try {
                                // Try to verify if the PDF exists first
                                const pdfPath = book.pdf || '';

                                if (!pdfPath) {
                                  alert('PDF файлы табылмады.');
                                  return;
                                }

                                // Use the direct PDF URL with books directory
                                const pdfUrl = `http://localhost:3000/api/static/uploads/books/${book.pdf}`;

                                // Open in a new window
                                window.open(pdfUrl, '_blank');
                              } catch (error) {
                                console.error('Error opening PDF:', error);
                                alert(
                                  'PDF файлы қолжетімді емес. Кейінірек қайталап көріңіз.'
                                );
                              }
                            }}
                            className='px-4 py-2 bg-qazaq-blue rounded text-sm inline-block text-center w-full text-white'
                          >
                            Оқу
                          </button>
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
