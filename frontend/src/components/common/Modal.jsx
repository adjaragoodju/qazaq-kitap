// This file defines a reusable Modal component for displaying popup content
// It provides a consistent UI for dialogs throughout the application

import React from 'react'; // Imports React library

// Modal component that accepts props: isOpen (boolean), onClose (function), title (string), and children (React nodes)
const Modal = ({ isOpen, onClose, title, children }) => {
  // If isOpen is false, don't render anything
  if (!isOpen) return null;

  return (
    // Full-screen overlay with semi-transparent black background
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      // Modal container with dark background, padding, and rounded corners
      <div className='bg-[#282837] p-8 rounded-xl w-full max-w-md'>
        // Header section with title and close button
        <div className='flex justify-between items-center mb-6'>
          // Modal title with large font
          <h2 className='text-3xl font-bold'>{title}</h2>
          // Close button with X icon
          <button onClick={onClose} className='text-gray-400 hover:text-white'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>
        // Content area that renders whatever is passed as children
        {children}
      </div>
    </div>
  );
};

export default Modal; // Exports the Modal component for use in other files
