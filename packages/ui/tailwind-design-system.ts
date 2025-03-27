import typography from '@tailwindcss/typography'
import tailwindcssAnimate from 'tailwindcss-animate'
import plugin from 'tailwindcss/plugin'
import type { PluginAPI, Config as TailwindConfig } from 'tailwindcss/types/config'

import { badgeStyles, dialogStyles } from './tailwind-utils-config/components'
// import badgeVariantsPlugin from './tailwind-utils-config/components/badge-variants'
import { typography as typographyStyles } from './tailwind-utils-config/utilities'

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

      // Default border color
      borderColor: {
        DEFAULT: 'var(--cn-border-3)'
      },
      colors: {
        // TODO: Update
        border: 'var(--cn-border-1)',
        borders: {
          1: 'var(--cn-border-1)',
          2: 'var(--cn-border-2)',
          3: 'var(--cn-border-3)',
          // remove
          // update to focus, disabled, success, danger, warning
          danger: 'var(--cn-border-danger)',
          success: 'var(--cn-border-success)',
          accent: 'var(--cn-border-accent)',
          risk: 'var(--cn-icon-risk)',
          alert: 'var(--cn-border-alert)'
        },
        'border-background': 'var(--cn-border-background)',
        input: 'var(--cn-input)',
        'input-background': 'var(--cn-input-background)',
        ring: 'var(--cn-ring)',
        primary: {
          DEFAULT: 'lch(from var(--cn-text-2) l c h / <alpha-value>)',
          background: 'var(--cn-background-1)',
          foreground: 'var(--cn-text-1)',
          muted: 'var(--cn-state-disabled-background)',
          accent: 'var(--cn-primary-accent)'
        },
        secondary: {
          DEFAULT: 'var(--cn-secondary)',
          background: 'var(--cn-secondary-background)',
          foreground: 'var(--cn-secondary-foreground)',
          muted: 'var(--cn-secondary-muted)'
        },
        tertiary: {
          DEFAULT: 'var(--cn-tertiary)',
          foreground: 'var(--cn-tertiary-foreground)',
          background: 'var(--cn-tertiary-background)',
          muted: 'var(--cn-tertiary-muted)'
        },
        destructive: {
          DEFAULT: 'var(--cn-destructive)',
          foreground: 'var(--cn-destructive-foreground)'
        },
        muted: {
          DEFAULT: 'var(--cn-muted)',
          foreground: 'var(--cn-muted-foreground)'
        },
        accent: {
          DEFAULT: 'var(--cn-accent)',
          foreground: 'var(--cn-accent-foreground)'
        },
        popover: {
          DEFAULT: 'var(--cn-popover)',
          foreground: 'var(--cn-popover-foreground)'
        },
        card: {
          DEFAULT: 'var(--cn-card)',
          foreground: 'var(--cn-card-foreground)'
        },
        white: 'var(--cn-colors-pure-white)',
        black: {
          DEFAULT: 'var(--cn-black)'
        },
        success: {
          DEFAULT: 'var(--cn-success)'
        },
        error: {
          DEFAULT: 'var(--cn-error)'
        },
        warning: {
          DEFAULT: 'var(--cn-warning)'
        },
        emphasis: {
          DEFAULT: 'var(--cn-emphasis)'
        },
        ai: {
          DEFAULT: 'var(--cn-ai)'
        },
        divergence: {
          behind: 'var(--cn-grey-20)',
          ahead: 'var(--cn-grey-30)'
        },
        /* New colors design variables */
        foreground: {
          1: 'var(--cn-text-1)',
          2: 'var(--cn-text-2)',
          3: 'var(--cn-text-3)',

          // Remove
          4: 'var(--cn-text-3)',
          5: 'var(--cn-text-3)',
          8: 'var(--cn-text-3)',
          accent: 'var(--cn-text-3)',
          // DEFAULT - 1
          DEFAULT: 'var(--cn-text-1)'
        },
        background: {
          1: 'var(--cn-background-1)',
          2: 'var(--cn-background-2)',
          3: 'var(--cn-background-3)',

          // Remove
          // DEFAULT - 1
          DEFAULT: 'var(--cn-background-1)',
          // 4 - 2
          4: 'var(--cn-background-3)',
          // surface - 2
          surface: 'var(--cn-background-1)',
          // 9 - 2
          9: 'var(--cn-background-3)'
        }
      },

      letterSpacing: {
        tight: '-0.02em'
      },
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
        'gradient-radial': 'radial-gradient(var(--cn-tw-gradient-stops))',
        'ai-button':
          'linear-gradient(to right, hsl(var(--cn-ai-button-stop-1)), hsl(var(--cn-ai-button-stop-2)), hsl(var(--cn-ai-button-stop-3)), hsl(var(--cn-ai-button-stop-4)))',
        'navbar-gradient-1':
          'radial-gradient(50% 50% at 50% 50%, hsla(var(--cn-nav-gradient-1-1)) 0%, hsla(var(--cn-nav-gradient-1-2)) 100%)',
        'navbar-gradient-2':
          'radial-gradient(50% 50% at 50% 50%, hsla(var(--cn-nav-gradient-2-1)) 0%, hsla(var(--cn-nav-gradient-2-2)) 44.95%, hsla(var(--cn-nav-gradient-2-3)) 100%)',
        'navbar-gradient-3':
          'radial-gradient(50% 50% at 50% 50%, hsla(var(--cn-nav-gradient-3-1)) 0%, hsla(var(--cn-nav-gradient-3-2)) 100%)',
        'navbar-gradient-4':
          'radial-gradient(50% 50% at 50% 50%, hsla(var(--cn-nav-gradient-4-1)) 0%, hsla(var(--cn-nav-gradient-4-2)) 100%)',
        'navbar-item-gradient':
          'radial-gradient(50% 50% at 50% 50%, hsla(var(--cn-nav-item-gradient-1)) 0%, hsla(var(--cn-nav-item-gradient-2)) 17.63%, hsla(var(--cn-nav-item-gradient-3)) 40.23%, hsla(var(--cn-nav-item-gradient-4)) 61.54%, hsla(var(--cn-nav-item-gradient-5)) 80%, hsla(var(--cn-nav-item-gradient-6)) 100%)',
        'widget-bg-gradient':
          'radial-gradient(80.82% 77.84% at 80.15% 11.99%, hsla(var(--cn-widget-bg-gradient-from)) 8.43%, hsla(var(--cn-widget-bg-gradient-to)) 100%)',
        'widget-number-gradient':
          'linear-gradient(180deg, hsla(var(--cn-widget-number-gradient-from)) 35.9%, hsla(var(--cn-widget-number-gradient-to)) 100%)',
        'widget-number-bg-gradient':
          'linear-gradient(135deg, hsla(var(--cn-widget-number-bg-gradient-from)) 0%, hsla(var(--cn-widget-number-bg-gradient-to)) 67.67%)',
        'graph-gradient-1':
          'radial-gradient(88.57% 100% at 14.29% 0%, var(--cn-graph-gradient-bg-1) 10.62%, var(--cn-graph-gradient-bg-2) 75.86%)',
        'graph-bg-gradient': 'radial-gradient(circle, var(--cn-graph-viewport-bg) 1px, transparent 1px)'
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
    plugin(({ addUtilities }) => {
      addUtilities(typographyStyles)
    }),
    plugin(({ addComponents }) => {
      addComponents(badgeStyles)
      addComponents(dialogStyles)
    }),
    // badgeVariantsPlugin,
    tailwindcssAnimate,
    typography,
    function ({ addUtilities }: PluginAPI) {
      addUtilities({
        '.tabnav-active': {
          boxShadow:
            'inset 0 1px 0 0 var(--cn-border-background), inset 1px 0 0 0 var(--cn-border-background), inset -1px 0 0 0 var(--cn-border-background)'
        },
        '.tabnav-inactive': {
          boxShadow: 'inset 0 -1px 0 0 var(--cn-border-background)'
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
    // Badge variants and themes
    'badge-solid',
    // 'badge-surface',
    // 'badge-soft',
    // 'badge-outline',
    // 'badge-success',
    // 'badge-destructive',
    // 'badge-info',
    // 'badge-warning',
    // 'badge-muted',
    { pattern: /^bg-graph-/ },
    { pattern: /^bg-background-/ },
    { pattern: /^text-foreground-/ },
    { pattern: /^border-borders-/ },
    { pattern: /^text-icons-/ },
    { pattern: /^bg-icons-/ },
    // button classes
    { pattern: /^bg-button-background-/ },
    { pattern: /^text-button-foreground-/ },
    { pattern: /^border-button-border-/ },
    // tags classes
    { pattern: /^bg-tag-background-/ },
    { pattern: /^text-tag-foreground-/ },
    { pattern: /^border-tag-border-/ },
    // label classes
    { pattern: /^bg-label-background-/ },
    { pattern: /^text-label-foreground-/ },
    // sidebar classes
    { pattern: /^bg-sidebar-background-/ },
    { pattern: /^text-sidebar-foreground-/ },
    { pattern: /^border-sidebar-border-/ },
    { pattern: /^text-sidebar-icon-/ },

    // Hover classes
    { pattern: /^hover:bg-graph-/ },
    { pattern: /^hover:bg-background-/ },
    { pattern: /^hover:text-foreground-/ },
    { pattern: /^hover:border-borders-/ },
    { pattern: /^hover:text-icons-/ },
    { pattern: /^hover:bg-icons-/ },
    // button classes
    { pattern: /^hover:bg-button-background-/ },
    { pattern: /^hover:text-button-foreground-/ },
    { pattern: /^hover:border-button-border-/ },
    // tags classes
    { pattern: /^hover:bg-tag-background-/ },
    { pattern: /^hover:text-tag-foreground-/ },
    { pattern: /^hover:border-tag-border-/ },
    // label classes
    { pattern: /^hover:bg-label-background-/ },
    { pattern: /^hover:text-label-foreground-/ },
    // sidebar classes
    { pattern: /^hover:bg-sidebar-background-/ },
    { pattern: /^hover:text-sidebar-foreground-/ },
    { pattern: /^hover:border-sidebar-border-/ },
    { pattern: /^hover:text-sidebar-icon-/ },
    // NOTE: stroke-border-2 temporary here as it is used by in gitness for pipeline-graph
    'stroke-borders-2',
    // NOTE: temporary - used in design-system
    { pattern: /bg-primary-./ }
  ]
} satisfies TailwindConfig
