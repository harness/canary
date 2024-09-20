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
        border: 'hsl(var(--canary-border))',
        'border-background': 'hsl(var(--canary-border-background))',
        input: 'hsl(var(--canary-input))',
        'input-background': 'hsl(var(--canary-input-background))',
        ring: 'hsl(var(--canary-ring))',
        background: 'hsl(var(--canary-background))',
        foreground: 'hsl(var(--canary-foreground))',
        primary: {
          DEFAULT: 'hsl(var(--canary-primary))',
          background: 'hsl(var(--canary-primary-background))',
          foreground: 'hsl(var(--canary-primary-foreground))',
          muted: 'hsl(var(--canary-primary-muted))',
          accent: 'hsl(var(--canary-primary-accent))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--canary-secondary))',
          background: 'hsl(var(--canary-secondary-background))',
          foreground: 'hsl(var(--canary-secondary-foreground))',
          muted: 'hsl(var(--canary-secondary-muted))'
        },
        tertiary: {
          DEFAULT: 'hsl(var(--canary-tertiary))',
          foreground: 'hsl(var(--canary-tertiary-foreground))',
          background: 'hsl(var(--canary-tertiary-background))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--canary-destructive))',
          foreground: 'hsl(var(--canary-destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--canary-muted))',
          foreground: 'hsl(var(--canary-muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--canary-accent))',
          foreground: 'hsl(var(--canary-accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--canary-popover))',
          foreground: 'hsl(var(--canary-popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--canary-card))',
          foreground: 'hsl(var(--canary-card-foreground))'
        },
        white: {
          DEFAULT: 'hsl(var(--canary-white))'
        },
        black: {
          DEFAULT: 'hsl(var(--canary-black))'
        },
        success: {
          DEFAULT: 'hsl(var(--canary-success))'
        },
        error: {
          DEFAULT: 'hsl(var(--canary-error))'
        },
        warning: {
          DEFAULT: 'hsl(var(--canary-warning))'
        },
        ai: {
          DEFAULT: 'hsl(var(--canary-ai))'
        }
      },
      borderRadius: {
        DEFAULT: 'var(--canary-radius)'
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
            'inset 0 1px 0 0 hsl(var(--canary-border-background)), inset 1px 0 0 0 hsl(var(--canary-border-background)), inset -1px 0 0 0 hsl(var(--canary-border-background))'
        },
        '.tabnav-inactive': {
          boxShadow: 'inset 0 -1px 0 0 hsl(var(--canary-border-background))'
        }
      })
    }
  ]
}
