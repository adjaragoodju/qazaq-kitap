import { useEffect, useState } from 'react';
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
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  // Get unique values for filters
  const uniqueGenres = [
    ...new Set(books.map((book) => book.genre.name)),
  ].sort();
  const uniqueYears = [...new Set(books.map((book) => book.year))].sort(
    (a, b) => a - b
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredBooks = books.filter((book) => {
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

  return (
    <>
      <div className='px-2 container mx-auto'>
        <Navbar />

        {/* Main banner */}
        <div className='relative rounded-xl'>
          <img
            src='/khandar.jpg'
            className='w-full h-[568px] object-cover rounded-xl'
            alt='Main Banner'
            onError={(e) => {
              console.error('Failed to load banner image');
              e.target.src =
                'http://localhost:3000/api/static/uploads/placeholder.png';
            }}
          />

          <div className='absolute bg-gradient-to-t from-black/80 to-white/0 bottom-0 left-0 w-full px-7 py-10 flex justify-between items-center rounded-xl'>
            <div>
              <div className='text-2xl font-light'>
                Кәрібаев Берекет Бақытжанұлы
              </div>
              <div className='mt-1.5 text-4xl font-bold'>
                Қазақ хандығының құрылу тарихы
              </div>
            </div>

            <Link
              to={`/book/${featuredBookId}`}
              className='bg-qazaq-blue/90 p-3.5 text-2xl font-bold rounded-4xl cursor-pointer'
            >
              Қазір Оқыңыз
            </Link>
          </div>
        </div>

        {/* Filter form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className='bg-[#282837] p-5 mt-10 rounded-xl flex items-center gap-5'
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
            onClick={() => {
              setFilters({
                name: '',
                genre: '',
                year: '',
                author: '',
              });
            }}
            className='bg-gray-600 px-12 py-4 text-xs sm:text-xl rounded-md cursor-pointer'
          >
            Тазарту
          </button>
        </form>

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
              <h3 className='text-4xl font-bold'>
                {filteredBooks.length > 0
                  ? 'Танымал кітаптар'
                  : 'Кітаптар табылмады'}
              </h3>
              <div className='px-5 py-5 flex flex-wrap gap-10'>
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
