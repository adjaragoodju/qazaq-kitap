import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Book from '../components/book';
import { API_URL, useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('User object:', user);

    if (!user || !Array.isArray(user.Cart)) {
      setLoading(false);
      return;
    }

    // Трансформируем структуру данных, чтобы добавить cartId
    const cartBooks = user.Cart.map((cartItem) => ({
      cartId: cartItem.id, // ID элемента корзины для удаления
      ...cartItem.Book,
    }));

    setCartItems(cartBooks);
    setLoading(false);
    console.log('Cart set:', cartBooks);
  }, [user]);

  // 🔥 Функция удаления книги из корзины по ID корзины
  const removeFromCart = async (cartId) => {
    try {
      const response = await fetch(`${API_URL}/cart/${cartId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove from cart');
      }

      // 🔥 Обновляем состояние локально
      setCartItems((prevCart) =>
        prevCart.filter((book) => book.cartId !== cartId)
      );
    } catch (error) {
      console.error('Error removing book:', error);
    }
  };

  return (
    <>
      <div className='px-2 container mx-auto'>
        <Navbar />

        <div className='mt-10'>
          <h1 className='text-4xl font-bold mb-6'>Сіздің себетіңіз</h1>

          {loading ? (
            <div className='text-center py-10'>
              <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-qazaq-blue border-r-transparent'></div>
              <p className='mt-2'>Жүктелуде...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className='bg-[#282837] p-6 rounded-xl'>
              <p className='text-xl'>Сіздің себетіңіз бос.</p>
              <a
                href='/'
                className='inline-block mt-4 bg-qazaq-blue px-6 py-2 rounded-md'
              >
                Кітаптарды қарау
              </a>
            </div>
          ) : (
            <div className='bg-[#282837] p-6 rounded-xl'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {cartItems.map((book) => (
                  <div key={book.cartId} className='relative'>
                    <Book
                      id={book.id}
                      title={book.title}
                      author={book.author.name}
                      year={book.year}
                      genre={book.genre.name}
                      image={book.image}
                      bookUrl={book.pdf}
                      price={book.price}
                    />
                    {/* 🔥 Кнопка удаления из корзины */}
                    <button
                      onClick={() => removeFromCart(book.cartId)}
                      className='absolute top-2 right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition-colors'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CartPage;
