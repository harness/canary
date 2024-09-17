import '@harnessio/canary/styles'
import '@harnessio/unified-pipeline/styles'
import '../src/styles.css'

import { withThemeByClassName } from '@storybook/addon-themes'

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Design System', 'App Shell', 'Components', 'Screens'],
        locales: ''
      }
    }
  },

  decorators: [
    withThemeByClassName({
      themes: {
        "Harness Open Source: Light": 'harness-open-source-light',
        "Harness Open Source: Dark": 'harness-open-source-dark',
        "Harness Theme: Light": 'harness-theme-light',
        "Harness Theme: Dark": 'harness-theme-dark',
        "UI core: Light": 'ui-core-light',
        "UI core: Dark": 'ui-core-dark',
        light: 'light',
        dark: 'dark'
      },
      defaultTheme: "Harness Open Source: Light"
    })
  ]
}

export default preview
