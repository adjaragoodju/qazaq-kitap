// This file defines the Footer component that appears at the bottom of all pages
// It contains the app logo, description, and contact information

import Logo from './logo'; // Imports the Logo component

// Footer component with site information and contact details
const Footer = () => {
  return (
    // Footer container with dark blue background and top margin
    <footer className='bg-[#122031] mt-20'>
      {/* Content container with padding */}
      <div className='px-2 container mx-auto py-14'>
        {/* Horizontal divider */}
        <hr className='border-[#979797]' />
        {/* Three-column grid layout (single column on mobile) */}
        <div className='mt-5 grid grid-cols-1 md:grid-cols-3 gap-10'>
          {/* Column 1: Logo */}
          <div>
            <Logo />
          </div>
          {/* Column 2: Site description in Kazakh */}
          <div className='text-white'>
            QazaqKitap — қазақ әдебиеті кітаптарын онлайн оқуға арналған ыңғайлы
            платформа. Біз сізге классикалық және заманауи қазақ әдебиетін бір
            жерде жинақтап, ыңғайлы оқу мүмкіндігін ұсынамыз. Кітаптарды кез
            келген уақытта ашып, әдеби мұрамен еркін танысыңыз!
          </div>
          {/* Column 3: Contact information with icons */}
          <div className='text-white'>
            {/* Address with location icon */}
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
            {/* Phone number with phone icon */}
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
        {/* Bottom horizontal divider */}
        <hr className='mt-5 border-[#979797]' />
        {/* Copyright notice at the bottom */}
        <div className='mt-10 text-sm text-gray-500 text-center'>
          Copyright © 2025 • Алмас
        </div>
      </div>
    </footer>
  );
};

export default Footer; // Exports the Footer component for use in other files
