import { useParams } from 'react-router-dom';
import Logo from '../components/logo';
import Footer from '../components/footer';
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

      <Footer />
    </>
  );
}
