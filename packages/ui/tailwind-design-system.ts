import typography from '@tailwindcss/typography'
import tailwindcssAnimate from 'tailwindcss-animate'
import type { PluginAPI, Config as TailwindConfig } from 'tailwindcss/types/config'

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx,css}'],
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
        sans: ['Inter', 'sans-serif'],
        code: ['JetBrains Mono', 'monospace']
      },
      colors: {
        // border: 'oklch(var(--canary-border))',
        borders: {
          1: 'var(--canary-border-1)',
          2: 'var(--canary-border-2)',
          3: 'var(--canary-border-3)',
          // remove
          4: 'var(--canary-border-3)',
          5: 'var(--canary-border-3)',
          6: 'var(--canary-border-3)',
          7: 'var(--canary-border-3)',
          8: 'var(--canary-border-3)',
          9: 'var(--canary-border-3)',
          10: 'var(--canary-border-10)',
          danger: 'var(--canary-border-danger)',
          success: 'var(--canary-border-success)',
          accent: 'var(--canary-border-accent)',
          risk: 'var(--canary-icon-risk)',
          alert: 'var(--canary-border-alert)'
        },
        'border-background': 'oklch(var(--canary-border-background))',
        input: 'oklch(var(--canary-input))',
        'input-background': 'oklch(var(--canary-input-background))',
        ring: 'oklch(var(--canary-ring))',
        primary: {
          DEFAULT: '#f00',
          background: 'oklch(var(--canary-background-1))',
          foreground: 'oklch(var(--canary-text-1))',
          muted: 'oklch(var(--canary-state-disabled-background))',
          accent: 'oklch(var(--canary-primary-accent))'
        },
        secondary: {
          DEFAULT: 'oklch(var(--canary-secondary))',
          background: 'oklch(var(--canary-secondary-background))',
          foreground: 'oklch(var(--canary-secondary-foreground))',
          muted: 'oklch(var(--canary-secondary-muted))'
        },
        tertiary: {
          DEFAULT: 'oklch(var(--canary-tertiary))',
          foreground: 'oklch(var(--canary-tertiary-foreground))',
          background: 'oklch(var(--canary-tertiary-background))',
          muted: 'oklch(var(--canary-tertiary-muted))'
        },
        destructive: {
          DEFAULT: 'oklch(var(--canary-destructive))',
          foreground: 'oklch(var(--canary-destructive-foreground))'
        },
        muted: {
          DEFAULT: 'oklch(var(--canary-muted))',
          foreground: 'oklch(var(--canary-muted-foreground))'
        },
        accent: {
          DEFAULT: 'oklch(var(--canary-accent))',
          foreground: 'oklch(var(--canary-accent-foreground))'
        },
        popover: {
          DEFAULT: 'oklch(var(--canary-popover))',
          foreground: 'oklch(var(--canary-popover-foreground))'
        },
        card: {
          DEFAULT: 'oklch(var(--canary-card))',
          foreground: 'oklch(var(--canary-card-foreground))'
        },
        white: {
          DEFAULT: 'oklch(var(--canary-white))'
        },
        black: {
          DEFAULT: 'oklch(var(--canary-black))'
        },
        success: {
          DEFAULT: 'oklch(var(--canary-success))'
        },
        error: {
          DEFAULT: 'oklch(var(--canary-error))'
        },
        warning: {
          DEFAULT: 'oklch(var(--canary-warning))'
        },
        emphasis: {
          DEFAULT: 'oklch(var(--canary-emphasis))'
        },
        ai: {
          DEFAULT: 'oklch(var(--canary-ai))'
        },
        divergence: {
          behind: 'oklch(var(--canary-grey-20))',
          ahead: 'oklch(var(--canary-grey-30))'
        },
        /* New colors design variables */
        foreground: {
          1: 'var(--canary-text-1)',
          2: 'var(--canary-text-2)',
          4: 'var(--canary-text-3)',
          5: 'var(--canary-text-3)',
          8: 'var(--canary-text-3)',
          accent: 'var(--canary-text-3)'
        },
        background: {
          1: 'var(--canary-background-1)',
          surface: 'var(--canary-background-1)',
          9: 'var(--canary-background-3)'
        }
      },

      letterSpacing: {
        tight: '-0.02em'
      },
      //   boxShadow: {
      //     1: '0px 8px 16px hsl(var(--canary-box-shadow-1))',
      //     2: '0px 8px 8px hsl(var(--canary-box-shadow-2))',
      //     'pagination-1': '0px 2px 4px hsl(var(--canary-box-shadow-pagination))',
      //     'as-border': 'inset 0 0 0 1px',
      //     'commit-list-bullet':
      //       '0px 0px 3px 0.5px hsla(var(--canary-background-05) / 0.2), 0px 0px 8px 1px hsla(var(--canary-background-05) / 0.3)'
      //   },
      //   borderColor: {
      //     'borders-1': 'hsl(var(--canary-border-01))',
      //     'borders-2': 'hsl(var(--canary-border-02))',
      //     'borders-3': 'hsl(var(--canary-border-03))',
      //     'borders-4': 'hsl(var(--canary-border-04))',
      //     'borders-5': 'hsl(var(--canary-border-05))',
      //     'borders-6': 'hsl(var(--canary-border-06))',
      //     'borders-7': 'hsl(var(--canary-border-07))',
      //     'borders-8': 'hsl(var(--canary-border-08))',
      //     'borders-9': 'hsl(var(--canary-border-09))',
      //     'borders-10': 'hsl(var(--canary-border-10))',
      //     'borders-danger': 'hsl(var(--canary-border-danger))',
      //     'borders-success': 'hsl(var(--canary-border-success))',
      //     'borders-accent': 'hsl(var(--canary-border-accent))',
      //     'borders-risk': 'hsl(var(--canary-icon-risk))',
      //     'borders-alert': 'hsl(var(--canary-border-alert))'
      //   },
      borderRadius: {
        10: '0.625rem'
      },
      fontSize: {
        tiny: '0.75rem',
        xs: '0.8125rem',
        // By px
        8: '0.5rem',
        9: '0.5625rem',
        10: '0.625rem',
        11: '0.6875rem',
        12: '0.75rem',
        13: '0.8125rem',
        14: '0.875rem',
        15: '0.9375rem',
        16: '1rem',
        17: '1.0625rem',
        18: '1.125rem',
        19: '1.1875rem',
        20: '1.25rem',
        24: '1.5rem'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--canary-tw-gradient-stops))',
        'ai-button':
          'linear-gradient(to right, hsl(var(--canary-ai-button-stop-1)), hsl(var(--canary-ai-button-stop-2)), hsl(var(--canary-ai-button-stop-3)), hsl(var(--canary-ai-button-stop-4)))',
        'navbar-gradient-1':
          'radial-gradient(50% 50% at 50% 50%, hsla(var(--canary-nav-gradient-1-1)) 0%, hsla(var(--canary-nav-gradient-1-2)) 100%)',
        'navbar-gradient-2':
          'radial-gradient(50% 50% at 50% 50%, hsla(var(--canary-nav-gradient-2-1)) 0%, hsla(var(--canary-nav-gradient-2-2)) 44.95%, hsla(var(--canary-nav-gradient-2-3)) 100%)',
        'navbar-gradient-3':
          'radial-gradient(50% 50% at 50% 50%, hsla(var(--canary-nav-gradient-3-1)) 0%, hsla(var(--canary-nav-gradient-3-2)) 100%)',
        'navbar-gradient-4':
          'radial-gradient(50% 50% at 50% 50%, hsla(var(--canary-nav-gradient-4-1)) 0%, hsla(var(--canary-nav-gradient-4-2)) 100%)',
        'navbar-item-gradient':
          'radial-gradient(50% 50% at 50% 50%, hsla(var(--canary-nav-item-gradient-1)) 0%, hsla(var(--canary-nav-item-gradient-2)) 17.63%, hsla(var(--canary-nav-item-gradient-3)) 40.23%, hsla(var(--canary-nav-item-gradient-4)) 61.54%, hsla(var(--canary-nav-item-gradient-5)) 80%, hsla(var(--canary-nav-item-gradient-6)) 100%)',
        'widget-bg-gradient':
          'radial-gradient(80.82% 77.84% at 80.15% 11.99%, hsla(var(--canary-widget-bg-gradient-from)) 8.43%, hsla(var(--canary-widget-bg-gradient-to)) 100%)',
        'widget-number-gradient':
          'linear-gradient(180deg, hsla(var(--canary-widget-number-gradient-from)) 35.9%, hsla(var(--canary-widget-number-gradient-to)) 100%)',
        'widget-number-bg-gradient':
          'linear-gradient(135deg, hsla(var(--canary-widget-number-bg-gradient-from)) 0%, hsla(var(--canary-widget-number-bg-gradient-to)) 67.67%)',
        'graph-gradient-1':
          'radial-gradient(88.57% 100% at 14.29% 0%, var(--canary-graph-gradient-bg-1) 10.62%, var(--canary-graph-gradient-bg-2) 75.86%)',
        'graph-bg-gradient': 'radial-gradient(circle, var(--canary-graph-viewport-bg) 1px, transparent 1px)'
      },
      backgroundSize: {
        'graph-bg-size': '22px 22px'
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
        'border-spin': {
          '100%': { transform: 'rotate(-360deg)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',

        'border-spin': 'border-spin 7s linear infinite'
      }
    }
  },
  plugins: [
    tailwindcssAnimate,
    typography,
    function ({ addUtilities }: PluginAPI) {
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
  ],
  safelist: [
    'prose',
    'prose-invert',
    'prose-headings',
    'prose-p',
    'prose-a',
    'prose-img',
    'prose-code',
    { pattern: /^border-borders-/ },
    { pattern: /^bg-graph-/ },
    { pattern: /^text-foreground-/ },
    { pattern: /^bg-background-/ },
    // NOTE: stroke-border-2 temporary here as it is used by in gitness for pipeline-graph
    'stroke-borders-2',
    // NOTE: temporary - used in design-system
    { pattern: /bg-primary-./ }
  ]
} satisfies TailwindConfig
