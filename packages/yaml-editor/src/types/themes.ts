import * as monaco from 'monaco-editor'

/**
 * Theme definition
 */
export interface ThemeDefinition {
  themeName: string
  themeData: monaco.editor.IStandaloneThemeData
}
