// Mock for monaco-editor - it doesn't work well in jsdom environment
export const editor = {
  create: () => ({
    dispose: () => {},
    getValue: () => '',
    setValue: () => {},
    onDidChangeModelContent: () => ({ dispose: () => {} }),
    getModel: () => null,
    layout: () => {}
  }),
  defineTheme: () => {},
  setTheme: () => {},
  createModel: () => ({}),
  setModelLanguage: () => {},
  getModels: () => []
}

export const languages = {
  register: () => {},
  setMonarchTokensProvider: () => {},
  setLanguageConfiguration: () => {},
  registerCompletionItemProvider: () => ({ dispose: () => {} }),
  registerHoverProvider: () => ({ dispose: () => {} }),
  registerDocumentFormattingEditProvider: () => ({ dispose: () => {} }),
  getLanguages: () => []
}

export const Uri = {
  parse: (uri: string) => ({ toString: () => uri }),
  file: (path: string) => ({ toString: () => path })
}

export const KeyMod = {
  CtrlCmd: 2048,
  Shift: 1024,
  Alt: 512,
  WinCtrl: 256
}

export const KeyCode = {
  Enter: 3,
  Escape: 9,
  Space: 10,
  Tab: 2
}

export default {
  editor,
  languages,
  Uri,
  KeyMod,
  KeyCode
}
