import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Book from '../components/book';
import { API_URL, useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { user, refreshUserData } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('User object:', user);

    if (!user || !Array.isArray(user.Cart)) {
      setLoading(false);
      return;
    }

    // Transform data structure to include cartId
    const cartBooks = user.Cart.map((cartItem) => ({
      cartId: cartItem.id, // ID of cart item for removal
      ...cartItem.Book,
    }));

    setCartItems(cartBooks);
    setLoading(false);
    console.log('Cart set:', cartBooks);
  }, [user]);

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  // Function to remove item from cart
  const removeFromCart = async (cartId) => {
    try {
      const response = await fetch(`${API_URL}/cart/${cartId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to remove from cart');
      }

      // Update local state immediately
      setCartItems((prevCart) =>
        prevCart.filter((book) => book.cartId !== cartId)
      );

      // Refresh user data to update other components
      await refreshUserData();
    } catch (error) {
      console.error('Error removing book:', error);
    }
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to clear entire cart
  const clearCart = async () => {
    try {
      // Delete each item one by one
      const deletePromises = cartItems.map((item) =>
        fetch(`${API_URL}/cart/${item.cartId}`, {
          method: 'DELETE',
          credentials: 'include',
        })
      );

      await Promise.all(deletePromises);

      // Update local state
      setCartItems([]);

      // Refresh user data
      await refreshUserData();

      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  };

  // Function to handle checkout process
  const handleCheckout = async (e) => {
    e.preventDefault();

    // Simulate processing payment
    setLoading(true);

    // Fake API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate successful payment
    const success = await clearCart();

    if (success) {
      // Store order details in localStorage
      const orderHistory = JSON.parse(localStorage.getItem('orders') || '[]');
      const newOrder = {
        id: `ORD-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        items: cartItems.map((item) => ({
          id: item.id,
          title: item.title,
          author: item.author.name,
          image: item.image,
          pdf: item.pdf,
          price: item.price,
          quantity: 1,
        })),
        total: totalPrice,
      };

      orderHistory.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orderHistory));

      setOrderSuccess(true);
      setLoading(false);
    } else {
      setLoading(false);
      alert('Төлем өңдеу кезінде қате пайда болды. Қайталап көріңіз.');
    }
  };

  if (orderSuccess) {
    return (
      <>
        <div className='px-4 container mx-auto'>
          <Navbar />

          <div className='mt-6 sm:mt-10 bg-[#282837] p-6 sm:p-8 rounded-xl text-center'>
            <div className='mb-6'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-12 w-12 sm:h-16 sm:w-16 text-green-500 mx-auto'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h1 className='text-xl sm:text-2xl md:text-3xl font-bold mb-4'>
              Тапсырысыңыз қабылданды!
            </h1>
            <p className='text-base sm:text-lg mb-6'>
              Сатып алғаныңыз үшін рахмет. Тапсырыс мәліметтері профиліңізге
              қосылды.
            </p>
            <div className='flex flex-col sm:flex-row justify-center gap-4'>
              <button
                onClick={() => navigate('/')}
                className='bg-qazaq-blue px-6 py-2 rounded-md mb-2 sm:mb-0'
              >
                Кітаптарға оралу
              </button>
              <button
                onClick={() => navigate('/profile')}
                className='bg-gray-700 px-6 py-2 rounded-md'
              >
                Профильге өту
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className='px-4 container mx-auto'>
        <Navbar />

        <div className='mt-6 sm:mt-10'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6'>
            Сіздің себетіңіз
          </h1>

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
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Books grid */}
              <div className='lg:col-span-2'>
                <div className='bg-[#282837] p-4 sm:p-6 rounded-xl'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
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
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(book.cartId)}
                          className='absolute top-2 right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition-colors z-10'
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
              </div>

              {/* Checkout section */}
              <div className='bg-[#282837] p-4 sm:p-6 rounded-xl'>
                <h2 className='text-xl sm:text-2xl font-bold mb-4'>
                  Тапсырыс мәліметтері
                </h2>

                <div className='border-t border-b border-gray-700 py-4 my-4'>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-gray-400'>
                      Кітаптар (жалпы {cartItems.length})
                    </span>
                    <span>{totalPrice} ₸</span>
                  </div>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-gray-400'>Жеткізу</span>
                    <span>Тегін</span>
                  </div>
                </div>

                <div className='flex justify-between items-center text-lg sm:text-xl font-bold mb-6'>
                  <span>Жалпы сома</span>
                  <span className='text-qazaq-blue'>{totalPrice} ₸</span>
                </div>

                {isCheckingOut ? (
                  <form onSubmit={handleCheckout}>
                    <div className='space-y-4'>
                      <div>
                        <label className='block mb-1 text-sm'>
                          Карта нөмірі
                        </label>
                        <input
                          type='text'
                          placeholder='1234 5678 9012 3456'
                          name='cardNumber'
                          value={paymentDetails.cardNumber}
                          onChange={handleInputChange}
                          className='w-full p-2 bg-[#1D1D2A] rounded'
                          required
                        />
                      </div>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <label className='block mb-1 text-sm'>
                            Жарамдылық мерзімі
                          </label>
                          <input
                            type='text'
                            placeholder='MM/YY'
                            name='expiryDate'
                            value={paymentDetails.expiryDate}
                            onChange={handleInputChange}
                            className='w-full p-2 bg-[#1D1D2A] rounded'
                            required
                          />
                        </div>
                        <div>
                          <label className='block mb-1 text-sm'>CVV</label>
                          <input
                            type='text'
                            placeholder='123'
                            name='cvv'
                            value={paymentDetails.cvv}
                            onChange={handleInputChange}
                            className='w-full p-2 bg-[#1D1D2A] rounded'
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className='block mb-1 text-sm'>
                          Карта иесінің аты-жөні
                        </label>
                        <input
                          type='text'
                          placeholder='JOHN DOE'
                          name='name'
                          value={paymentDetails.name}
                          onChange={handleInputChange}
                          className='w-full p-2 bg-[#1D1D2A] rounded'
                          required
                        />
                      </div>
                      <div className='flex flex-col sm:flex-row justify-between gap-2 mt-6'>
                        <button
                          type='button'
                          onClick={() => setIsCheckingOut(false)}
                          className='py-3 bg-gray-700 rounded-md sm:w-1/2 order-2 sm:order-1'
                        >
                          Артқа
                        </button>
                        <button
                          type='submit'
                          className='py-3 bg-qazaq-blue rounded-md sm:w-1/2 order-1 sm:order-2 mb-2 sm:mb-0'
                        >
                          Төлеу
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsCheckingOut(true)}
                    className='w-full py-3 bg-qazaq-blue rounded-md font-bold'
                  >
                    Тапсырыс беру
                  </button>
                )}
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
