/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lexend', 'sans-serif'],
        handwritten: ['"SVN Dancing Script"', 'cursive'],
      },
      colors: {
        // Màu chủ đạo cho streetwear
        primary: {
          DEFAULT: "#E63946", // Đỏ tươi - điểm nhấn chính
          dark: "#C1121F",   // Đỏ đậm - nền hoặc viền
          light: "#F4A5A9",  // Đỏ nhạt - accent nhẹ
        },
        secondary: {
          DEFAULT: "#1D3557", // Xanh navy - nền hoặc tiêu đề
          light: "#457B9D",   // Xanh nhạt - highlight
        },
        accent: {
          DEFAULT: "#FFD700", // Vàng gold - nút nhấn
          dark: "#FFC300",    // Vàng đậm - hiệu ứng hover
        },
        neutral: {
          DEFAULT: "#F1FAEE", // Màu nền sáng - chính
          dark: "#A8DADC",    // Xanh pastel nhạt - nền phụ
          gray: "#4B5563",    // Xám - text phụ
        },
        // Xóa màu cũ nếu không dùng
        // "yellow-500": "#FFD700",
        // "green-600": "#16a34a",
        // "red-600": "#dc2626",
        // "gray-600": "#4b5563",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out",
        "slide-up": "slideUp 0.8s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(30px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(50px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};