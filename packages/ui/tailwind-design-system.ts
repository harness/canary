import typography from '@tailwindcss/typography'
import tailwindcssAnimate from 'tailwindcss-animate'
import plugin from 'tailwindcss/plugin'
import type { PluginAPI, Config as TailwindConfig } from 'tailwindcss/types/config'

import { ComponentStyles } from './tailwind-utils-config/components'
import {
  borders as borderStyles,
  padding as paddingStyles,
  typography as typographyStyles
} from './tailwind-utils-config/utilities'

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
    backgroundColor: {
      DEFAULT: 'lch(from var(--cn-bg-1) l c h / <alpha-value>)',

      // Separator bg colors
      'cn-separator-subtle': 'var(--cn-border-3)',
      'cn-separator': 'var(--cn-border-2)',

      // Design system primary colors
      // Remove opacity from the colors
      'cn-0': 'lch(from var(--cn-bg-0) l c h / <alpha-value>)',
      'cn-1': 'lch(from var(--cn-bg-1) l c h / <alpha-value>)',
      'cn-2': 'lch(from var(--cn-bg-2) l c h / <alpha-value>)',
      'cn-3': 'lch(from var(--cn-bg-3) l c h / <alpha-value>)',

      // Brand colors
      'cn-brand': {
        primary: 'lch(from var(--cn-set-brand-primary-bg) l c h / <alpha-value>)',
        'primary-hover': 'lch(from var(--cn-set-brand-primary-bg-hover) l c h / <alpha-value>)',
        'primary-selected': 'lch(from var(--cn-set-brand-primary-bg-selected) l c h / <alpha-value>)',
        secondary: 'lch(from var(--cn-set-brand-secondary-bg) l c h / <alpha-value>)',
        'secondary-hover': 'lch(from var(--cn-set-brand-secondary-bg-hover) l c h / <alpha-value>)',
        'secondary-selected': 'lch(from var(--cn-set-brand-secondary-bg-selected) l c h / <alpha-value>)',
        outline: 'lch(from var(--cn-set-brand-outline-bg) l c h / <alpha-value>)',
        'outline-hover': 'lch(from var(--cn-set-brand-outline-bg-hover) l c h / <alpha-value>)',
        'outline-selected': 'lch(from var(--cn-set-brand-outline-bg-selected) l c h / <alpha-value>)'
      },

      'cn-input': 'var(--cn-comp-input-bg)',

      // States
      'cn-hover': 'var(--cn-state-hover)',
      'cn-selected': 'var(--cn-state-selected)',

      // component related
      'cn-backdrop': 'var(--cn-comp-dialog-backdrop)',
      'cn-diff-success': 'var(--cn-comp-diff-add-content)',
      'cn-diff-danger': 'var(--cn-comp-diff-del-content)',

      /**
       * These colors should be used along with their text pairs
       *
       * Example:
       * ✅ .text-cn-success-primary + .bg-cn-success-primary
       * ✅ .text-cn-success-secondary + .bg-cn-success-secondary
       * ✅ .text-cn-success-outline + .bg-cn-success-outline + .border-cn-success-outline
       *
       * ❌ .text-cn-success-primary + .bg-cn-success-secondary
       * ❌ .text-cn-success-primary + .bg-cn-success-outline
       */
      'cn-success': {
        primary: 'var(--cn-set-success-primary-bg)',
        secondary: 'var(--cn-set-success-secondary-bg)',
        outline: 'var(--cn-set-success-outline-bg)'
      },
      'cn-gray': {
        primary: 'var(--cn-set-gray-primary-bg)',
        secondary: 'lch(from var(--cn-set-gray-secondary-bg) l c h / <alpha-value>)',
        outline: 'var(--cn-set-gray-outline-bg)'
      },
      'cn-danger': {
        primary: 'var(--cn-set-danger-primary-bg)',
        secondary: 'var(--cn-set-danger-secondary-bg)',
        outline: 'var(--cn-set-danger-outline-bg)'
      },
      'cn-warning': {
        primary: 'var(--cn-set-warning-primary-bg)',
        secondary: 'var(--cn-set-warning-secondary-bg)',
        outline: 'var(--cn-set-warning-outline-bg)'
      },
      'cn-blue': {
        primary: 'var(--cn-set-blue-primary-bg)',
        secondary: 'var(--cn-set-blue-secondary-bg)',
        outline: 'var(--cn-set-blue-outline-bg)'
      },
      'cn-purple': {
        primary: 'var(--cn-set-purple-primary-bg)',
        secondary: 'var(--cn-set-purple-secondary-bg)',
        outline: 'var(--cn-set-purple-outline-bg)'
      },
      'cn-brown': {
        primary: 'var(--cn-set-brown-primary-bg)',
        secondary: 'var(--cn-set-brown-secondary-bg)',
        outline: 'var(--cn-set-brown-outline-bg)'
      },
      'cn-cyan': {
        primary: 'var(--cn-set-cyan-primary-bg)',
        secondary: 'var(--cn-set-cyan-secondary-bg)',
        outline: 'var(--cn-set-cyan-outline-bg)'
      },
      'cn-indigo': {
        primary: 'var(--cn-set-indigo-primary-bg)',
        secondary: 'var(--cn-set-indigo-secondary-bg)',
        outline: 'var(--cn-set-indigo-outline-bg)'
      },
      'cn-lime': {
        primary: 'var(--cn-set-lime-primary-bg)',
        secondary: 'var(--cn-set-lime-secondary-bg)',
        outline: 'var(--cn-set-lime-outline-bg)'
      },
      'cn-mint': {
        primary: 'var(--cn-set-mint-primary-bg)',
        secondary: 'var(--cn-set-mint-secondary-bg)',
        outline: 'var(--cn-set-mint-outline-bg)'
      },
      'cn-orange': {
        primary: 'var(--cn-set-orange-primary-bg)',
        secondary: 'var(--cn-set-orange-secondary-bg)',
        outline: 'var(--cn-set-orange-outline-bg)'
      },
      'cn-pink': {
        primary: 'var(--cn-set-pink-primary-bg)',
        secondary: 'var(--cn-set-pink-secondary-bg)',
        outline: 'var(--cn-set-pink-outline-bg)'
      },
      'cn-violet': {
        primary: 'var(--cn-set-violet-primary-bg)',
        secondary: 'var(--cn-set-violet-secondary-bg)',
        outline: 'var(--cn-set-violet-outline-bg)'
      },
      transparent: 'transparent',
      inherit: 'inherit',
      current: 'currentColor'
    },
    textColor: {
      DEFAULT: 'lch(from var(--cn-text-2) l c h / <alpha-value>)',
      // based on the lightness
      'cn-1': 'lch(from var(--cn-text-1) l c h / <alpha-value>)',
      'cn-2': 'lch(from var(--cn-text-2) l c h / <alpha-value>)',
      'cn-3': 'lch(from var(--cn-text-3) l c h / <alpha-value>)',

      // status
      'cn-merged': 'var(--cn-text-merged)',
      'cn-disabled': 'var(--cn-text-4)',

      // logo colors
      'cn-logo-icon': 'var(--cn-logo-icon)',
      'cn-logo-text': 'var(--cn-logo-text)',

      // brand text
      'cn-brand': 'var(--cn-text-brand)',
      'cn-brand-hover': 'var(--cn-comp-link-text-hover)',

      // use only for icons
      'cn-icon': {
        danger: 'var(--cn-set-danger-primary-bg)',
        warning: 'var(--cn-set-warning-primary-bg)',
        success: 'var(--cn-set-success-primary-bg)',
        info: 'var(--cn-set-blue-primary-bg)',
        merged: 'var(--cn-set-purple-primary-bg)'
      },

      /**
       * These colors should be used along with their bg pairs
       *
       * Example:
       * ✅ .text-cn-success-primary + .bg-cn-success-primary
       * ✅ .text-cn-success-secondary + .bg-cn-success-secondary
       * ✅ .text-cn-success-outline + .bg-cn-success-outline + .border-cn-success-outline
       *
       * ❌ .text-cn-success-primary + .bg-cn-success-secondary
       * ❌ .text-cn-success-primary + .bg-cn-success-outline
       */
      'cn-success': {
        DEFAULT: 'var(--cn-text-success)',
        primary: 'var(--cn-set-success-primary-text)',
        secondary: 'var(--cn-set-success-secondary-text)',
        outline: 'var(--cn-set-success-outline-text)'
      },
      'cn-gray': {
        primary: 'var(--cn-set-gray-primary-text)',
        secondary: 'var(--cn-set-gray-secondary-text)',
        outline: 'var(--cn-set-gray-outline-text)'
      },
      'cn-danger': {
        DEFAULT: 'var(--cn-text-danger)',
        primary: 'var(--cn-set-danger-primary-text)',
        secondary: 'var(--cn-set-danger-secondary-text)',
        outline: 'var(--cn-set-danger-outline-text)'
      },
      'cn-warning': {
        DEFAULT: 'var(--cn-text-warning)',
        primary: 'var(--cn-set-warning-primary-text)',
        secondary: 'var(--cn-set-warning-secondary-text)',
        outline: 'var(--cn-set-warning-outline-text)'
      },
      'cn-blue': {
        primary: 'var(--cn-set-blue-primary-text)',
        secondary: 'var(--cn-set-blue-secondary-text)',
        outline: 'var(--cn-set-blue-outline-text)'
      },
      'cn-purple': {
        primary: 'var(--cn-set-purple-primary-text)',
        secondary: 'var(--cn-set-purple-secondary-text)',
        outline: 'var(--cn-set-purple-outline-text)'
      },
      'cn-brown': {
        primary: 'var(--cn-set-brown-primary-text)',
        secondary: 'var(--cn-set-brown-secondary-text)',
        outline: 'var(--cn-set-brown-outline-text)'
      },
      'cn-cyan': {
        primary: 'var(--cn-set-cyan-primary-text)',
        secondary: 'var(--cn-set-cyan-secondary-text)',
        outline: 'var(--cn-set-cyan-outline-text)'
      },
      'cn-indigo': {
        primary: 'var(--cn-set-indigo-primary-text)',
        secondary: 'var(--cn-set-indigo-secondary-text)',
        outline: 'var(--cn-set-indigo-outline-text)'
      },
      'cn-lime': {
        primary: 'var(--cn-set-lime-primary-text)',
        secondary: 'var(--cn-set-lime-secondary-text)',
        outline: 'var(--cn-set-lime-outline-text)'
      },
      'cn-mint': {
        primary: 'var(--cn-set-mint-primary-text)',
        secondary: 'var(--cn-set-mint-secondary-text)',
        outline: 'var(--cn-set-mint-outline-text)'
      },
      'cn-orange': {
        primary: 'var(--cn-set-orange-primary-text)',
        secondary: 'var(--cn-set-orange-secondary-text)',
        outline: 'var(--cn-set-orange-outline-text)'
      },
      'cn-pink': {
        primary: 'var(--cn-set-pink-primary-text)',
        secondary: 'var(--cn-set-pink-secondary-text)',
        outline: 'var(--cn-set-pink-outline-text)'
      },
      'cn-violet': {
        primary: 'var(--cn-set-violet-primary-text)',
        secondary: 'var(--cn-set-violet-secondary-text)',
        outline: 'var(--cn-set-violet-outline-text)'
      },
      transparent: 'transparent',
      inherit: 'inherit',
      current: 'currentColor'
    },
    borderColor: {
      // Application default
      DEFAULT: 'var(--cn-border-3)',

      // theme borders
      'cn-1': 'lch(from var(--cn-border-1) l c h / <alpha-value>)',
      'cn-2': 'lch(from var(--cn-border-2) l c h / <alpha-value>)',
      'cn-3': 'lch(from var(--cn-border-3) l c h / <alpha-value>)',

      // State borders
      'cn-disabled': 'lch(from var(--cn-state-disabled-border) l c h / <alpha-value>)',

      // status borders
      'cn-brand': 'var(--cn-border-brand)',

      /**
       * These colors should be used along with their text and bg outline pairs
       *
       * Example:
       * ✅ .text-cn-success-outline + .bg-cn-success-outline + .border-cn-success-outline
       *
       * ❌ .text-cn-success-outline + .bg-cn-success-outline + .border-cn-danger-outline
       */
      'cn-success': {
        DEFAULT: 'var(--cn-border-success)',
        outline: 'var(--cn-set-success-outline-border)'
      },
      'cn-gray': {
        outline: 'var(--cn-set-gray-outline-border)'
      },
      'cn-danger': {
        DEFAULT: 'var(--cn-border-danger)',
        outline: 'var(--cn-set-danger-outline-border)'
      },
      'cn-warning': {
        DEFAULT: 'var(--cn-border-warning)',
        outline: 'var(--cn-set-warning-outline-border)'
      },
      'cn-blue': {
        outline: 'var(--cn-set-blue-outline-border)'
      },
      'cn-purple': {
        outline: 'var(--cn-set-purple-outline-border)'
      },
      'cn-brown': {
        outline: 'var(--cn-set-brown-outline-border)'
      },
      'cn-cyan': {
        outline: 'var(--cn-set-cyan-outline-border)'
      },
      'cn-indigo': {
        outline: 'var(--cn-set-indigo-outline-border)'
      },
      'cn-lime': {
        outline: 'var(--cn-set-lime-outline-border)'
      },
      'cn-mint': {
        outline: 'var(--cn-set-mint-outline-border)'
      },
      'cn-orange': {
        outline: 'var(--cn-set-orange-outline-border)'
      },
      'cn-pink': {
        outline: 'var(--cn-set-pink-outline-border)'
      },
      'cn-violet': {
        outline: 'var(--cn-set-violet-outline-border)'
      },
      transparent: 'transparent',
      inherit: 'inherit',
      current: 'currentColor'
    },
    borderRadius: {
      DEFAULT: 'var(--cn-rounded-2)',
      px: 'var(--cn-rounded-px)',
      1: 'var(--cn-rounded-1)',
      2: 'var(--cn-rounded-2)',
      3: 'var(--cn-rounded-3)',
      4: 'var(--cn-rounded-4)',
      5: 'var(--cn-rounded-5)',
      6: 'var(--cn-rounded-6)',
      7: 'var(--cn-rounded-7)',
      none: 'var(--cn-rounded-none)',
      full: 'var(--cn-rounded-full)',

      /**
       * Component specific borderRadius
       */
      'cn-input': 'var(--cn-input-radius)',
      inherit: 'inherit'
    },
    boxShadow: {
      none: 'var(--cn-shadow-0)',
      1: 'var(--cn-shadow-1)',
      2: 'var(--cn-shadow-2)',
      3: 'var(--cn-shadow-3)',
      4: 'var(--cn-shadow-4)',
      5: 'var(--cn-shadow-5)',
      6: 'var(--cn-shadow-6)',

      // Status ring colors
      'ring-error': 'var(--cn-ring-error)',
      'ring-selected': 'var(--cn-ring-selected)',
      'ring-success': 'var(--cn-ring-success)',
      'ring-warning': 'var(--cn-ring-warning)'
    },
    extend: {
      opacity: {
        'cn-disabled': 'var(--cn-disabled-opacity)'
      },
      size: {
        'cn-0': 'var(--cn-size-0)',
        'cn-1': 'var(--cn-size-1)',
        'cn-2': 'var(--cn-size-2)',
        'cn-3': 'var(--cn-size-3)',
        'cn-4': 'var(--cn-size-4)',
        'cn-5': 'var(--cn-size-5)',
        'cn-6': 'var(--cn-size-6)',
        'cn-7': 'var(--cn-size-7)',
        'cn-8': 'var(--cn-size-8)',
        'cn-9': 'var(--cn-size-9)',
        'cn-10': 'var(--cn-size-10)',
        'cn-11': 'var(--cn-size-11)',
        'cn-12': 'var(--cn-size-12)',
        'cn-14': 'var(--cn-size-14)',
        'cn-15': 'var(--cn-size-15)',
        'cn-16': 'var(--cn-size-16)',
        'cn-17': 'var(--cn-size-17)',
        'cn-20': 'var(--cn-size-20)',
        'cn-24': 'var(--cn-size-24)',
        'cn-25': 'var(--cn-size-25)',
        'cn-28': 'var(--cn-size-28)',
        'cn-32': 'var(--cn-size-32)',
        'cn-36': 'var(--cn-size-36)',
        'cn-40': 'var(--cn-size-40)',
        'cn-44': 'var(--cn-size-44)',
        'cn-48': 'var(--cn-size-48)',
        'cn-52': 'var(--cn-size-52)',
        'cn-56': 'var(--cn-size-56)',
        'cn-58': 'var(--cn-size-58)',
        'cn-60': 'var(--cn-size-60)',
        'cn-64': 'var(--cn-size-64)',
        'cn-72': 'var(--cn-size-72)',
        'cn-80': 'var(--cn-size-80)',
        'cn-90': 'var(--cn-size-90)',
        'cn-96': 'var(--cn-size-96)',
        'cn-5-half': 'var(--cn-size-5-half)',
        'cn-6-half': 'var(--cn-size-6-half)',
        'cn-11-half': 'var(--cn-size-11-half)',
        'cn-px': 'var(--cn-size-px)',
        'cn-half': 'var(--cn-size-half)',
        'cn-1-half': 'var(--cn-size-1-half)',
        'cn-2-half': 'var(--cn-size-2-half)',
        'cn-3-half': 'var(--cn-size-3-half)',
        'cn-4-half': 'var(--cn-size-4-half)'
      },
      height: {
        'cn-input-md': 'var(--cn-input-size-md)',
        'cn-header': 'var(--cn-header-height)'
      },
      minHeight: {
        'cn-textarea': '7lh'
      },
      maxHeight: {
        'cn-textarea': '35lh'
      },
      width: {
        // Get this from design system
        'cn-search-input-max-width': '320px'
      },

      outlineOffset: {
        'cn-tight': 'calc(var(--cn-size-px) * -2)'
      },
      ringColor: {
        'cn-brand': 'var(--cn-border-brand)'
      },
      spacing: {
        'cn-4xs': 'var(--cn-layout-4xs)',
        'cn-3xs': 'var(--cn-layout-3xs)',
        'cn-2xs': 'var(--cn-layout-2xs)',
        'cn-xs': 'var(--cn-layout-xs)',
        'cn-sm': 'var(--cn-layout-sm)',
        'cn-md': 'var(--cn-layout-md)',
        'cn-lg': 'var(--cn-layout-lg)',
        'cn-xl': 'var(--cn-layout-xl)',
        'cn-2xl': 'var(--cn-layout-2xl)',
        'cn-3xl': 'var(--cn-layout-3xl)',
        'cn-4xl': 'var(--cn-layout-4xl)'
      },

      colors: {
        // 👉 Remove this by checking with pipeline team
        graph: {
          background: {
            1: 'hsl(var(--canary-graph-background-1))',
            2: 'hsl(var(--canary-graph-background-2))',
            3: 'var(--canary-graph-background-3)',
            4: 'hsl(var(--canary-graph-background-4))'
          },
          border: {
            1: 'hsl(var(--canary-graph-border-1))'
          }
        }
      },
      letterSpacing: {
        tighter: 'var(--cn-tracking-tighter)',
        tight: 'var(--cn-tracking-tight)',
        normal: 'var(--cn-tracking-normal)',
        wide: 'var(--cn-tracking-wide)',
        wider: 'var(--cn-tracking-wider)',
        widest: 'var(--cn-tracking-widest)'
      },
      // Remove borderColor - removing the Default is causing border issues in dark mode

      fontSize: {
        0: 'var(--cn-font-size-0)',
        1: 'var(--cn-font-size-1)',
        2: 'var(--cn-font-size-2)',
        3: 'var(--cn-font-size-3)',
        4: 'var(--cn-font-size-4)',
        5: 'var(--cn-font-size-5)',
        6: 'var(--cn-font-size-6)',
        7: 'var(--cn-font-size-7)',
        8: 'var(--cn-font-size-8)',
        9: 'var(--cn-font-size-9)',
        10: 'var(--cn-font-size-10)',
        11: 'var(--cn-font-size-11)',
        12: 'var(--cn-font-size-12)',
        13: 'var(--cn-font-size-13)',
        half: 'var(--cn-font-size-half)',
        min: 'var(--cn-font-size-min)'
      },
      backgroundImage: {
        /**
         * 👉 Use proper variables from design system and remove it
         *
         * --cn-comp-pipeline-card-bg
         * --cn-comp-pipeline-card-border
         * --cn-comp-pipeline-card-running-border
         */
        'graph-gradient-1':
          'radial-gradient(88.57% 100% at 14.29% 0%, var(--cn-gradient-pipeline-card-bg-gradient-from) 10.62%, var(--cn-gradient-pipeline-card-bg-gradient-to) 75.86%)',
        'graph-bg-gradient': 'radial-gradient(circle, var(--cn-bg-1) 1px, transparent 1px)'
      },
      backgroundSize: {
        // 👉 Do we need this here? Check with pipeline team and if not needed, remove it.
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
    /**
     * Plugins has to be added in the order of dependency.
     *
     * Example: "badgeStyles" - Depends on "typographyStyles".
     * Hence "typographyStyles" has to be added before "badgeStyles".
     *
     */
    plugin(({ addUtilities }) => {
      addUtilities(paddingStyles)
      addUtilities(typographyStyles)
      addUtilities(borderStyles)
    }),
    plugin(({ addComponents }) => {
      addComponents(ComponentStyles)
    }),
    tailwindcssAnimate,
    typography,
    function ({ addComponents, theme, e }: PluginAPI) {
      const hoverClasses: Record<string, Record<string, string>> = {}

      const generateHoverClasses = (colors: Record<string, any> | undefined, prefix = '') => {
        if (!colors) return

        Object.keys(colors).forEach(key => {
          const value = colors[key]
          const classKey = prefix ? `${prefix}-${key}` : key

          if (typeof value === 'object' && !Array.isArray(value)) {
            generateHoverClasses(value, classKey)
            return
          }

          if (classKey.includes('foreground')) {
            hoverClasses[`.${e(`hover:text-${classKey}`)}:hover`] = {
              color: value
            }
          } else if (classKey.includes('background')) {
            hoverClasses[`.${e(`hover:bg-${classKey}`)}:hover`] = {
              backgroundColor: value
            }
          } else if (classKey.includes('border')) {
            hoverClasses[`.${e(`hover:border-${classKey}`)}:hover`] = {
              borderColor: value
            }
          } else if (classKey.includes('icon') || classKey.includes('icons')) {
            hoverClasses[`.${e(`hover:text-${classKey}`)}:hover`] = {
              color: value
            }
            hoverClasses[`.${e(`hover:bg-${classKey}`)}:hover`] = {
              backgroundColor: value
            }
          }
        })
      }

      const colors = theme('colors')
      generateHoverClasses(colors)

      addComponents(hoverClasses)
    }
  ],

  // 👉 Clean up all the safelist and remove old classes and add new values if needed.
  safelist: [
    'prose',
    'prose-invert',
    'prose-headings',
    'prose-p',
    'prose-a',
    'prose-img',
    'prose-code',
    /** New design system Variants  */

    { pattern: /^border-cn-/ },
    { pattern: /^text-cn-/ },
    { pattern: /^hover:text-cn-/ },
    { pattern: /^bg-cn-/ },
    { pattern: /^hover:bg-cn-/ },

    /** Existing Variants  */
    { pattern: /^bg-graph-/ },
    { pattern: /^hover:bg-graph-/ },

    { pattern: /rounded-./ },
    { pattern: /border-./ },
    // Important: used for generating max-width of SandboxLayout.Content
    { pattern: /max-w-./ },
    { pattern: /^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap(?:-[xy])?)-cn-.+$/ },

    { pattern: /^h-cn-/ },
    { pattern: /^w-cn-/ }
  ]
} satisfies TailwindConfig
