import React, { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      setVisible(scrolled > 300);
    };

    window.addEventListener("scroll", toggleVisible);
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
    onClick={scrollToTop}
    className={`fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full 
    bg-white text-black border border-gray-300 shadow transition-all duration-300
    hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 hover:text-white hover:shadow-xl 
    transform hover:scale-110 ${
      visible ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"
    }`}
    aria-label="Lên đầu trang"
  >
    <IoIosArrowUp  className="w-6 h-6" />
  </button>
  
  );
};

export default BackToTop;
