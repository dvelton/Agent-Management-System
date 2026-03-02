import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  base: '/Agent-Management-System/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
});
