import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Book = ({ id, title, author, year, genre, image, bookUrl, price }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if book is in favorites on load
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/users/${user.id}/favorites`
          );
          const favorites = await response.json();
          const isBookFavorite = favorites.some((fav) => fav.id === id);
          setIsFavorite(isBookFavorite);
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    };

    checkFavoriteStatus();
  }, [id, user]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert('Таңдаулыларға қосу үшін жүйеге кіріңіз');
      return;
    }

    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await fetch(
        `http://localhost:3000/api/users/${user.id}/favorites`,
        {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookId: id }),
        }
      );

      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const addToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert('Себетке қосу үшін жүйеге кіріңіз');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${user.id}/cart`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookId: id, quantity: 1 }),
        }
      );

      if (response.ok) {
        alert(`Кітап себетке қосылды: ${title}`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className='block w-[240px] h-[480px] transition-transform hover:scale-105'>
      <Link to={`/book/${id}`}>
        <div className='relative'>
          <img
            className='rounded-lg w-full h-[320px] object-cover'
            src={`http://localhost:3000/uploads/${image}`}
            alt={title}
          />
          <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 rounded-b-lg'>
            <div className='text-white text-sm font-light'>{genre}</div>
          </div>

          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            className='absolute top-2 right-2 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-colors'
          >
            {isFavorite ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-red-500'
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
                className='h-5 w-5'
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

        <div className='mt-4'>
          <div className='text-xl font-bold text-[#4A83F6] truncate'>
            {title}
          </div>
          <div className='text-lg truncate'>
            {author} - {year}
          </div>
          <div className='text-xl font-bold text-[#4A83F6] truncate'>
            {price}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Book;
