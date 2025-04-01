import { useEffect, useState, useMemo, useCallback } from 'react';
import Logo from '../components/logo';
import Field from '../components/field';
import Book from '../components/book';
import Footer from '../components/footer';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/navbar';

const Root = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredBookId, setFeaturedBookId] = useState(null);
  const [showFilterForm, setShowFilterForm] = useState(false);

  // Use useEffect for data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/books');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setBooks(data);

        // Look for the featured book by title or create a special case
        const featuredBook = data.find(
          (book) =>
            book.title === 'Қазақ хандығының құрылу тарихы' &&
            book.author.name === 'Кәрібаев Берекет Бақытжанұлы'
        );

        // If the featured book exists in the database, use its ID
        if (featuredBook) {
          setFeaturedBookId(featuredBook.id);
        } else {
          // If not found, we'll use a fallback ID or special handling
          // This could be the first book in the database or a special hardcoded ID
          setFeaturedBookId(data.length > 0 ? data[0].id : '1');
        }

        setError(null);
      } catch (err) {
        setError('Кітаптарды жүктеу кезінде қате туындады');
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [filters, setFilters] = useState({
    name: '',
    genre: '',
    year: '',
    author: '',
  });

  const navigate = useNavigate();

  const { user, logout } = useAuth();

  // Use useCallback for event handlers
  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  // Memoize expensive calculations
  const uniqueGenres = useMemo(() => {
    return [...new Set(books.map((book) => book.genre.name))].sort();
  }, [books]);

  const uniqueYears = useMemo(() => {
    return [...new Set(books.map((book) => book.year))].sort((a, b) => a - b);
  }, [books]);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  }, []);

  // Memoize filtered books to avoid recalculation on every render
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      return (
        (filters.name === '' ||
          book.title.toLowerCase().includes(filters.name.toLowerCase())) &&
        (filters.genre === '' || book.genre.name === filters.genre) &&
        (filters.year === '' || book.year == filters.year) &&
        (filters.author === '' ||
          (book.author.name &&
            book.author.name
              .toLowerCase()
              .includes(filters.author.toLowerCase())))
      );
    });
  }, [books, filters]);

  const toggleFilterForm = useCallback(() => {
    setShowFilterForm((prev) => !prev);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      name: '',
      genre: '',
      year: '',
      author: '',
    });
  }, []);

  return (
    <>
      <div className='px-2 container mx-auto'>
        <Navbar />

        {/* Main banner */}
        <div className='relative rounded-xl'>
          <img
            src='/khandar.jpg'
            className='w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[568px] object-cover rounded-xl'
            alt='Main Banner'
            loading='lazy'
            onError={(e) => {
              console.error('Failed to load banner image');
              e.target.src =
                'http://localhost:3000/api/static/uploads/placeholder.png';
            }}
          />

          <div className='absolute bg-gradient-to-t from-black/80 to-white/0 bottom-0 left-0 w-full px-4 py-4 sm:px-7 sm:py-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 rounded-xl'>
            <div>
              <div className='text-lg sm:text-xl md:text-2xl font-light'>
                Кәрібаев Берекет Бақытжанұлы
              </div>
              <div className='mt-1 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold'>
                Қазақ хандығының құрылу тарихы
              </div>
            </div>

            <Link
              to={`/book/${featuredBookId}`}
              className='bg-qazaq-blue/90 px-4 py-2 sm:p-3.5 text-lg sm:text-xl md:text-2xl font-bold rounded-lg sm:rounded-4xl cursor-pointer'
            >
              Қазір Оқыңыз
            </Link>
          </div>
        </div>

        {/* Mobile filter toggle button */}
        <div className='mt-5 block md:hidden'>
          <button
            onClick={toggleFilterForm}
            className='bg-qazaq-blue text-white px-4 py-2 rounded-lg w-full flex items-center justify-center'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 mr-2'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z'
                clipRule='evenodd'
              />
            </svg>
            {showFilterForm ? 'Фильтрді жасыру' : 'Фильтр көрсету'}
          </button>
        </div>

        {/* Filter form - Desktop (md:) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className='hidden md:flex bg-[#282837] p-5 mt-5 rounded-xl items-center gap-5'
        >
          <Field
            name='name'
            label='Кітап аты'
            onChange={handleFilterChange}
            value={filters.name}
          />
          <Field
            name='genre'
            label='Жанр'
            options={uniqueGenres}
            onChange={handleFilterChange}
            value={filters.genre}
          />
          <Field
            name='year'
            label='Жылы'
            options={uniqueYears}
            onChange={handleFilterChange}
            value={filters.year}
          />
          <Field
            name='author'
            label='Автор'
            onChange={handleFilterChange}
            value={filters.author}
          />
          <div className='flex-1' />
          <button
            type='button'
            onClick={clearFilters}
            className='bg-gray-600 px-12 py-5 text-xs sm:text-xl rounded-md cursor-pointer'
          >
            Тазарту
          </button>
        </form>

        {/* Filter form - Mobile (collapsed) */}
        {showFilterForm && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className='md:hidden bg-[#282837] p-5 mt-3 rounded-xl flex flex-col gap-4'
          >
            <Field
              name='name'
              label='Кітап аты'
              onChange={handleFilterChange}
              value={filters.name}
            />
            <Field
              name='genre'
              label='Жанр'
              options={uniqueGenres}
              onChange={handleFilterChange}
              value={filters.genre}
            />
            <Field
              name='year'
              label='Жылы'
              options={uniqueYears}
              onChange={handleFilterChange}
              value={filters.year}
            />
            <Field
              name='author'
              label='Автор'
              onChange={handleFilterChange}
              value={filters.author}
            />
            <button
              type='button'
              onClick={clearFilters}
              className='bg-gray-600 py-3 text-sm rounded-md cursor-pointer mt-2'
            >
              Тазарту
            </button>
          </form>
        )}

        {/* Book listing */}
        <div className='mt-10'>
          {loading ? (
            <div className='text-center py-10'>
              <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-qazaq-blue border-r-transparent'></div>
              <p className='mt-2'>Кітаптар жүктелуде...</p>
            </div>
          ) : error ? (
            <div className='bg-red-500/20 text-red-500 p-4 rounded-md text-center'>
              {error}
            </div>
          ) : (
            <>
              <h3 className='text-2xl sm:text-3xl md:text-4xl font-bold'>
                {filteredBooks.length > 0
                  ? 'Танымал кітаптар'
                  : 'Кітаптар табылмады'}
              </h3>
              <div className='px-2 sm:px-5 py-5 flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-10'>
                {filteredBooks.map((book) => (
                  <Book
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    author={book.author.name}
                    year={book.year}
                    genre={book.genre.name}
                    image={book.image}
                    bookUrl={book.pdf}
                    price={book.price}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Root;
