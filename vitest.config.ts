<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> jules-1751083910730374172-8e0c37a0
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
=======
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
>>>>>>> origin/feature/production-ready-refactor-15241725718241106546
=======
>>>>>>> jules-1751083910730374172-8e0c37a0
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
<<<<<<< HEAD
=======
    exclude: ['**/node_modules/**', '**/dist/**', '**/tests/**', '**/e2e/**'],
>>>>>>> jules-1751083910730374172-8e0c37a0
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
<<<<<<< HEAD
<<<<<<< HEAD
});
=======
});
>>>>>>> origin/feature/production-ready-refactor-15241725718241106546
=======
});
>>>>>>> jules-1751083910730374172-8e0c37a0
