import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./config/vitest-setup.ts'],
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html'],
      include: ['src'],
      exclude: ['src/index.ts', 'src/types/**', 'src/**/*.test.*'],
      extension: ['ts', 'tsx']
    },
    server: {
      deps: {
        // Inline react so @testing-library/react (React 17) resolves a single react instance.
        inline: [/react/]
      }
    }
  }
})
