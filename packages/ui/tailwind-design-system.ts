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
          1: 'hsl(var(--canary-border-01))',
          2: 'hsl(var(--canary-border-02))',
          3: 'hsl(var(--canary-border-03))',
          4: 'hsl(var(--canary-border-04))',
          5: 'hsl(var(--canary-border-05))',
          6: 'hsl(var(--canary-border-06))',
          7: 'hsl(var(--canary-border-07))',
          8: 'hsl(var(--canary-border-08))',
          9: 'hsl(var(--canary-border-09))',
          10: 'hsl(var(--canary-border-10))',
          danger: 'hsl(var(--canary-border-danger))',
          success: 'hsl(var(--canary-border-success))',
          accent: 'hsl(var(--canary-border-accent))',
          risk: 'hsl(var(--canary-icon-risk))',
          alert: 'hsl(var(--canary-border-alert))'
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
          1: 'oklch(var(--canary-text-1))',
          2: 'oklch(var(--canary-text-2))',
          3: 'oklch(var(--canary-text-3))',
          accent: 'oklch(var(--canary-text-accent))',
          success: 'oklch(var(--canary-text-success))',
          danger: 'oklch(var(--canary-text-danger))',
          warning: 'oklch(var(--canary-text-warning))',
          disabled: 'oklch(var(--canary-state-disabled-text))',

          // SHOULD BE REMOVED
          4: 'oklch(var(--canary-text-3))',
          5: 'oklch(var(--canary-text-3))',
          8: 'oklch(var(--canary-text-3))'
        },
        background: {
          1: 'oklch(var(--canary-background-1))',
          2: 'oklch(var(--canary-background-2))',
          3: 'oklch(var(--canary-background-3))',

          // SHOULD BE REMOVED
          surface: 'oklch(var(--canary-background-1))',
          9: 'oklch(var(--canary-background-1))'
        },
        border: {
          1: 'oklch(var(--canary-border-1))',
          2: 'oklch(var(--canary-border-2))',
          3: 'oklch(var(--canary-border-3))',
          focus: 'oklch(var(--canary-border-focus))',
          success: 'oklch(var(--canary-border-success))',
          danger: 'oklch(var(--canary-border-danger))',
          warning: 'oklch(var(--canary-border-warning))'
        },
        button: {
          foreground: {
            'disabled-1': 'oklch(var(--canary-button-foreground-disabled-01))',
            'danger-1': 'oklch(var(--canary-button-foreground-danger-01))',
            'success-1': 'oklch(var(--canary-button-foreground-success-01))'
          },
          background: {
            'disabled-1': 'oklch(var(--canary-button-background-disabled-01))',
            'danger-1': 'oklch(var(--canary-button-background-danger-01))',
            'danger-2': 'oklch(var(--canary-button-background-danger-02))',
            'danger-3': 'oklch(var(--canary-button-background-danger-03))',
            'success-1': 'oklch(var(--canary-button-background-success-01))',
            'success-2': 'oklch(var(--canary-button-background-success-02))'
          },
          border: {
            'disabled-1': 'oklch(var(--canary-button-border-disabled-01))',
            'danger-1': 'oklch(var(--canary-button-border-danger-01))',
            'success-1': 'oklch(var(--canary-button-border-success-01))'
          }
        },
        tag: {
          border: {
            gray: {
              1: 'oklch(var(--canary-tag-border-gray-01))'
            },
            purple: {
              1: 'oklch(var(--canary-tag-border-purple-01))'
            },
            blue: {
              1: 'oklch(var(--canary-tag-border-blue-01))'
            },
            mint: {
              1: 'oklch(var(--canary-tag-border-mint-01))'
            },
            amber: {
              1: 'oklch(var(--canary-tag-border-amber-01))'
            },
            peach: {
              1: 'oklch(var(--canary-tag-border-peach-01))'
            },
            red: {
              1: 'oklch(var(--canary-tag-border-red-01))'
            }
          },
          foreground: {
            gray: {
              1: 'oklch(var(--canary-tag-foreground-gray-01))'
            },
            purple: {
              1: 'oklch(var(--canary-tag-foreground-purple-01))'
            },
            blue: {
              1: 'oklch(var(--canary-tag-foreground-blue-01))'
            },
            mint: {
              1: 'oklch(var(--canary-tag-foreground-mint-01))'
            },
            amber: {
              1: 'oklch(var(--canary-tag-foreground-amber-01))'
            },
            peach: {
              1: 'oklch(var(--canary-tag-foreground-peach-01))'
            },
            red: {
              1: 'oklch(var(--canary-tag-foreground-red-01))'
            },
            code: {
              1: 'oklch(var(--canary-code-foreground-01))',
              2: 'oklch(var(--canary-code-foreground-02))',
              3: 'oklch(var(--canary-code-foreground-03))',
              4: 'oklch(var(--canary-code-foreground-04))',
              5: 'oklch(var(--canary-code-foreground-05))',
              6: 'oklch(var(--canary-code-foreground-06))',
              7: 'oklch(var(--canary-code-foreground-07))',
              8: 'oklch(var(--canary-code-foreground-08))'
            }
          },
          background: {
            gray: {
              1: 'oklch(var(--canary-tag-background-gray-01))',
              2: 'oklch(var(--canary-tag-background-gray-02))'
            },
            purple: {
              1: 'oklch(var(--canary-tag-background-purple-01))',
              2: 'oklch(var(--canary-tag-background-purple-02))'
            },
            blue: {
              1: 'oklch(var(--canary-tag-background-blue-01))',
              2: 'oklch(var(--canary-tag-background-blue-02))'
            },
            mint: {
              1: 'oklch(var(--canary-tag-background-mint-01))',
              2: 'oklch(var(--canary-tag-background-mint-02))'
            },
            amber: {
              1: 'oklch(var(--canary-tag-background-amber-01))',
              2: 'oklch(var(--canary-tag-background-amber-02))'
            },
            peach: {
              1: 'oklch(var(--canary-tag-background-peach-01))',
              2: 'oklch(var(--canary-tag-background-peach-02))'
            },
            red: {
              1: 'oklch(var(--canary-tag-background-red-01))',
              2: 'oklch(var(--canary-tag-background-red-02))'
            },
            code: {
              1: 'oklch(var(--canary-code-background-01))',
              2: 'oklch(var(--canary-code-background-02))',
              3: 'oklch(var(--canary-code-background-03))',
              4: 'oklch(var(--canary-code-background-04))',
              5: 'oklch(var(--canary-code-background-05))',
              6: 'oklch(var(--canary-code-background-06))',
              7: 'oklch(var(--canary-code-background-07))',
              8: 'oklch(var(--canary-code-background-08))'
            }
          }
        },
        icons: {
          1: 'oklch(var(--canary-icon-01))',
          2: 'oklch(var(--canary-icon-02))',
          3: 'oklch(var(--canary-icon-03))',
          4: 'oklch(var(--canary-icon-04))',
          5: 'oklch(var(--canary-icon-05))',
          6: 'oklch(var(--canary-icon-06))',
          7: 'oklch(var(--canary-icon-07))',
          8: 'oklch(var(--canary-icon-08))',
          9: 'oklch(var(--canary-icon-09))',
          10: 'oklch(var(--canary-icon-10))',
          danger: 'oklch(var(--canary-icon-danger))',
          alert: 'oklch(var(--canary-icon-alert))',
          success: 'oklch(var(--canary-icon-success))',
          accent: 'oklch(var(--canary-icon-accent))',
          merged: 'oklch(var(--canary-icon-merged))',
          risk: 'oklch(var(--canary-icon-risk))'
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
      //   backgroundImage: {
      //     'gradient-radial': 'radial-gradient(var(--canary-tw-gradient-stops))',
      //     'ai-button':
      //       'linear-gradient(to right, hsl(var(--canary-ai-button-stop-1)), hsl(var(--canary-ai-button-stop-2)), hsl(var(--canary-ai-button-stop-3)), hsl(var(--canary-ai-button-stop-4)))',
      //     'navbar-gradient-1':
      //       'radial-gradient(50% 50% at 50% 50%, hsla(var(--canary-nav-gradient-1-1)) 0%, hsla(var(--canary-nav-gradient-1-2)) 100%)',
      //     'navbar-gradient-2':
      //       'radial-gradient(50% 50% at 50% 50%, hsla(var(--canary-nav-gradient-2-1)) 0%, hsla(var(--canary-nav-gradient-2-2)) 44.95%, hsla(var(--canary-nav-gradient-2-3)) 100%)',
      //     'navbar-gradient-3':
      //       'radial-gradient(50% 50% at 50% 50%, hsla(var(--canary-nav-gradient-3-1)) 0%, hsla(var(--canary-nav-gradient-3-2)) 100%)',
      //     'navbar-gradient-4':
      //       'radial-gradient(50% 50% at 50% 50%, hsla(var(--canary-nav-gradient-4-1)) 0%, hsla(var(--canary-nav-gradient-4-2)) 100%)',
      //     'navbar-item-gradient':
      //       'radial-gradient(50% 50% at 50% 50%, hsla(var(--canary-nav-item-gradient-1)) 0%, hsla(var(--canary-nav-item-gradient-2)) 17.63%, hsla(var(--canary-nav-item-gradient-3)) 40.23%, hsla(var(--canary-nav-item-gradient-4)) 61.54%, hsla(var(--canary-nav-item-gradient-5)) 80%, hsla(var(--canary-nav-item-gradient-6)) 100%)',
      //     'widget-bg-gradient':
      //       'radial-gradient(80.82% 77.84% at 80.15% 11.99%, hsla(var(--canary-widget-bg-gradient-from)) 8.43%, hsla(var(--canary-widget-bg-gradient-to)) 100%)',
      //     'widget-number-gradient':
      //       'linear-gradient(180deg, hsla(var(--canary-widget-number-gradient-from)) 35.9%, hsla(var(--canary-widget-number-gradient-to)) 100%)',
      //     'widget-number-bg-gradient':
      //       'linear-gradient(135deg, hsla(var(--canary-widget-number-bg-gradient-from)) 0%, hsla(var(--canary-widget-number-bg-gradient-to)) 67.67%)',
      //     'graph-gradient-1':
      //       'radial-gradient(88.57% 100% at 14.29% 0%, var(--canary-graph-gradient-bg-1) 10.62%, var(--canary-graph-gradient-bg-2) 75.86%)',
      //     'graph-bg-gradient': 'radial-gradient(circle, var(--canary-graph-viewport-bg) 1px, transparent 1px)'
      //   },
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
