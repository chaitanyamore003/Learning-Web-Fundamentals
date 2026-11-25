import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // ... your other proxy rules (e.g., for /api)
      "/socket.io": {
        target: "http://localhost:5000", // <-- Your backend server URL
        changeOrigin: true,
        secure: false,
        ws: true, // <-- CRITICAL for WebSocket support
      },
    },
  },
});
