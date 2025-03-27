import React from 'react';
import Logo from '../components/logo';
import Footer from '../components/footer';

const CartPage = () => {
  return (
    <>
      <div className='px-2 container mx-auto'>
        <header className='py-6'>
          <nav>
            <Logo />
          </nav>
        </header>

        <div className='mt-10'>
          <h1 className='text-4xl font-bold mb-6'>Себет</h1>
          <p>Себетіңізәзірше бос.</p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CartPage;
