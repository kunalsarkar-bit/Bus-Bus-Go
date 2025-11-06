import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: false, // disables source map generation
  },
  server: {
    port: 3000, // Set the port to 3000
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Your backend server URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
  alias: {
    "@": path.resolve(__dirname, "src"),
  },
});
