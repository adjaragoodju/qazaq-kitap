// This file defines the Logo component used in header and footer
// It displays the app name "QazaqKitap" with the "Kitap" part in blue

// Logo component that renders the site name as a link to the homepage
const Logo = () => {
  return (
    // Anchor tag that links to the homepage with large bold text
    <a className='text-3xl font-bold' href='/'>
      Qazaq<span className='text-qazaq-blue'>Kitap.</span>
    </a>
  );
};

export default Logo; // Exports the Logo component for use in other files
