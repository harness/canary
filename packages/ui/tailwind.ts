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
        border: 'hsl(var(--canary-border))',
        'border-background': 'hsl(var(--canary-border-background))',
        input: 'hsl(var(--canary-input))',
        'input-background': 'hsl(var(--canary-input-background))',
        ring: 'hsl(var(--canary-ring))',
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
          background: 'hsl(var(--canary-tertiary-background))',
          muted: 'hsl(var(--canary-tertiary-muted))'
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
        emphasis: {
          DEFAULT: 'hsl(var(--canary-emphasis))'
        },
        ai: {
          DEFAULT: 'hsl(var(--canary-ai))'
        },
        divergence: {
          behind: 'hsl(var(--canary-grey-20))',
          ahead: 'hsl(var(--canary-grey-30))'
        },
        /* New colors design variables */
        foreground: {
          // TODO: remove DEFAULT, cause use old color var
          DEFAULT: 'hsl(var(--canary-foreground))',
          1: 'hsl(var(--canary-foreground-01))',
          2: 'hsl(var(--canary-foreground-02))',
          3: 'hsl(var(--canary-foreground-03))',
          4: 'hsl(var(--canary-foreground-04))',
          5: 'hsl(var(--canary-foreground-05))',
          6: 'hsl(var(--canary-foreground-06))',
          7: 'hsl(var(--canary-foreground-07))',
          8: 'hsl(var(--canary-foreground-08))',
          9: 'hsl(var(--canary-foreground-09))',
          10: 'hsl(var(--canary-foreground-10))',
          danger: 'hsl(var(--canary-foreground-danger))',
          alert: 'hsl(var(--canary-foreground-alert))',
          success: 'hsl(var(--canary-foreground-success))',
          accent: 'hsl(var(--canary-foreground-accent))'
        },
        background: {
          // TODO: remove DEFAULT, cause use old color var
          DEFAULT: 'hsl(var(--canary-background))',
          1: 'hsl(var(--canary-background-01))',
          2: 'hsl(var(--canary-background-02))',
          3: 'hsl(var(--canary-background-03))',
          4: 'hsla(var(--canary-background-04))',
          5: 'hsl(var(--canary-background-05))',
          6: 'hsl(var(--canary-background-06))',
          7: 'hsl(var(--canary-background-07))',
          8: 'hsl(var(--canary-background-08))',
          9: 'hsl(var(--canary-background-09))',
          10: 'hsl(var(--canary-background-10))',
          11: 'hsl(var(--canary-background-11))',
          12: 'hsl(var(--canary-background-12))',
          13: 'hsl(var(--canary-background-13))',
          surface: 'hsl(var(--canary-background-surface))',
          danger: 'hsla(var(--canary-background-danger))',
          success: 'hsla(var(--canary-background-success))'
        },
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
        button: {
          foreground: {
            'disabled-1': 'hsl(var(--canary-button-foreground-disabled-01))',
            'danger-1': 'hsl(var(--canary-button-foreground-danger-01))',
            'success-1': 'hsl(var(--canary-button-foreground-success-01))',
            'accent-1': 'hsl(var(--canary-button-foreground-accent-1))',
            'accent-2': 'hsl(var(--canary-button-foreground-accent-2))'
          },
          background: {
            'disabled-1': 'hsla(var(--canary-button-background-disabled-01))',
            'danger-1': 'hsla(var(--canary-button-background-danger-01))',
            'danger-2': 'hsla(var(--canary-button-background-danger-02))',
            'danger-3': 'hsla(var(--canary-button-background-danger-03))',
            'success-1': 'hsla(var(--canary-button-background-success-01))',
            'success-2': 'hsla(var(--canary-button-background-success-02))',
            'accent-1': 'hsl(var(--canary-button-background-accent-1))',
            'accent-2': 'hsl(var(--canary-button-background-accent-2))',
            'accent-3': 'hsl(var(--canary-button-background-accent-3))'
          },
          border: {
            'disabled-1': 'hsla(var(--canary-button-border-disabled-01))',
            'danger-1': 'hsla(var(--canary-button-border-danger-01))',
            'success-1': 'hsla(var(--canary-button-border-success-01))',
            'accent-1': 'hsl(var(--canary-button-border-accent-1))'
          }
        },
        tag: {
          border: {
            gray: {
              1: 'hsla(var(--canary-tag-border-gray-01))'
            },
            purple: {
              1: 'hsla(var(--canary-tag-border-purple-01))'
            },
            blue: {
              1: 'hsla(var(--canary-tag-border-blue-01))'
            },
            mint: {
              1: 'hsla(var(--canary-tag-border-mint-01))'
            },
            amber: {
              1: 'hsla(var(--canary-tag-border-amber-01))'
            },
            peach: {
              1: 'hsla(var(--canary-tag-border-peach-01))'
            },
            red: {
              1: 'hsla(var(--canary-tag-border-red-01))'
            }
          },
          foreground: {
            gray: {
              1: 'hsl(var(--canary-tag-foreground-gray-01))'
            },
            purple: {
              1: 'hsl(var(--canary-tag-foreground-purple-01))'
            },
            blue: {
              1: 'hsl(var(--canary-tag-foreground-blue-01))'
            },
            mint: {
              1: 'hsl(var(--canary-tag-foreground-mint-01))'
            },
            amber: {
              1: 'hsl(var(--canary-tag-foreground-amber-01))'
            },
            peach: {
              1: 'hsl(var(--canary-tag-foreground-peach-01))'
            },
            red: {
              1: 'hsl(var(--canary-tag-foreground-red-01))'
            },
            code: {
              1: 'hsl(var(--canary-code-foreground-01))',
              2: 'hsl(var(--canary-code-foreground-02))',
              3: 'hsl(var(--canary-code-foreground-03))',
              4: 'hsl(var(--canary-code-foreground-04))',
              5: 'hsl(var(--canary-code-foreground-05))',
              6: 'hsl(var(--canary-code-foreground-06))',
              7: 'hsl(var(--canary-code-foreground-07))',
              8: 'hsl(var(--canary-code-foreground-08))'
            }
          },
          background: {
            gray: {
              1: 'hsla(var(--canary-tag-background-gray-01))',
              2: 'hsla(var(--canary-tag-background-gray-02))'
            },
            purple: {
              1: 'hsla(var(--canary-tag-background-purple-01))',
              2: 'hsla(var(--canary-tag-background-purple-02))'
            },
            blue: {
              1: 'hsla(var(--canary-tag-background-blue-01))',
              2: 'hsla(var(--canary-tag-background-blue-02))'
            },
            mint: {
              1: 'hsla(var(--canary-tag-background-mint-01))',
              2: 'hsla(var(--canary-tag-background-mint-02))'
            },
            amber: {
              1: 'hsla(var(--canary-tag-background-amber-01))',
              2: 'hsla(var(--canary-tag-background-amber-02))'
            },
            peach: {
              1: 'hsla(var(--canary-tag-background-peach-01))',
              2: 'hsla(var(--canary-tag-background-peach-02))'
            },
            red: {
              1: 'hsla(var(--canary-tag-background-red-01))',
              2: 'hsla(var(--canary-tag-background-red-02))'
            },
            code: {
              1: 'hsla(var(--canary-code-background-01))',
              2: 'hsla(var(--canary-code-background-02))',
              3: 'hsla(var(--canary-code-background-03))',
              4: 'hsla(var(--canary-code-background-04))',
              5: 'hsla(var(--canary-code-background-05))',
              6: 'hsla(var(--canary-code-background-06))',
              7: 'hsla(var(--canary-code-background-07))',
              8: 'hsla(var(--canary-code-background-08))'
            }
          }
        },
        icons: {
          1: 'hsl(var(--canary-icon-01))',
          2: 'hsl(var(--canary-icon-02))',
          3: 'hsl(var(--canary-icon-03))',
          4: 'hsl(var(--canary-icon-04))',
          5: 'hsl(var(--canary-icon-05))',
          6: 'hsl(var(--canary-icon-06))',
          7: 'hsl(var(--canary-icon-07))',
          8: 'hsl(var(--canary-icon-08))',
          9: 'hsl(var(--canary-icon-09))',
          10: 'hsl(var(--canary-icon-10))',
          danger: 'hsl(var(--canary-icon-danger))',
          alert: 'hsl(var(--canary-icon-alert))',
          success: 'hsl(var(--canary-icon-success))',
          accent: 'hsl(var(--canary-icon-accent))',
          merged: 'hsl(var(--canary-icon-merged))',
          risk: 'hsl(var(--canary-icon-risk))'
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
            1: 'hsl(var(--canary-sidebar-background-01))',
            2: 'var(--canary-sidebar-background-02)'
          },
          border: {
            1: 'hsl(var(--canary-sidebar-border-01))',
            2: 'hsla(var(--canary-sidebar-border-02))',
            3: 'hsl(var(--canary-sidebar-border-03))'
          },
          foreground: {
            1: 'hsl(var(--canary-sidebar-foreground-01))',
            2: 'hsl(var(--canary-sidebar-foreground-02))',
            3: 'hsl(var(--canary-sidebar-foreground-03))',
            4: 'hsl(var(--canary-sidebar-foreground-04))',
            5: 'hsl(var(--canary-sidebar-foreground-05))',
            accent: 'hsl(var(--canary-sidebar-foreground-accent))'
          },
          icon: {
            1: 'hsl(var(--canary-sidebar-icon-01))',
            2: 'hsl(var(--canary-sidebar-icon-02))',
            3: 'hsl(var(--canary-sidebar-icon-03))'
          }
        },
        graph: {
          background: {
            1: 'hsl(var(--canary-graph-background-1))',
            2: 'hsl(var(--canary-graph-background-2))',
            3: 'var(--canary-graph-background-3)',
            4: 'hsl(var(--canary-graph-background-4))'
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
          '0px 0px 3px 0.5px hsla(var(--canary-background-05) / 0.2), 0px 0px 8px 1px hsla(var(--canary-background-05) / 0.3)',
        auth: '0px 0px 20px var(--canary-box-shadow-2)'
      },
      borderColor: {
        'borders-1': 'hsl(var(--canary-border-01))',
        'borders-2': 'hsl(var(--canary-border-02))',
        'borders-3': 'hsl(var(--canary-border-03))',
        'borders-4': 'hsl(var(--canary-border-04))',
        'borders-5': 'hsl(var(--canary-border-05))',
        'borders-6': 'hsl(var(--canary-border-06))',
        'borders-7': 'hsl(var(--canary-border-07))',
        'borders-8': 'hsl(var(--canary-border-08))',
        'borders-9': 'hsl(var(--canary-border-09))',
        'borders-10': 'hsl(var(--canary-border-10))',
        'borders-danger': 'hsl(var(--canary-border-danger))',
        'borders-success': 'hsl(var(--canary-border-success))',
        'borders-accent': 'hsl(var(--canary-border-accent))',
        'borders-risk': 'hsl(var(--canary-icon-risk))',
        'borders-alert': 'hsl(var(--canary-border-alert))'
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
