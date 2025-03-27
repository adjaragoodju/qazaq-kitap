import Logo from '../components/logo';
import Field from '../components/field';
import Book from '../components/book';
import books from '../data/books.json';
import { useState } from 'react';

const Root = () => {
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [author, setAuthor] = useState('');

  const uniqueGenres = [...new Set(books.map((book) => book.genre))];
  const uniqueYears = [...new Set(books.map((book) => book.year))];

  return (
    <>
      <div className='px-2 container mx-auto'>
        <header className='py-6'>
          <nav>
            <Logo />
          </nav>
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
            const data = new FormData(e.currentTarget);
            setName(data.get('name'));
            setGenre(data.get('genre'));
            setYear(data.get('year'));
            setAuthor(data.get('author'));
          }}
          className='bg-[#282837] p-5 mt-10 rounded-xl flex items-center gap-5'
        >
          <Field name='name' label='Кітап аты' />
          <Field name='genre' label='Жанр' options={uniqueGenres} />
          <Field name='year' label='Жылы' options={uniqueYears} />
          <Field name='author' label='Автор' />
          <div className='flex-1' />
          <button className='bg-qazaq-blue px-24 py-5 text-2xl rounded-md cursor-pointer'>
            Іздеу
          </button>
        </form>

        <div className='mt-10'>
          <h3 className='text-4xl font-bold'>Танымал кітаптар</h3>
        </div>
        <div className='px-5 py-5 flex flex-wrap gap-10'>
          {books
            .filter((b) => {
              const nameMatch =
                !name || b.title.toLowerCase().includes(name.toLowerCase());
              const authorMatch =
                !author ||
                b.author.toLowerCase().includes(author.toLowerCase());
              const genreMatch =
                !genre || b.genre.toLowerCase().includes(genre.toLowerCase());
              const yearMatch = !year || b.year === year;
              return nameMatch && authorMatch && genreMatch && yearMatch;
            })
            .map((b) => (
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
      </div>

      <footer className='bg-[#122031] mt-20'>
        <div className='px-2 container mx-auto py-14'>
          <hr className='border-[#979797]' />
          <div className='mt-5 grid grid-cols-1 md:grid-cols-3 gap-10'>
            <div>
              <Logo />
            </div>
            <div className='text-white'>
              QazaqKitap — қазақ әдебиеті кітаптарын онлайн оқуға арналған
              ыңғайлы платформа. Біз сізге классикалық және заманауи қазақ
              әдебиетін бір жерде жинақтап, ыңғайлы оқу мүмкіндігін ұсынамыз.
              Кітаптарды кез келген уақытта ашып, әдеби мұрамен еркін танысыңыз!
            </div>
            <div className='text-white'>
              <div className='flex items-center gap-2'>
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
                    d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
                Проспект Мангилик Ел, С1 • Astana IT University College
              </div>
              <div className='flex items-center gap-2 mt-2'>
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
                    d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                  />
                </svg>
                +7 (775) 696 45 48
              </div>
            </div>
          </div>
          <hr className='mt-5 border-[#979797]' />
          <div className='mt-10 text-sm text-gray-500 text-center'>
            Copyright © 2025 • Алмас
          </div>
        </div>
      </footer>
    </>
  );
};

export default Root;
