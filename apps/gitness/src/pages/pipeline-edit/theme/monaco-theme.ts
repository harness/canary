import { editor } from 'monaco-editor'

import { ThemeDefinition } from '@harnessio/yaml-editor'

const harnessLightTheme = {
  base: 'vs' as editor.BuiltinTheme,
  inherit: true,
  rules: [],
  colors: {}
}

const getHarnessDarkTheme = (options?: { isBlame?: boolean }) => ({
  base: 'vs-dark' as editor.BuiltinTheme,
  inherit: true,
  rules: [
    {
      background: '#0F0F11', // minimap background
      token: ''
    },
    {
      foreground: '#5F97ED', // property name
      token: 'type'
    },
    {
      foreground: '#E29B36', // strings value
      token: 'string'
    },
    {
      foreground: '#E29B36', // number value
      token: 'number'
    }
  ],
  colors: {
    'editor.foreground': '#5F97ED', // in yaml this is applied to -, :
    'editor.background': '#0F0F11', /// background
    //"editor.selectionBackground": "", // selection background
    //"editor.lineHighlightBackground": "", // current line highlight bg
    //"editorCursor.foreground": "", // cursor color
    'editorBracketHighlight.foreground1': '#E29B36', // square brackets
    'editorLineNumber.foreground': options?.isBlame ? '#787885' : '#303036', // line number color
    'editorLineNumber.activeForeground': '#CCCCCC' //active line number color
    // 'editorIndentGuide.background': '#439911', // WARN: this does not work
    // 'editorIndentGuide.activeBackground': '#129912' // WARN: this does not work
  }
})

export const themes: ThemeDefinition[] = [
  { themeName: 'dark', themeData: getHarnessDarkTheme() },
  { themeName: 'light', themeData: harnessLightTheme }
]

export const themesForBlame: ThemeDefinition[] = [
  { themeName: 'dark', themeData: getHarnessDarkTheme({ isBlame: true }) },
  { themeName: 'light', themeData: harnessLightTheme }
]
