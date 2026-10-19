import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
  base: 'https://github.com/Mayte5033508/lunchmap-app.git', // <-- Coloca aquí el nombre exacto de tu repositorio de GitHub entre barras
});