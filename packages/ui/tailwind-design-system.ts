import typography from '@tailwindcss/typography'
import tailwindcssAnimate from 'tailwindcss-animate'
import plugin from 'tailwindcss/plugin'
import type { PluginAPI, Config as TailwindConfig } from 'tailwindcss/types/config'

import { ComponentStyles } from './tailwind-utils-config/components'
import { typography as typographyStyles } from './tailwind-utils-config/utilities'

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
      minHeight: {
        'cn-textarea': '7lh'
      },
      maxHeight: {
        'cn-textarea': '35lh'
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
          DEFAULT: 'lch(from var(--cn-set-brand-solid-bg) l c h / <alpha-value>)',
          hover: 'lch(from var(--cn-set-brand-solid-bg-hover) l c h / <alpha-value>)',
          selected: 'lch(from var(--cn-set-brand-solid-bg-selected) l c h / <alpha-value>)',
          surface: 'lch(from var(--cn-set-brand-surface-bg) l c h / <alpha-value>)'
        },

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
         * ✅ .text-cn-green-solid + .bg-cn-green-solid
         * ✅ .text-cn-green-soft + .bg-cn-green-soft
         * ✅ .text-cn-green-surface + .bg-cn-green-surface + .border-cn-green-surface
         *
         * ❌ .text-cn-green-solid + .bg-cn-green-soft
         * ❌ .text-cn-green-solid + .bg-cn-green-surface
         */
        'cn-green': {
          solid: 'var(--cn-set-green-solid-bg)',
          soft: 'var(--cn-set-green-soft-bg)',
          surface: 'var(--cn-set-green-surface-bg)'
        },
        'cn-gray': {
          solid: 'var(--cn-set-gray-solid-bg)',
          soft: 'lch(from var(--cn-set-gray-soft-bg) l c h / <alpha-value>)',
          surface: 'var(--cn-set-gray-surface-bg)'
        },
        'cn-red': {
          solid: 'var(--cn-set-red-solid-bg)',
          soft: 'var(--cn-set-red-soft-bg)',
          surface: 'var(--cn-set-red-surface-bg)'
        },
        'cn-yellow': {
          solid: 'var(--cn-set-yellow-solid-bg)',
          soft: 'var(--cn-set-yellow-soft-bg)',
          surface: 'var(--cn-set-yellow-surface-bg)'
        },
        'cn-blue': {
          solid: 'var(--cn-set-blue-solid-bg)',
          soft: 'var(--cn-set-blue-soft-bg)',
          surface: 'var(--cn-set-blue-surface-bg)'
        },
        'cn-purple': {
          solid: 'var(--cn-set-purple-solid-bg)',
          soft: 'var(--cn-set-purple-soft-bg)',
          surface: 'var(--cn-set-purple-surface-bg)'
        },
        'cn-brown': {
          solid: 'var(--cn-set-brown-solid-bg)',
          soft: 'var(--cn-set-brown-soft-bg)',
          surface: 'var(--cn-set-brown-surface-bg)'
        },
        'cn-cyan': {
          solid: 'var(--cn-set-cyan-solid-bg)',
          soft: 'var(--cn-set-cyan-soft-bg)',
          surface: 'var(--cn-set-cyan-surface-bg)'
        },
        'cn-indigo': {
          solid: 'var(--cn-set-indigo-solid-bg)',
          soft: 'var(--cn-set-indigo-soft-bg)',
          surface: 'var(--cn-set-indigo-surface-bg)'
        },
        'cn-lime': {
          solid: 'var(--cn-set-lime-solid-bg)',
          soft: 'var(--cn-set-lime-soft-bg)',
          surface: 'var(--cn-set-lime-surface-bg)'
        },
        'cn-mint': {
          solid: 'var(--cn-set-mint-solid-bg)',
          soft: 'var(--cn-set-mint-soft-bg)',
          surface: 'var(--cn-set-mint-surface-bg)'
        },
        'cn-orange': {
          solid: 'var(--cn-set-orange-solid-bg)',
          soft: 'var(--cn-set-orange-soft-bg)',
          surface: 'var(--cn-set-orange-surface-bg)'
        },
        'cn-pink': {
          solid: 'var(--cn-set-pink-solid-bg)',
          soft: 'var(--cn-set-pink-soft-bg)',
          surface: 'var(--cn-set-pink-surface-bg)'
        },
        'cn-violet': {
          solid: 'var(--cn-set-violet-solid-bg)',
          soft: 'var(--cn-set-violet-soft-bg)',
          surface: 'var(--cn-set-violet-surface-bg)'
        }
      },
      textColor: {
        DEFAULT: 'lch(from var(--cn-text-2) l c h / <alpha-value>)',
        // based on the lightness
        'cn-1': 'lch(from var(--cn-text-1) l c h / <alpha-value>)',
        'cn-2': 'lch(from var(--cn-text-2) l c h / <alpha-value>)',
        'cn-3': 'lch(from var(--cn-text-3) l c h / <alpha-value>)',

        // status
        'cn-success': 'var(--cn-text-success)',
        'cn-danger': 'var(--cn-text-danger)',
        'cn-warning': 'var(--cn-text-warning)',
        'cn-merged': 'var(--cn-text-merged)',
        'cn-disabled': 'var(--cn-text-disabled)',

        // logo colors
        'cn-logo-icon': 'var(--cn-logo-icon)',
        'cn-logo-text': 'var(--cn-logo-text)',

        // brand text
        'cn-brand': 'var(--cn-text-brand)',
        'cn-brand-hover': 'var(--cn-comp-link-text-hover)',

        // use only for icons
        'cn-icon': {
          danger: 'var(--cn-set-red-solid-bg)',
          warning: 'var(--cn-set-yellow-solid-bg)',
          success: 'var(--cn-set-green-solid-bg)',
          info: 'var(--cn-set-blue-solid-bg)',
          merged: 'var(--cn-set-purple-solid-bg)'
        },

        /**
         * These colors should be used along with their bg pairs
         *
         * Example:
         * ✅ .text-cn-green-solid + .bg-cn-green-solid
         * ✅ .text-cn-green-soft + .bg-cn-green-soft
         * ✅ .text-cn-green-surface + .bg-cn-green-surface + .border-cn-green-surface
         *
         * ❌ .text-cn-green-solid + .bg-cn-green-soft
         * ❌ .text-cn-green-solid + .bg-cn-green-surface
         */
        'cn-green': {
          solid: 'var(--cn-set-green-solid-text)',
          soft: 'var(--cn-set-green-soft-text)',
          surface: 'var(--cn-set-green-surface-text)'
        },
        'cn-gray': {
          solid: 'var(--cn-set-gray-solid-text)',
          soft: 'var(--cn-set-gray-soft-text)',
          surface: 'var(--cn-set-gray-surface-text)'
        },
        'cn-red': {
          solid: 'var(--cn-set-red-solid-text)',
          soft: 'var(--cn-set-red-soft-text)',
          surface: 'var(--cn-set-red-surface-text)'
        },
        'cn-yellow': {
          solid: 'var(--cn-set-yellow-solid-text)',
          soft: 'var(--cn-set-yellow-soft-text)',
          surface: 'var(--cn-set-yellow-surface-text)'
        },
        'cn-blue': {
          solid: 'var(--cn-set-blue-solid-text)',
          soft: 'var(--cn-set-blue-soft-text)',
          surface: 'var(--cn-set-blue-surface-text)'
        },
        'cn-purple': {
          solid: 'var(--cn-set-purple-solid-text)',
          soft: 'var(--cn-set-purple-soft-text)',
          surface: 'var(--cn-set-purple-surface-text)'
        },
        'cn-brown': {
          solid: 'var(--cn-set-brown-solid-text)',
          soft: 'var(--cn-set-brown-soft-text)',
          surface: 'var(--cn-set-brown-surface-text)'
        },
        'cn-cyan': {
          solid: 'var(--cn-set-cyan-solid-text)',
          soft: 'var(--cn-set-cyan-soft-text)',
          surface: 'var(--cn-set-cyan-surface-text)'
        },
        'cn-indigo': {
          solid: 'var(--cn-set-indigo-solid-text)',
          soft: 'var(--cn-set-indigo-soft-text)',
          surface: 'var(--cn-set-indigo-surface-text)'
        },
        'cn-lime': {
          solid: 'var(--cn-set-lime-solid-text)',
          soft: 'var(--cn-set-lime-soft-text)',
          surface: 'var(--cn-set-lime-surface-text)'
        },
        'cn-mint': {
          solid: 'var(--cn-set-mint-solid-text)',
          soft: 'var(--cn-set-mint-soft-text)',
          surface: 'var(--cn-set-mint-surface-text)'
        },
        'cn-orange': {
          solid: 'var(--cn-set-orange-solid-text)',
          soft: 'var(--cn-set-orange-soft-text)',
          surface: 'var(--cn-set-orange-surface-text)'
        },
        'cn-pink': {
          solid: 'var(--cn-set-pink-solid-text)',
          soft: 'var(--cn-set-pink-soft-text)',
          surface: 'var(--cn-set-pink-surface-text)'
        },
        'cn-violet': {
          solid: 'var(--cn-set-violet-solid-text)',
          soft: 'var(--cn-set-violet-soft-text)',
          surface: 'var(--cn-set-violet-surface-text)'
        }
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
        'cn-warning': 'var(--cn-border-warning)',
        'cn-danger': 'var(--cn-border-danger)',
        'cn-success': 'var(--cn-border-success)',
        'cn-brand': 'var(--cn-border-brand)',

        /**
         * These colors should be used along with their text and bg surface pairs
         *
         * Example:
         * ✅ .text-cn-green-surface + .bg-cn-green-surface + .border-cn-green-surface
         *
         * ❌ .text-cn-green-surface + .bg-cn-green-surface + .border-cn-red-surface
         */
        'cn-green': {
          surface: 'var(--cn-set-green-surface-border)'
        },
        'cn-gray': {
          surface: 'var(--cn-set-gray-surface-border)'
        },
        'cn-red': {
          surface: 'var(--cn-set-red-surface-border)'
        },
        'cn-yellow': {
          surface: 'var(--cn-set-yellow-surface-border)'
        },
        'cn-blue': {
          surface: 'var(--cn-set-blue-surface-border)'
        },
        'cn-purple': {
          surface: 'var(--cn-set-purple-surface-border)'
        },
        'cn-brown': {
          surface: 'var(--cn-set-brown-surface-border)'
        },
        'cn-cyan': {
          surface: 'var(--cn-set-cyan-surface-border)'
        },
        'cn-indigo': {
          surface: 'var(--cn-set-indigo-surface-border)'
        },
        'cn-lime': {
          surface: 'var(--cn-set-lime-surface-border)'
        },
        'cn-mint': {
          surface: 'var(--cn-set-mint-surface-border)'
        },
        'cn-orange': {
          surface: 'var(--cn-set-orange-surface-border)'
        },
        'cn-pink': {
          surface: 'var(--cn-set-pink-surface-border)'
        },
        'cn-violet': {
          surface: 'var(--cn-set-violet-surface-border)'
        }
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
      boxShadow: {
        1: 'var(--cn-shadow-1)',
        2: 'var(--cn-shadow-2)',
        3: 'var(--cn-shadow-3)',
        4: 'var(--cn-shadow-4)',
        5: 'var(--cn-shadow-5)',
        6: 'var(--cn-shadow-6)',

        'comp-avatar-inner': 'var(--cn-shadow-comp-avatar-inner)',

        // Status ring colors
        'ring-error': 'var(--cn-ring-error)',
        'ring-selected': 'var(--cn-ring-selected)',
        'ring-success': 'var(--cn-ring-success)',
        'ring-warning': 'var(--cn-ring-warning)',

        // 👉 Check this and remove it
        'commit-list-bullet':
          '0px 0px 3px 0.5px hsla(var(--cn-set-brand-solid-bg) / 0.2), 0px 0px 8px 1px hsla(var(--cn-set-brand-solid-bg) / 0.3)'
      },
      // Remove borderColor - removing the Default is causing border issues in dark mode

      borderRadius: {
        px: 'var(--cn-rounded-px)',
        1: 'var(--cn-rounded-1)',
        2: 'var(--cn-rounded-2)',
        3: 'var(--cn-rounded-3)',
        4: 'var(--cn-rounded-4)',
        5: 'var(--cn-rounded-5)',
        6: 'var(--cn-rounded-6)',
        7: 'var(--cn-rounded-7)',
        none: 'var(--cn-rounded-none)',
        full: 'var(--cn-rounded-full)'
      },
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
      addUtilities(typographyStyles)
    }),
    plugin(({ addComponents }) => {
      addComponents(ComponentStyles)
    }),
    tailwindcssAnimate,
    typography,
    function ({ addUtilities }: PluginAPI) {
      addUtilities({})
    },
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

    // Hover classes
    { pattern: /^hover:bg-graph-/ },
    'stroke-borders-2',
    { pattern: /rounded-./ },
    { pattern: /border-./ },
    // Important: used for generating max-width of SandboxLayout.Content
    { pattern: /max-w-./ },
    { pattern: /^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap(?:-[xy])?)-cn-.+$/ }
  ]
} satisfies TailwindConfig
