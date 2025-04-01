import { useId } from 'react';

const Field = ({ name, label, options, onChange, value }) => {
  const id = useId();

  return (
    <div className='w-full'>
      {/* Label for the form field */}
      <label htmlFor={id} className='block text-sm md:text-base'>
        {label}
      </label>
      {/* Render different input types based on whether options array is provided */}
      {options ? (
        // If options provided, render a dropdown/select element
        <div className='flex border border-[#A4A4A4] rounded-md items-center mt-2 py-2 md:py-3 relative'>
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className='w-full appearance-none bg-transparent px-2 py-1 text-sm md:text-base'
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
            className='size-4 absolute right-2 pointer-events-none'
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
          className='w-full border border-[#A4A4A4] rounded-md mt-2 py-2 md:py-3 px-2 text-sm md:text-base'
        />
      )}
    </div>
  );
};

export default Field;
