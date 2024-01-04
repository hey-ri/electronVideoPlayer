import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.ELECTRON == 'true' ? './' : '',
  build: {
    watch: process.env.IS_DEV ? { include: 'src/**' } : undefined,
  },
  server: { port: 8000 },
});
