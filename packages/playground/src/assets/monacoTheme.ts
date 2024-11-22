import type * as monaco from 'monaco-editor'

import type { ThemeDefinition } from '@harnessio/yaml-editor'

const harnessLightTheme = {
  base: 'vs' as monaco.editor.IStandaloneThemeData['base'],
  inherit: true,
  rules: [],
  colors: {}
}

const harnessDarkTheme = {
  base: 'vs-dark' as monaco.editor.IStandaloneThemeData['base'],
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
    'editor.foreground': '#5F97ED', // applied to: -, :
    'editor.background': '#0F0F11', /// background
    //"editor.selectionBackground": "", // selection background
    //"editor.lineHighlightBackground": "", // current line highlight bg
    //"editorCursor.foreground": "", // cursor color
    'editorBracketHighlight.foreground1': '#E29B36', // square brackets
    'editorCodeLens.foreground': '#666666', // annotations color
    'editorLink.activeForeground': '#AAAAAA' // annotations hover color
  }
}

export const themes: ThemeDefinition[] = [
  { themeName: 'dark', themeData: harnessDarkTheme },
  { themeName: 'light', themeData: harnessLightTheme }
]
