import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const Book = ({ id, title, author, year, genre, image, bookUrl, price }) => {
  const { user, refreshUserData } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Memoize the PDF URL to avoid recalculation on re-renders
  const pdfUrl = useMemo(() => {
    if (!bookUrl) return null;
    return `http://localhost:3000/uploads/books/${bookUrl}`;
  }, [bookUrl]);

  // Check if book is in favorites on load or when user changes
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user) {
        try {
          // Get the user data with favorites
          const response = await fetch(`http://localhost:3000/api/auth/me`, {
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const userData = await response.json();

          // Check if the current book is in favorites
          const favorites = userData.user.Favorite || [];
          const isBookFavorite = favorites.some(
            (fav) => fav.Book && fav.Book.id === id
          );
          setIsFavorite(isBookFavorite);
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    };

    checkFavoriteStatus();
  }, [id, user]);

  // Create a memoized function for toggling favorites
  const toggleFavorite = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!user) {
        alert('Таңдаулыларға қосу үшін жүйеге кіріңіз');
        return;
      }

      try {
        if (isFavorite) {
          // Find the favorite ID from user data
          const response = await fetch(`http://localhost:3000/api/auth/me`, {
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const userData = await response.json();
          const favorites = userData.user.Favorite || [];
          const favorite = favorites.find(
            (fav) => fav.Book && fav.Book.id === id
          );

          if (favorite) {
            // Delete the favorite using its ID
            const deleteResponse = await fetch(
              `http://localhost:3000/api/favorites/${favorite.id}`,
              {
                method: 'DELETE',
                credentials: 'include',
              }
            );

            if (!deleteResponse.ok) {
              throw new Error(`HTTP error! Status: ${deleteResponse.status}`);
            }
          }
        } else {
          // Add to favorites
          const addResponse = await fetch(
            `http://localhost:3000/api/favorites`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ bookId: id }),
              credentials: 'include',
            }
          );

          if (!addResponse.ok) {
            throw new Error(`HTTP error! Status: ${addResponse.status}`);
          }
        }

        // Toggle the favorite state locally
        setIsFavorite(!isFavorite);

        // Refresh user data after toggling favorite
        await refreshUserData();
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    },
    [id, isFavorite, user, refreshUserData]
  );

  // Create a memoized function for adding to cart
  const addToCart = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!user) {
        alert('Себетке қосу үшін жүйеге кіріңіз');
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookId: id }),
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        alert(`Кітап себетке қосылды: ${title}`);

        // Refresh user data after adding to cart
        await refreshUserData();
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    },
    [id, title, user, refreshUserData]
  );

  // Use correct image path and handle errors - memoized to avoid recalculation
  const imageUrl = useMemo(() => {
    if (imageError) {
      return 'http://localhost:3000/api/static/uploads/placeholder.png';
    }
    return `http://localhost:3000/api/static/uploads/${image}`;
  }, [image, imageError]);

  // Handle image error callback
  const handleImageError = useCallback(() => {
    console.error(`Failed to load image: ${image}`);
    setImageError(true);
  }, [image]);

  return (
    <div className='block w-full sm:w-[200px] md:w-[220px] lg:w-[240px] h-auto sm:h-[480px] transition-transform hover:scale-105 max-w-[240px]'>
      <Link to={`/book/${id}`}>
        <div className='relative'>
          <img
            className='rounded-lg w-full h-[240px] sm:h-[280px] md:h-[300px] lg:h-[320px] object-cover'
            src={imageUrl}
            alt={title}
            onError={handleImageError}
            loading='lazy' // Native lazy loading
          />
          <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 rounded-b-lg'>
            <div className='text-white text-xs sm:text-sm font-light'>
              {genre}
            </div>
          </div>

          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            className='absolute top-2 right-2 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-colors'
          >
            {isFavorite ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4 sm:h-5 sm:w-5 text-red-500'
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
                className='h-4 w-4 sm:h-5 sm:w-5'
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

        <div className='mt-3 sm:mt-4'>
          <div className='text-base sm:text-lg md:text-xl font-bold text-[#4A83F6] truncate'>
            {title}
          </div>
          <div className='text-sm sm:text-base md:text-lg truncate'>
            {author} - {year}
          </div>
          <div className='text-base sm:text-lg md:text-xl font-bold text-[#4A83F6] truncate mt-1'>
            {price}
          </div>
        </div>
      </Link>
    </div>
  );
};

// Use React.memo for performance optimization
export default React.memo(Book);
