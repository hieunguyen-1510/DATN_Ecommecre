import React from 'react';

const StartFilter = ({ onFilter, selected }) => {
  const stars = [5, 4, 3, 2, 1];

  return (
    <div className="flex items-center gap-2 my-6">
      <button
        className={`px-4 py-2 rounded ${
          selected === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
        onClick={() => onFilter(0)}
      >
        Tất cả
      </button>
      {stars.map((star) => (
        <button
          key={star}
          className={`px-4 py-2 rounded ${
            selected === star ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => onFilter(star)}
        >
          {star}★
        </button>
      ))}
    </div>
  );
};

export default StartFilter;
