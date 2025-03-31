// This file defines a reusable Field component for form inputs (text inputs or dropdowns)
// It handles both regular text inputs and select dropdowns based on whether options are provided

import { useId } from 'react'; // Imports useId hook for generating unique IDs

// Field component that accepts props for name, label, options (optional), onChange function, and current value
const Field = ({ name, label, options, onChange, value }) => {
  const id = useId(); // Generates a unique ID for associating label with input element

  return (
    <div>
      {/* Label for the form field */}
      <label htmlFor={id} className='block'>
        {label}
      </label>
      {/* Render different input types based on whether options array is provided */}
      {options ? (
        // If options provided, render a dropdown/select element
        <div className='flex border border-[#A4A4A4] rounded-md items-center mt-2 py-3'>
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className='min-w-[100px] rounded-md px-2 appearance-none'
          >
            {/* Default empty option */}
            <option value=''>-</option>
            {/* Map through options array to create option elements */}
            {options.map((o, index) => (
              <option key={index} value={o}>
                {o}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow icon */}
          <svg
            className='size-4'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9'
            />
          </svg>
        </div>
      ) : (
        // If no options provided, render a text input field
        <input
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className='min-w-[100px] border border-[#A4A4A4] rounded-md mt-2 py-3 px-2'
        />
      )}
    </div>
  );
};

export default Field; // Exports the Field component for use in other files
