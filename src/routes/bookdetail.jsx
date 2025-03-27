import { useParams } from 'react-router-dom';
import Logo from '../components/logo';
import books from '../data/books.json';

export default function BookDetail() {
  const { title } = useParams();
  const book = books.find((b) => b.title === decodeURIComponent(title));

  if (!book) {
    return (
      <div className='container mx-auto px-4 py-10'>
        <h1 className='text-3xl font-bold'>Кітап табылмады</h1>
        <p>Кешіріңіз, аталған кітап қолжетімсіз.</p>
      </div>
    );
  }

  return (
    <>
      <div className='px-2 container mx-auto'>
        <header className='py-6'>
          <nav>
            <Logo />
          </nav>
        </header>

        <div className='grid md:grid-cols-2 gap-10 mt-10'>
          {/* Book Image */}
          <div>
            <img
              src={book.image}
              alt={book.title}
              className='w-full max-h-[600px] object-cover rounded-xl'
            />
          </div>

          {/* Book Details */}
          <div>
            <h1 className='text-4xl font-bold mb-4'>{book.title}</h1>
            <div className='text-xl mb-4'>
              <strong>Автор:</strong> {book.author}
            </div>
            <div className='text-xl mb-4'>
              <strong>Жанр:</strong> {book.genre}
            </div>
            <div className='text-xl mb-4'>
              <strong>Жылы:</strong> {book.year}
            </div>

            {/* Download Button */}
            <a
              href={book.bookUrl}
              download
              className='bg-qazaq-blue/90 p-3.5 text-2xl font-bold rounded-4xl cursor-pointer inline-block mt-6'
            >
              Кітапты Жүктеу
            </a>
          </div>
        </div>
      </div>

      {/* Footer - Same as Root component */}
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
}
