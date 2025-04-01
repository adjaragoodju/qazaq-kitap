import Logo from './logo';

const Footer = () => {
  return (
    <footer className='bg-[#122031] mt-20'>
      <div className='px-4 container mx-auto py-10 md:py-14'>
        <hr className='border-[#979797]' />

        {/* Three-column grid layout (stacked on mobile) */}
        <div className='mt-5 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10'>
          {/* Column 1: Logo */}
          <div className='flex justify-center md:justify-start'>
            <Logo />
          </div>

          {/* Column 2: Site description in Kazakh */}
          <div className='text-white text-center md:text-left'>
            QazaqKitap — қазақ әдебиеті кітаптарын онлайн оқуға арналған ыңғайлы
            платформа. Біз сізге классикалық және заманауи қазақ әдебиетін бір
            жерде жинақтап, ыңғайлы оқу мүмкіндігін ұсынамыз. Кітаптарды кез
            келген уақытта ашып, әдеби мұрамен еркін танысыңыз!
          </div>

          {/* Column 3: Contact information with icons */}
          <div className='text-white'>
            {/* Address with location icon */}
            <div className='flex items-center gap-2 justify-center md:justify-start'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 flex-shrink-0'
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
              <span className='text-sm sm:text-base'>
                Проспект Мангилик Ел, С1 • Astana IT University College
              </span>
            </div>

            {/* Phone number with phone icon */}
            <div className='flex items-center gap-2 mt-4 justify-center md:justify-start'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 flex-shrink-0'
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
              <span className='text-sm sm:text-base'>+7 (775) 696 45 48</span>
            </div>
          </div>
        </div>

        {/* Bottom horizontal divider */}
        <hr className='mt-8 border-[#979797]' />

        {/* Copyright notice at the bottom */}
        <div className='mt-8 text-xs sm:text-sm text-gray-500 text-center'>
          Copyright © 2025 • Алмас
        </div>
      </div>
    </footer>
  );
};

export default Footer;
