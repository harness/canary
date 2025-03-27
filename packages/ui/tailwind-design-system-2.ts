import typography from '@tailwindcss/typography'
import tailwindcssAnimate from 'tailwindcss-animate'
import type { PluginAPI, Config as TailwindConfig } from 'tailwindcss/types/config'

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
        sans: ['Inter', 'sans-serif'],
        code: ['JetBrains Mono', 'monospace']
      },
      colors: {
        border: 'var(--cn-border)',
        'border-background': 'var(--cn-border-background)',
        input: 'var(--cn-input)',
        'input-background': 'var(--cn-input-background)',
        ring: 'var(--cn-ring)',
        primary: {
          DEFAULT: 'var(--cn-primary)',
          background: 'var(--cn-primary-background)',
          foreground: 'var(--cn-primary-foreground)',
          muted: 'var(--cn-primary-muted)',
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
        white: {
          DEFAULT: 'var(--cn-white)'
        },
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
          // TODO: remove DEFAULT, cause use old color var
          DEFAULT: 'var(--cn-foreground)',
          1: 'var(--cn-foreground-01)',
          2: 'var(--cn-foreground-02)',
          3: 'var(--cn-foreground-03)',
          4: 'var(--cn-foreground-04)',
          5: 'var(--cn-foreground-05)',
          6: 'var(--cn-foreground-06)',
          7: 'var(--cn-foreground-07)',
          8: 'var(--cn-foreground-08)',
          9: 'var(--cn-foreground-09)',
          10: 'var(--cn-foreground-10)',
          danger: 'var(--cn-foreground-danger)',
          alert: 'var(--cn-foreground-alert)',
          success: 'var(--cn-foreground-success)',
          accent: 'var(--cn-foreground-accent)'
        },
        background: {
          // TODO: remove DEFAULT, cause use old color var
          DEFAULT: 'var(--cn-background)',
          1: 'var(--cn-background-01)',
          2: 'var(--cn-background-02)',
          3: 'var(--cn-background-03)',
          4: 'var(--cn-background-04)',
          5: 'var(--cn-background-05)',
          6: 'var(--cn-background-06)',
          7: 'var(--cn-background-07)',
          8: 'var(--cn-background-08)',
          9: 'var(--cn-background-09)',
          10: 'var(--cn-background-10)',
          11: 'var(--cn-background-11)',
          12: 'var(--cn-background-12)',
          13: 'var(--cn-background-13)',
          surface: 'var(--cn-background-surface)',
          danger: 'var(--cn-background-danger)',
          success: 'var(--cn-background-success)'
        },

        'cds-background': {
          // @deprecated Use 'cds-background-1' instead
          DEFAULT: 'var(--cn-background-1)',
          1: 'var(--cn-background-1)',
          2: 'var(--cn-background-2)',
          3: 'var(--cn-background-3)',

          // 4 - 2
          4: 'var(--cn-background-3)',
          // surface - 2
          surface: 'var(--cn-background-1)',
          // 9 - 2
          9: 'var(--cn-background-3)'
        },
        borders: {
          1: 'var(--cn-border-01)',
          2: 'var(--cn-border-02)',
          3: 'var(--cn-border-03)',
          4: 'var(--cn-border-04)',
          5: 'var(--cn-border-05)',
          6: 'var(--cn-border-06)',
          7: 'var(--cn-border-07)',
          8: 'var(--cn-border-08)',
          9: 'var(--cn-border-09)',
          10: 'var(--cn-border-10)',
          danger: 'var(--cn-border-danger)',
          success: 'var(--cn-border-success)',
          accent: 'var(--cn-border-accent)',
          risk: 'var(--cn-icon-risk)',
          alert: 'var(--cn-border-alert)'
        },
        button: {
          foreground: {
            'disabled-1': 'var(--cn-button-foreground-disabled-01)',
            'danger-1': 'var(--cn-button-foreground-danger-01)',
            'success-1': 'var(--cn-button-foreground-success-01)',
            'accent-1': 'var(--cn-button-foreground-accent-1)',
            'accent-2': 'var(--cn-button-foreground-accent-2)'
          },
          background: {
            'disabled-1': 'var(--cn-button-background-disabled-01)',
            'danger-1': 'var(--cn-button-background-danger-01)',
            'danger-2': 'var(--cn-button-background-danger-02)',
            'danger-3': 'var(--cn-button-background-danger-03)',
            'success-1': 'var(--cn-button-background-success-01)',
            'success-2': 'var(--cn-button-background-success-02)',
            'accent-1': 'var(--cn-button-background-accent-1)',
            'accent-2': 'var(--cn-button-background-accent-2)',
            'accent-3': 'var(--cn-button-background-accent-3)'
          },
          border: {
            'disabled-1': 'var(--cn-button-border-disabled-01)',
            'danger-1': 'var(--cn-button-border-danger-01)',
            'success-1': 'var(--cn-button-border-success-01)',
            'accent-1': 'var(--cn-button-border-accent-1)'
          }
        },
        tag: {
          border: {
            gray: {
              1: 'var(--cn-tag-border-gray-01)'
            },
            purple: {
              1: 'var(--cn-tag-border-purple-01)'
            },
            blue: {
              1: 'var(--cn-tag-border-blue-01)'
            },
            mint: {
              1: 'var(--cn-tag-border-mint-01)'
            },
            amber: {
              1: 'var(--cn-tag-border-amber-01)'
            },
            peach: {
              1: 'var(--cn-tag-border-peach-01)'
            },
            red: {
              1: 'var(--cn-tag-border-red-01)'
            }
          },
          foreground: {
            gray: {
              1: 'var(--cn-tag-foreground-gray-01)'
            },
            purple: {
              1: 'var(--cn-tag-foreground-purple-01)'
            },
            blue: {
              1: 'var(--cn-tag-foreground-blue-01)'
            },
            mint: {
              1: 'var(--cn-tag-foreground-mint-01)'
            },
            amber: {
              1: 'var(--cn-tag-foreground-amber-01)'
            },
            peach: {
              1: 'var(--cn-tag-foreground-peach-01)'
            },
            red: {
              1: 'var(--cn-tag-foreground-red-01)'
            },
            code: {
              1: 'var(--cn-code-foreground-01)',
              2: 'var(--cn-code-foreground-02)',
              3: 'var(--cn-code-foreground-03)',
              4: 'var(--cn-code-foreground-04)',
              5: 'var(--cn-code-foreground-05)',
              6: 'var(--cn-code-foreground-06)',
              7: 'var(--cn-code-foreground-07)',
              8: 'var(--cn-code-foreground-08)'
            }
          },
          background: {
            gray: {
              1: 'var(--cn-tag-background-gray-01)',
              2: 'var(--cn-tag-background-gray-02)'
            },
            purple: {
              1: 'var(--cn-tag-background-purple-01)',
              2: 'var(--cn-tag-background-purple-02)'
            },
            blue: {
              1: 'var(--cn-tag-background-blue-01)',
              2: 'var(--cn-tag-background-blue-02)'
            },
            mint: {
              1: 'var(--cn-tag-background-mint-01)',
              2: 'var(--cn-tag-background-mint-02)'
            },
            amber: {
              1: 'var(--cn-tag-background-amber-01)',
              2: 'var(--cn-tag-background-amber-02)'
            },
            peach: {
              1: 'var(--cn-tag-background-peach-01)',
              2: 'var(--cn-tag-background-peach-02)'
            },
            red: {
              1: 'var(--cn-tag-background-red-01)',
              2: 'var(--cn-tag-background-red-02)'
            },
            code: {
              1: 'var(--cn-code-background-01)',
              2: 'var(--cn-code-background-02)',
              3: 'var(--cn-code-background-03)',
              4: 'var(--cn-code-background-04)',
              5: 'var(--cn-code-background-05)',
              6: 'var(--cn-code-background-06)',
              7: 'var(--cn-code-background-07)',
              8: 'var(--cn-code-background-08)'
            }
          }
        },
        icons: {
          1: 'var(--cn-icon-01)',
          2: 'var(--cn-icon-02)',
          3: 'var(--cn-icon-03)',
          4: 'var(--cn-icon-04)',
          5: 'var(--cn-icon-05)',
          6: 'var(--cn-icon-06)',
          7: 'var(--cn-icon-07)',
          8: 'var(--cn-icon-08)',
          9: 'var(--cn-icon-09)',
          10: 'var(--cn-icon-10)',
          danger: 'var(--cn-icon-danger)',
          alert: 'var(--cn-icon-alert)',
          success: 'var(--cn-icon-success)',
          accent: 'var(--cn-icon-accent)',
          merged: 'var(--cn-icon-merged)',
          risk: 'var(--cn-icon-risk)'
        },
        label: {
          foreground: {
            red: 'var(--canary-label-foreground-red-01)',
            green: 'var(--canary-label-foreground-green-01)',
            yellow: 'var(--canary-label-foreground-yellow-01)',
            blue: 'var(--canary-label-foreground-blue-01)',
            pink: 'var(--canary-label-foreground-pink-01)',
            purple: 'var(--canary-label-foreground-purple-01)',
            violet: 'var(--canary-label-foreground-violet-01)',
            indigo: 'var(--canary-label-foreground-indigo-01)',
            cyan: 'var(--canary-label-foreground-cyan-01)',
            orange: 'var(--canary-label-foreground-orange-01)',
            brown: 'var(--canary-label-foreground-brown-01)',
            mint: 'var(--canary-label-foreground-mint-01)',
            lime: 'var(--canary-label-foreground-lime-01)'
          },
          background: {
            black: 'var(--canary-label-background-black-01)',
            red: 'var(--canary-label-background-red-01)',
            green: 'var(--canary-label-background-green-01)',
            yellow: 'var(--canary-label-background-yellow-01)',
            blue: 'var(--canary-label-background-blue-01)',
            pink: 'var(--canary-label-background-pink-01)',
            purple: 'var(--canary-label-background-purple-01)',
            violet: 'var(--canary-label-background-violet-01)',
            indigo: 'var(--canary-label-background-indigo-01)',
            cyan: 'var(--canary-label-background-cyan-01)',
            orange: 'var(--canary-label-background-orange-01)',
            brown: 'var(--canary-label-background-brown-01)',
            mint: 'var(--canary-label-background-mint-01)',
            lime: 'var(--canary-label-background-lime-01)'
          }
        },
        sidebar: {
          background: {
            1: 'var(--cn-sidebar-background-01)',
            2: 'var(--canary-sidebar-background-02)',
            3: 'var(--canary-sidebar-background-03)',
            4: 'var(--cn-sidebar-background-04)',
            5: 'var(--cn-sidebar-background-05)',
            6: 'var(--canary-sidebar-background-06)',
            7: 'var(--cn-sidebar-background-07)',
            8: 'var(--cn-sidebar-background-08)'
          },
          border: {
            1: 'var(--cn-sidebar-border-01)',
            2: 'var(--cn-sidebar-border-02)',
            3: 'var(--cn-sidebar-border-03)',
            4: 'var(--cn-sidebar-border-04)',
            5: 'var(--cn-sidebar-border-05)'
          },
          foreground: {
            1: 'var(--cn-sidebar-foreground-01)',
            2: 'var(--cn-sidebar-foreground-02)',
            3: 'var(--cn-sidebar-foreground-03)',
            4: 'var(--cn-sidebar-foreground-04)',
            5: 'var(--cn-sidebar-foreground-05)',
            6: 'var(--cn-sidebar-foreground-06)',
            accent: 'var(--cn-sidebar-foreground-accent)'
          },
          icon: {
            1: 'var(--cn-sidebar-icon-01)',
            2: 'var(--cn-sidebar-icon-02)',
            3: 'var(--cn-sidebar-icon-03)'
          }
        },
        topbar: {
          background: {
            1: 'var(--cn-topbar-background-01)'
          },
          foreground: {
            1: 'var(--cn-topbar-foreground-01)',
            2: 'var(--cn-topbar-foreground-02)',
            3: 'var(--cn-topbar-foreground-03)',
            4: 'var(--cn-topbar-foreground-04)'
          },
          icon: {
            1: 'var(--cn-topbar-icon-01)'
          }
        },
        graph: {
          background: {
            1: 'var(--cn-graph-background-1)',
            2: 'var(--cn-graph-background-2)',
            3: 'var(--canary-graph-background-3)',
            4: 'var(--cn-graph-background-4)'
          },
          border: {
            1: 'var(--cn-graph-border-1)'
          }
        }
      },
      letterSpacing: {
        tight: '-0.02em'
      },
      boxShadow: {
        1: '0px 8px 16px var(--canary-box-shadow-1)',
        2: '0px 8px 8px var(--canary-box-shadow-2)',
        'pagination-1': '0px 2px 4px var(--canary-box-shadow-pagination)',
        'as-border': 'inset 0 0 0 1px',
        'commit-list-bullet':
          '0px 0px 3px 0.5px var(--cn-background-05) / 0.2), 0px 0px 8px 1px var(--cn-background-05) / 0.3)',
        auth: '0px 0px 20px var(--canary-box-shadow-2)'
      },
      borderColor: {
        'borders-1': 'var(--cn-border-01)',
        'borders-2': 'var(--cn-border-02)',
        'borders-3': 'var(--cn-border-03)',
        'borders-4': 'var(--cn-border-04)',
        'borders-5': 'var(--cn-border-05)',
        'borders-6': 'var(--cn-border-06)',
        'borders-7': 'var(--cn-border-07)',
        'borders-8': 'var(--cn-border-08)',
        'borders-9': 'var(--cn-border-09)',
        'borders-10': 'var(--cn-border-10)',
        'borders-danger': 'var(--cn-border-danger)',
        'borders-success': 'var(--cn-border-success)',
        'borders-accent': 'var(--cn-border-accent)',
        'borders-risk': 'var(--cn-icon-risk)',
        'borders-alert': 'var(--cn-border-alert)'
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
        'gradient-radial': 'radial-gradient(var(--canary-tw-gradient-stops))',
        'ai-button':
          'linear-gradient(to right, var(--cn-ai-button-stop-1), var(--cn-ai-button-stop-2), var(--cn-ai-button-stop-3), var(--cn-ai-button-stop-4))',
        'navbar-gradient-1':
          'radial-gradient(50% 50% at 50% 50%, var(--cn-nav-gradient-1-1) 0%, var(--cn-nav-gradient-1-2) 100%)',
        'navbar-gradient-2':
          'radial-gradient(50% 50% at 50% 50%, var(--cn-nav-gradient-2-1) 0%, var(--cn-nav-gradient-2-2) 44.95%, var(--cn-nav-gradient-2-3) 100%)',
        'navbar-gradient-3':
          'radial-gradient(50% 50% at 50% 50%, var(--cn-nav-gradient-3-1) 0%, var(--cn-nav-gradient-3-2) 100%)',
        'navbar-gradient-4':
          'radial-gradient(50% 50% at 50% 50%, var(--cn-nav-gradient-4-1) 0%, var(--cn-nav-gradient-4-2) 100%)',
        'navbar-item-gradient':
          'radial-gradient(50% 50% at 50% 50%, var(--cn-nav-item-gradient-1) 0%, var(--cn-nav-item-gradient-2) 17.63%, var(--cn-nav-item-gradient-3) 40.23%, var(--cn-nav-item-gradient-4) 61.54%, var(--cn-nav-item-gradient-5) 80%, var(--cn-nav-item-gradient-6) 100%)',
        'widget-bg-gradient':
          'radial-gradient(80.82% 77.84% at 80.15% 11.99%, var(--cn-widget-bg-gradient-from) 8.43%, var(--cn-widget-bg-gradient-to) 100%)',
        'widget-number-gradient':
          'linear-gradient(180deg, var(--cn-widget-number-gradient-from) 35.9%, var(--cn-widget-number-gradient-to) 100%)',
        'widget-number-bg-gradient':
          'linear-gradient(135deg, var(--cn-widget-number-bg-gradient-from) 0%, var(--cn-widget-number-bg-gradient-to) 67.67%)',
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
            'inset 0 1px 0 0 var(--cn-border-background), inset 1px 0 0 0 var(--cn-border-background), inset -1px 0 0 0 var(--cn-border-background)'
        },
        '.tabnav-inactive': {
          boxShadow: 'inset 0 -1px 0 0 var(--cn-border-background)'
        }
      })
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
  safelist: [
    'prose',
    'prose-invert',
    'prose-headings',
    'prose-p',
    'prose-a',
    'prose-img',
    'prose-code',
    { pattern: /^bg-graph-/ },
    { pattern: /^cds-bg-background-/ },
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
    // topbar classes
    { pattern: /^bg-topbar-background-/ },
    { pattern: /^text-topbar-foreground-/ },
    { pattern: /^text-topbar-icon-/ },

    // Hover classes
    { pattern: /^hover:bg-graph-/ },
    { pattern: /^hover:cds-bg-background-/ },
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
    // topbar classes
    { pattern: /^hover:bg-topbar-background-/ },
    { pattern: /^hover:text-topbar-foreground-/ },
    { pattern: /^hover:text-topbar-icon-/ },
    // NOTE: stroke-border-2 temporary here as it is used by in gitness for pipeline-graph
    'stroke-borders-2',
    // NOTE: temporary - used in design-system
    { pattern: /bg-primary-./ }
  ]
} satisfies TailwindConfig
