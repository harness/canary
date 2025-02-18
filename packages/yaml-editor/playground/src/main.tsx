import { StrictMode } from 'react'
import { render } from 'react-dom'

import { ILanguageFeaturesService } from 'monaco-editor/esm/vs/editor/common/services/languageFeatures.js'
import { OutlineModel } from 'monaco-editor/esm/vs/editor/contrib/documentSymbols/browser/outlineModel.js'
import { StandaloneServices } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices.js'

import { MonacoGlobals } from '../../src'
import Playground from './playground'

MonacoGlobals.set({
  ILanguageFeaturesService,
  OutlineModel,
  StandaloneServices
})

render(
  <StrictMode>
    <Playground />
  </StrictMode>,
  document.getElementById('root')
)
