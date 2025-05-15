import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // server: {
  //   port: 5173, // Cổng mặc định
  //   strictPort: false, // Cho phép Vite chọn cổng khác nếu 5173 bị chiếm
  // },
  plugins: [react()],
  server: { port: 5173 },
});
