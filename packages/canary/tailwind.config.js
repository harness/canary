import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
const config = {
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
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          background: 'hsl(var(--primary-background))',
          foreground: 'hsl(var(--primary-foreground))',
          muted: 'hsl(var(--primary-muted))'
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
        ai: {
          DEFAULT: 'hsl(var(--ai))'
        }
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
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        moveClockwise: {
          '0%': { transform: 'translate(var(--circle-start-x), var(--circle-start-y))' }, // Top-left corner
          '25%': { transform: 'translate(var(--circle-end-x), var(--circle-start-y))' }, // Top-right corner
          '50%': { transform: 'translate(var(--circle-end-x), var(--circle-end-y))' }, // Bottom-right corner
          '75%': { transform: 'translate(var(--circle-start-x), var(--circle-end-y))' }, // Bottom-left corner
          '100%': { transform: 'translate(var(--circle-start-x), var(--circle-start-y))' } // Back to Top-left corner
        },
        moveAntiClockwise: {
          '0%': { transform: 'translate(var(--circle-end-x), var(--circle-end-y))' }, // Bottom-right corner
          '25%': { transform: 'translate(var(--circle-start-x), var(--circle-end-y))' }, // Bottom-left corner
          '50%': { transform: 'translate(var(--circle-start-x), var(--circle-start-y))' }, // Top-left corner
          '75%': { transform: 'translate(var(--circle-end-x), var(--circle-start-y))' }, // Top-right corner
          '100%': { transform: 'translate(var(--circle-end-x), var(--circle-end-y))' } // Back to Bottom-right corner
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'clockwise-slow': 'moveClockwise 60s ease-in-out infinite',
        'anticlockwise-slow': 'moveAntiClockwise 60s ease-in-out infinite'
      }
    }
  },
  plugins: [
    tailwindcssAnimate,
    ({ addUtilities }) => {
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

export default config
