import { editor } from 'monaco-editor'

import { ThemeDefinition } from '@harnessio/yaml-editor'

import { lchToHex, rgbToHex } from './color-utils'

/** cache for monaco themes, we crate theme only once */
const monacoThemeCache: ThemeDefinition[] = []

/**
 * IMPORTANT:
 * it is important to call function with current theme
 * as the variables names are same for all themes,
 * only the values are different depend on the theme
 */
export function getMonacoThemes(currentTheme: string) {
  const exist = monacoThemeCache.some(theme => {
    return theme.themeName === currentTheme
  })

  if (!exist) {
    const el = document.createElement('div')
    document.body.appendChild(el)
    const themeData = replaceVarsWithHex(themeWithVariables, el)
    document.body.removeChild(el)

    themeData.base = currentTheme.indexOf('light') > -1 ? 'vs' : 'vs-dark'

    monacoThemeCache.push({
      themeName: currentTheme,
      themeData
    })
  }

  return monacoThemeCache
}

function replaceVarsWithHex<T>(obj: T, el: HTMLElement): T {
  if (Array.isArray(obj)) {
    return obj.map(item => replaceVarsWithHex(item, el)) as unknown as T
  } else if (obj && typeof obj === 'object') {
    const result: Partial<T> = {}
    for (const key in obj) {
      result[key] = replaceVarsWithHex((obj as any)[key], el)
    }
    return result as T
  } else if (typeof obj === 'string' && obj.trim().startsWith('var(')) {
    return cssVarToHex(obj, el) as unknown as T
  } else {
    return obj
  }
}

function cssVarToHex(varName: string, el: HTMLElement) {
  el.style.color = `${varName}`
  const colorRgbOrLch = getComputedStyle(el).color

  const rgb = lchToHex(colorRgbOrLch)
  if (rgb) {
    return rgb
  }

  return rgbToHex(colorRgbOrLch)
}

export const themeWithVariables = {
  base: 'vs' as editor.BuiltinTheme,
  inherit: false,
  rules: [
    { token: '', foreground: 'var(--cn-comp-monaco-foreground)', background: 'var(--cn-comp-monaco-background)' },

    { token: 'invalid', foreground: 'var(--cn-comp-monaco-invalid-text)' },
    { token: 'emphasis', fontStyle: 'italic' },
    { token: 'strong', fontStyle: 'bold' },

    { token: 'variable', foreground: 'var(--cn-comp-monaco-key)' },
    { token: 'variable.predefined', foreground: 'var(--cn-comp-monaco-constant)' },
    { token: 'constant', foreground: 'var(--cn-comp-monaco-constant)' },

    { token: 'comment', foreground: 'var(--cn-comp-monaco-comment)' },

    { token: 'number', foreground: 'var(--cn-comp-monaco-number)' },
    { token: 'number.hex', foreground: 'var(--cn-comp-monaco-number)' },

    { token: 'regexp', foreground: 'var(--cn-comp-monaco-constant)' },
    { token: 'annotation', foreground: 'var(--cn-comp-monaco-constant)' },
    { token: 'type', foreground: 'var(--cn-comp-monaco-tag)' },

    { token: 'delimiter', foreground: 'var(--cn-comp-monaco-delimiter)' },
    { token: 'delimiter.html', foreground: 'var(--cn-comp-monaco-delimiter)' },
    { token: 'delimiter.xml', foreground: 'var(--cn-comp-monaco-delimiter)' },

    { token: 'tag', foreground: 'var(--cn-comp-monaco-anchor)' },
    { token: 'tag.id.pug', foreground: 'var(--cn-comp-monaco-tag)' },
    { token: 'tag.class.pug', foreground: 'var(--cn-comp-monaco-tag)' },
    { token: 'meta.scss', foreground: 'var(--cn-comp-monaco-key)' },
    { token: 'metatag', foreground: 'var(--cn-comp-monaco-key)' },
    { token: 'metatag.content.html', foreground: 'var(--cn-comp-monaco-key)' },
    { token: 'metatag.html', foreground: 'var(--cn-comp-monaco-key)' },
    { token: 'metatag.xml', foreground: 'var(--cn-comp-monaco-key)' },
    { token: 'metatag.php', fontStyle: 'bold' },

    { token: 'key', foreground: 'var(--cn-comp-monaco-key)' },
    { token: 'string.key.json', foreground: 'var(--cn-comp-monaco-key)' },
    { token: 'string.value.json', foreground: 'var(--cn-comp-monaco-string)' },

    { token: 'attribute.name', foreground: 'var(--cn-comp-monaco-key)' },
    { token: 'attribute.value', foreground: 'var(--cn-comp-monaco-string)' },
    { token: 'attribute.value.number', foreground: 'var(--cn-comp-monaco-number)' },
    { token: 'attribute.value.unit', foreground: 'var(--cn-comp-monaco-number)' },
    { token: 'attribute.value.html', foreground: 'var(--cn-comp-monaco-string)' },
    { token: 'attribute.value.xml', foreground: 'var(--cn-comp-monaco-string)' },

    { token: 'string', foreground: 'var(--cn-comp-monaco-string)' },
    { token: 'string.html', foreground: 'var(--cn-comp-monaco-string)' },
    { token: 'string.sql', foreground: 'var(--cn-comp-monaco-string)' },
    { token: 'string.yaml', foreground: 'var(--cn-comp-monaco-string)' },

    { token: 'keyword', foreground: 'var(--cn-comp-monaco-boolean)' },
    { token: 'keyword.json', foreground: 'var(--cn-comp-monaco-boolean)' },
    { token: 'keyword.flow', foreground: 'var(--cn-comp-monaco-boolean)' },
    { token: 'keyword.flow.scss', foreground: 'var(--cn-comp-monaco-boolean)' },

    { token: 'operator.scss', foreground: 'var(--cn-comp-monaco-delimiter)' },
    { token: 'operator.sql', foreground: 'var(--cn-comp-monaco-delimiter)' },
    { token: 'operator.swift', foreground: 'var(--cn-comp-monaco-delimiter)' },
    { token: 'predefined.sql', foreground: 'var(--cn-comp-monaco-constant)' }
  ],

  colors: {
    'editor.background': 'var(--cn-comp-monaco-background)',
    'editor.foreground': 'var(--cn-comp-monaco-foreground)',
    'editor.selectionBackground': 'var(--cn-comp-monaco-selection)',
    'editor.lineHighlightBackground': 'var(--cn-comp-monaco-line-highlight)',
    'editorCursor.foreground': 'var(--cn-comp-monaco-cursor)',
    'editorWhitespace.foreground': 'var(--cn-comp-monaco-whitespace)',
    'editorLineNumber.foreground': 'var(--cn-comp-monaco-line-number)',
    'editorLineNumber.activeForeground': 'var(--cn-comp-monaco-foreground)',
    'editorIndentGuide.background': 'var(--cn-comp-monaco-indent-guide)',
    'editorIndentGuide.activeBackground': 'var(--cn-comp-monaco-indent-guide-active)',
    'editorError.background': 'var(--cn-comp-monaco-invalid-bg)',
    'editorError.foreground': 'var(--cn-comp-monaco-invalid-text)'
  }
}
