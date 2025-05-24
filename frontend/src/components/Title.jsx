import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="flex flex-col items-center mb-6">
      {/* Text Content */}
      <h1
        className="text-2xl sm:text-2xl font-black tracking-tight leading-none 
                   bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-500 
                   transform -skew-x-4 inline-block"
      >
        {text1} {text2}
      </h1>
      {/* Divider Line - Giữ nguyên màu vàng đồng bộ */}
      <div className="w-20 sm:w-24 h-1.5 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full mt-3"></div>
    </div>
  );
};

export default Title;
