import { useCallback } from 'react'

import { getThemeCSSName, type FullTheme } from '@/context/theme/types'

export type ThemeManifest = Record<string, string>

const THEME_ATTR = 'data-theme-loader'
const THEME_ATTR_VALUE = 'cn-on-demand-theme'
const SELECTOR = `link[${THEME_ATTR}="${THEME_ATTR_VALUE}"]`

function removeAllThemeLinks(): void {
  document.querySelectorAll(SELECTOR).forEach(el => el.remove())
}

export function useThemeCSSLoader(themesBasePath: string, manifest: ThemeManifest) {
  const loadTheme = useCallback(
    (theme: FullTheme): Promise<void> => {
      const cssName = getThemeCSSName(theme)
      const existingLinks = document.querySelectorAll(SELECTOR) as NodeListOf<HTMLLinkElement>

      /**
       * dark-std-std, light-std-std themes are already bundled, so no need to load them
       */
      if (!cssName) {
        // existingLinks.forEach(link => link.remove())
        removeAllThemeLinks()
        return Promise.resolve()
      }

      const filename = manifest[cssName]
      if (!filename) return Promise.resolve()

      const href = `${themesBasePath}/${filename}`

      if (Array.from(existingLinks).some(link => link.getAttribute('href') === href)) {
        return Promise.resolve()
      }

      return new Promise<void>(resolve => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href

        link.onload = () => {
          // existingLinks.forEach(link => link.remove())
          removeAllThemeLinks()
          // link.id = LINK_ELEMENT_ID
          link.setAttribute(THEME_ATTR, THEME_ATTR_VALUE)
          resolve()
        }

        link.onerror = () => {
          // existingLinks.forEach(link => link.remove())
          removeAllThemeLinks()
          // link.id = LINK_ELEMENT_ID
          link.setAttribute(THEME_ATTR, THEME_ATTR_VALUE)
          resolve()
        }

        document.head.appendChild(link)
      })
    },
    [themesBasePath, manifest]
  )

  return { loadTheme }
}
