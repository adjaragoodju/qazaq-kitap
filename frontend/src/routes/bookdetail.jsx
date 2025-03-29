import { useParams } from 'react-router-dom';
import Logo from '../components/logo';
import Footer from '../components/footer';
import { useState, useEffect } from 'react';

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:3000/api/books/${id}`);
      const data = await response.json();
      setBook(data);
    };
    fetchData();
  }, [book]);
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
              src={`http://localhost:3000/uploads/${book.image}`}
              alt={book.title}
              className='w-full max-h-[600px] object-cover rounded-xl'
            />
          </div>

          {/* Book Details */}
          <div>
            <h1 className='text-4xl font-bold mb-4'>{book.title}</h1>
            <div className='text-xl mb-4'>
              <strong>Автор:</strong> {book.author.name}
            </div>
            <div className='text-xl mb-4'>
              <strong>Жанр:</strong> {book.genre}
            </div>
            <div className='text-xl mb-4'>
              <strong>Жылы:</strong> {book.year}
            </div>

            {/* Download Button */}
            <a
              download
              href={`http://localhost:3000/uploads/books/${book.pdf}`}
              className='block mt-2 text-center bg-qazaq-blue/90 p-2 rounded-md text-white'
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
