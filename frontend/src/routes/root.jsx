import { useEffect, useState } from 'react';
import Logo from '../components/logo';
import Field from '../components/field';
import Book from '../components/book';
import Footer from '../components/footer';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';
import { useAuth } from '../context/AuthContext';

const Root = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const { user, logout } = useAuth();

  // Get unique values for filters
  const uniqueGenres = [...new Set(books.map((book) => book.genre))];
  const uniqueYears = [...new Set(books.map((book) => book.year))];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const openLoginModal = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const openRegisterModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  const filteredBooks = books.filter((book) => {
    return (
      (filters.name === '' ||
        book.title.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.genre === '' || book.genre === filters.genre) &&
      (filters.year === '' || book.year === filters.year) &&
      (filters.author === '' ||
        (book.author.name &&
          book.author.name
            .toLowerCase()
            .includes(filters.author.toLowerCase())))
    );
  });

  return (
    <>
      {showLoginModal && (
        <LoginModal
          onClose={closeModals}
          onSwitchToRegister={openRegisterModal}
        />
      )}

      {showRegisterModal && (
        <RegisterModal onClose={closeModals} onSwitchToLogin={openLoginModal} />
      )}

      <div className='px-2 container mx-auto'>
        <header className='py-6 flex justify-between items-center'>
          <nav>
            <Logo />
          </nav>

          {!user ? (
            <div className='flex space-x-4'>
              <button
                onClick={openLoginModal}
                className='bg-qazaq-blue px-6 py-2 rounded-md'
              >
                Кіру
              </button>
              <button
                onClick={openRegisterModal}
                className='border border-qazaq-blue text-qazaq-blue px-6 py-2 rounded-md'
              >
                Тіркелу
              </button>
            </div>
          ) : (
            <div className='flex items-center space-x-4'>
              <span>Қош келдіңіз, {user.name}</span>
              <a href='/profile' className='bg-qazaq-blue px-4 py-2 rounded-md'>
                Профиль
              </a>
              <button
                onClick={logout}
                className='border border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition-colors'
              >
                Шығу
              </button>
            </div>
          )}
        </header>

        {/* The rest of your component remains the same */}
        <div className='relative rounded-xl'>
          <img
            src='/khandar.jpg'
            className='w-full h-[568px] object-cover rounded-xl'
            alt='Main Banner'
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

            <a
              download
              href='/books/kazaktarih.pdf'
              className='bg-qazaq-blue/90 p-3.5 text-2xl font-bold rounded-4xl cursor-pointer'
            >
              Қазір Оқыңыз
            </a>
          </div>
        </div>

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
            className='bg-gray-600 px-12 py-5 text-2xl rounded-md cursor-pointer mr-4'
          >
            Тазарту
          </button>
          <button
            type='submit'
            className='bg-qazaq-blue px-24 py-5 text-2xl rounded-md cursor-pointer'
          >
            Іздеу
          </button>
        </form>

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
                {filteredBooks.map((b) => (
                  <Book
                    key={b.id}
                    title={b.title}
                    author={b.author.name}
                    year={b.year}
                    genre={b.genre}
                    image={b.image}
                    bookUrl={b.pdf}
                    id={b.id}
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
