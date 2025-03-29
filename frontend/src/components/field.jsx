import { useId } from 'react';

const Field = ({ name, label, options, onChange, value }) => {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className='block'>
        {label}
      </label>
      {options ? (
        <div className='flex border border-[#A4A4A4] rounded-md items-center mt-2 py-3'>
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className='min-w-[100px] rounded-md px-2 appearance-none'
          >
            <option value=''>-</option>
            {options.map((o, index) => (
              <option key={index} value={o}>
                {o}
              </option>
            ))}
          </select>
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

export default Field;
