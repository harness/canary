import tailwindcssAnimate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      colors: {
        border: 'hsl(var(--border))',
        'border-background': 'hsl(var(--border-background))',
        input: 'hsl(var(--input))',
        'input-background': 'hsl(var(--input-background))',
        ring: 'hsl(var(--ring))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          background: 'hsl(var(--primary-background))',
          foreground: 'hsl(var(--primary-foreground))',
          muted: 'hsl(var(--primary-muted))',
          accent: 'hsl(var(--primary-accent))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          background: 'hsl(var(--secondary-background))',
          foreground: 'hsl(var(--secondary-foreground))',
          muted: 'hsl(var(--secondary-muted))'
        },
        tertiary: {
          DEFAULT: 'hsl(var(--tertiary))',
          foreground: 'hsl(var(--tertiary-foreground))',
          background: 'hsl(var(--tertiary-background))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        white: {
          DEFAULT: 'hsl(var(--white))'
        },
        black: {
          DEFAULT: 'hsl(var(--black))'
        },
        success: {
          DEFAULT: 'hsl(var(--success))'
        },
        error: {
          DEFAULT: 'hsl(var(--error))'
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))'
        },
        emphasis: {
          DEFAULT: 'hsl(var(--emphasis))'
        },
        ai: {
          DEFAULT: 'hsl(var(--ai))'
        },
        divergence: {
          behind: 'hsl(var(--grey-20))',
          ahead: 'hsl(var(--grey-30))'
        },
        /* New colors design variables */
        foreground: {
          // TODO: remove DEFAULT, cause use old color var
          DEFAULT: 'hsl(var(--foreground))',
          1: 'hsl(var(--foreground-01))',
          2: 'hsl(var(--foreground-02))',
          3: 'hsl(var(--foreground-03))',
          4: 'hsl(var(--foreground-04))',
          5: 'hsl(var(--foreground-05))',
          6: 'hsl(var(--foreground-06))',
          7: 'hsl(var(--foreground-07))',
          8: 'hsl(var(--foreground-08))',
          9: 'hsl(var(--foreground-09))',
          danger: 'hsl(var(--foreground-danger))',
          alert: 'hsl(var(--foreground-alert))',
          success: 'hsl(var(--foreground-success))',
          accent: 'hsl(var(--foreground-accent))'
        },
        background: {
          // TODO: remove DEFAULT, cause use old color var
          DEFAULT: 'hsl(var(--background))',
          1: 'hsl(var(--background-01))',
          2: 'hsl(var(--background-02))',
          3: 'hsl(var(--background-03))',
          4: 'hsla(var(--background-04))',
          5: 'hsl(var(--background-05))',
          6: 'hsl(var(--background-06))',
          7: 'hsl(var(--background-07))',
          8: 'hsl(var(--background-08))',
          9: 'hsl(var(--background-09))',
          10: 'hsl(var(--background-10))',
          danger: 'hsla(var(--background-danger))',
          success: 'hsla(var(--background-success))'
        },
        borders: {
          1: 'hsl(var(--border-01))',
          2: 'hsl(var(--border-02))',
          3: 'hsl(var(--border-03))',
          4: 'hsl(var(--border-04))',
          5: 'hsl(var(--border-05))',
          6: 'hsl(var(--border-06))',
          7: 'hsl(var(--border-07))',
          8: 'hsl(var(--border-08))',
          9: 'hsl(var(--border-09))',
          10: 'hsl(var(--border-10))',
          danger: 'hsl(var(--border-danger))',
          success: 'hsl(var(--border-success))'
        },
        icons: {
          1: 'hsl(var(--icon-01))',
          2: 'hsl(var(--icon-02))',
          3: 'hsl(var(--icon-03))',
          4: 'hsl(var(--icon-04))',
          5: 'hsl(var(--icon-05))',
          6: 'hsl(var(--icon-06))',
          7: 'hsl(var(--icon-07))',
          8: 'hsl(var(--icon-08))',
          9: 'hsl(var(--icon-09))',
          10: 'hsl(var(--icon-10))',
          danger: 'hsl(var(--icon-danger))',
          alert: 'hsl(var(--icon-alert))',
          success: 'hsl(var(--icon-success))',
          accent: 'hsl(var(--icon-accent))'
        }
      },
      letterSpacing: {
        tight: '-0.02em'
      },
      boxShadow: {
        1: '0px 8px 16px rgba(0, 0, 0, 0.30)',
        2: '0px 8px 8px rgba(0, 0, 0, 0.60)',
        'pagination-1': '0px 2px 4px rgba(0, 0, 0, 0.50)'
      },
      borderRadius: {
        DEFAULT: 'var(--radius)'
      },
      border: {
        DEFAULT: '1px'
      },
      fontSize: {
        tiny: '12px',
        xs: '13px'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'ai-button':
          'linear-gradient(to right, hsl(var(--ai-button-stop-1)), hsl(var(--ai-button-stop-2)), hsl(var(--ai-button-stop-3)), hsl(var(--ai-button-stop-4)))'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [
    tailwindcssAnimate,
    function ({ addUtilities }) {
      addUtilities({
        '.tabnav-active': {
          boxShadow:
            'inset 0 1px 0 0 hsl(var(--border-background)), inset 1px 0 0 0 hsl(var(--border-background)), inset -1px 0 0 0 hsl(var(--border-background))'
        },
        '.tabnav-inactive': {
          boxShadow: 'inset 0 -1px 0 0 hsl(var(--border-background))'
        }
      })
    }
  ]
}
