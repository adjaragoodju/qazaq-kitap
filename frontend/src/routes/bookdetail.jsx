import { useParams } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export default function BookDetail() {
  const { id } = useParams();
  const { user, refreshUserData } = useAuth();
  const [book, setBook] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Data fetching with useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch book details
        const response = await fetch(`http://localhost:3000/api/books/${id}`);
        const data = await response.json();
        setBook(data);

        // Check if book is in favorites
        if (user) {
          const favResponse = await fetch(`http://localhost:3000/api/auth/me`, {
            credentials: 'include',
          });
          const userData = await favResponse.json();
          const favorites = userData.user.Favorite || [];
          const isBookFavorite = favorites.some(
            (fav) => fav.Book && fav.Book.id === id
          );
          setIsFavorite(isBookFavorite);
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  // Memoize the toggleFavorite function
  const toggleFavorite = useCallback(async () => {
    if (!user) {
      alert('Таңдаулыларға қосу үшін жүйеге кіріңіз');
      return;
    }

    try {
      if (isFavorite) {
        // Find the favorite ID
        const meResponse = await fetch(`http://localhost:3000/api/auth/me`, {
          credentials: 'include',
        });
        const userData = await meResponse.json();
        const favorite = userData.user.Favorite.find(
          (fav) => fav.Book.id === id
        );

        if (favorite) {
          // Delete request with the favorite ID
          const response = await fetch(
            `http://localhost:3000/api/favorites/${favorite.id}`,
            {
              method: 'DELETE',
              credentials: 'include',
            }
          );

          if (response.ok) {
            setIsFavorite(false);
            // Refresh user data
            await refreshUserData();
          }
        }
      } else {
        // Add to favorites
        const response = await fetch(`http://localhost:3000/api/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookId: id }),
          credentials: 'include',
        });

        if (response.ok) {
          setIsFavorite(true);
          // Refresh user data
          await refreshUserData();
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [id, isFavorite, user, refreshUserData]);

  // Memoize the addToCart function
  const addToCart = useCallback(async () => {
    if (!user) {
      alert('Себетке қосу үшін жүйеге кіріңіз');
      return;
    }

    if (!book) {
      return;
    }

    try {
      // Match the endpoint format used in cart.jsx
      const response = await fetch(`http://localhost:3000/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId: id }),
        credentials: 'include',
      });

      if (response.ok) {
        alert(`Кітап себетке қосылды: ${book.title}`);
        // Refresh user data
        await refreshUserData();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }, [id, book, user, refreshUserData]);

  // Memoize the image URL
  const imageUrl = useMemo(() => {
    if (!book || imageError) {
      return 'http://localhost:3000/api/static/uploads/placeholder.png';
    }
    return `http://localhost:3000/api/static/uploads/${book.image}`;
  }, [book, imageError]);

  // Handle image error callback
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  if (loading || !book) {
    return (
      <div className='container mx-auto px-4 py-10'>
        <Navbar />
        <div className='text-center py-10'>
          <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-qazaq-blue border-r-transparent'></div>
          <p className='mt-2'>Жүктелуде...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='px-4 container mx-auto'>
        <Navbar />

        <div className='bg-[#282837] rounded-xl p-4 sm:p-6 md:p-8 mt-6 sm:mt-10'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10'>
            {/* Book Image - Full height in its container */}
            <div className='relative h-auto md:h-full'>
              <img
                src={imageUrl}
                alt={book.title}
                className='w-full h-[300px] md:h-full object-contain rounded-xl shadow-lg'
                onError={handleImageError}
                loading='lazy'
              />

              {/* Favorite button */}
              <button
                onClick={toggleFavorite}
                className='absolute top-4 right-4 bg-black/50 rounded-full p-3 text-white hover:bg-black/70 transition-colors'
              >
                {isFavorite ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6 text-red-500'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
                      clipRule='evenodd'
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
                      d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Book Details */}
            <div>
              <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-4'>
                {book.title}
              </h1>

              <div className='bg-[#1D1D2A] p-4 rounded-lg mb-6'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-gray-400 mb-1'>Автор</p>
                    <p className='text-base md:text-lg font-medium'>
                      {book.author.name}
                    </p>
                  </div>
                  <div>
                    <p className='text-gray-400 mb-1'>Жанр</p>
                    <p className='text-base md:text-lg font-medium'>
                      {book.genre.name}
                    </p>
                  </div>
                  <div>
                    <p className='text-gray-400 mb-1'>Жылы</p>
                    <p className='text-base md:text-lg font-medium'>
                      {book.year}
                    </p>
                  </div>
                  <div>
                    <p className='text-gray-400 mb-1'>Бағасы</p>
                    <p className='text-base md:text-lg font-medium text-qazaq-blue font-bold'>
                      {book.price}
                    </p>
                  </div>
                </div>
              </div>

              {/* Book Description */}
              {book.description && (
                <div className='bg-[#1D1D2A] p-4 rounded-lg mb-6'>
                  <p className='text-gray-400 mb-2'>Сипаттамасы</p>
                  <p className='text-sm sm:text-base leading-relaxed'>
                    {book.description}
                  </p>
                </div>
              )}

              <div className='mt-6 space-y-3'>
                <button
                  onClick={addToCart}
                  className='w-full bg-qazaq-blue py-3 px-6 rounded-md text-white font-bold flex items-center justify-center'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 mr-2'
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
                  Себетке қосу
                </button>

                <button
                  onClick={toggleFavorite}
                  className={`w-full py-3 px-6 rounded-md font-bold flex justify-center items-center ${
                    isFavorite
                      ? 'bg-red-500/20 text-red-500 border border-red-500'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  {isFavorite ? (
                    <>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5 mr-2'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='hidden sm:inline'>
                        Таңдаулылардан алып тастау
                      </span>
                      <span className='sm:hidden'>Алып тастау</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5 mr-2'
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
                      <span className='hidden sm:inline'>
                        Таңдаулыларға қосу
                      </span>
                      <span className='sm:hidden'>Таңдаулыларға</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
