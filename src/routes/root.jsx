import { useState } from 'react';
import Logo from '../components/logo';
import Field from '../components/field';
import Book from '../components/book';
import Footer from '../components/footer';
import LoginModal from '../components/auth/LoginModal';
import { useAuth } from '../context/AuthContext';
import books from '../data/books.json';

const Root = () => {
  const [filters, setFilters] = useState({
    name: '',
    genre: '',
    year: '',
    author: '',
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useAuth();

  const uniqueGenres = [...new Set(books.map((book) => book.genre))];
  const uniqueYears = [...new Set(books.map((book) => book.year))];

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
      (filters.genre === '' || book.genre === filters.genre) &&
      (filters.year === '' || book.year === filters.year) &&
      (filters.author === '' ||
        book.author.toLowerCase().includes(filters.author.toLowerCase()))
    );
  });

  return (
    <>
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

      <div className='px-2 container mx-auto'>
        <header className='py-6 flex justify-between items-center'>
          <nav>
            <Logo />
          </nav>

          {!user ? (
            <button
              onClick={() => setShowLoginModal(true)}
              className='bg-qazaq-blue px-6 py-2 rounded-md'
            >
              Кіру
            </button>
          ) : (
            <div className='flex items-center space-x-4'>
              <span>Қош келдіңіз, {user.name}</span>
              <a href='/profile' className='bg-qazaq-blue px-4 py-2 rounded-md'>
                Профиль
              </a>
            </div>
          )}
        </header>

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
          <h3 className='text-4xl font-bold'>
            {filteredBooks.length > 0
              ? 'Танымал кітаптар'
              : 'Кітаптар табылмады'}
          </h3>
        </div>
        <div className='px-5 py-5 flex flex-wrap gap-10'>
          {filteredBooks.map((b) => (
            <Book
              key={b.title}
              title={b.title}
              author={b.author}
              year={b.year}
              genre={b.genre}
              image={b.image}
              bookUrl={b.bookUrl}
            />
          ))}
        </div>
        {/* Rest of the existing Root component remains the same */}
      </div>

      <Footer />
    </>
  );
};

export default Root;
