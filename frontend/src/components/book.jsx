import { Link } from 'react-router-dom';

const Book = ({ id, title, author, year, genre, image, bookUrl }) => {
  return (
    <div className='block max-w-[263px] transition-transform hover:scale-105'>
      <Link to={`/book/${id}`}>
        <div className='relative'>
          <img
            className='rounded-lg w-full h-[350px] object-cover'
            src={`http://localhost:3000/uploads/${image}`}
            alt={title}
          />
          <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 rounded-b-lg'>
            <div className='text-white text-sm font-light'>{genre}</div>
          </div>
        </div>

        <div className='mt-4'>
          <div className='text-xl font-bold text-[#4A83F6]'>{title}</div>
          <div className='text-lg'>
            {author} - {year}
          </div>
        </div>
      </Link>
      <a
        download
        href={`http://localhost:3000/uploads/books/${bookUrl}`}
        className='block mt-2 text-center bg-qazaq-blue/90 p-2 rounded-md text-white'
      >
        Жүктеу
      </a>
    </div>
  );
};

export default Book;
