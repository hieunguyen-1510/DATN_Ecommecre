import React from 'react';

const Title = ({ text1, text2 }) => {
  return (
    <div className="flex flex-col items-center mb-6">
      {/* Text Content */}
      <h1 className="text-3xl sm:text-xl font-bold text-gray-800 tracking-wide">
        {text1}{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-500">
          {text2}
        </span>
      </h1>
      {/* Divider Line */}
      <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full mt-2"></div>
    </div>
  );
};

export default Title;
