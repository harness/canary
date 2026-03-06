import type { Config as TailwindConfig } from 'tailwindcss/types/config'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        'cn-background': {
          1: 'var(--cn-bg-1, #ffffff)',
          2: 'var(--cn-bg-2, #f9fafb)',
          3: 'var(--cn-bg-3, #f3f4f6)'
        },
        'cn-foreground': {
          1: 'var(--cn-text-1, #111827)',
          2: 'var(--cn-text-2, #374151)',
          3: 'var(--cn-text-3, #6b7280)',
          4: 'var(--cn-text-4, #9ca3af)'
        },
        'cn-borders': {
          3: 'var(--cn-border-3, #e5e7eb)'
        }
      }
    }
  },
  plugins: []
} satisfies TailwindConfig
