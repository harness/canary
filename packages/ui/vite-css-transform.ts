import type { Plugin } from 'vite'

interface CssWrapperOptions {
  wrapper?: string
}

export default function cssWrapper(options: CssWrapperOptions = {}): Plugin {
  const wrapper = options.wrapper || '#my-mfe'

  return {
    name: 'css-wrapper',
    enforce: 'post' as const,
    generateBundle(outputOptions, bundle) {
      Object.entries(bundle).forEach(([fileName, asset]) => {
        /**
         * This is for the purpose of scoping styles and prevent styles from leaking out
         * to parent application.
         *
         * Add wrapper to styles.css file alone.
         *  */
        if (fileName === 'styles.css' && asset.type === 'asset') {
          const source = typeof asset.source === 'string' ? asset.source : new TextDecoder().decode(asset.source)

          asset.source = `${wrapper} {\n${source}\n}`
        }
      })
    }
  }
}
