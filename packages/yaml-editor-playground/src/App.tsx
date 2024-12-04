import { ILanguageFeaturesService } from 'monaco-editor/esm/vs/editor/common/services/languageFeatures.js'
import { OutlineModel } from 'monaco-editor/esm/vs/editor/contrib/documentSymbols/browser/outlineModel.js'
import { StandaloneServices } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices.js'

import { MonacoGlobals } from '@harnessio/yaml-editor'

import { DataFlowExample } from './examples/data-flow/DataFlowExample'

import './App.css'

MonacoGlobals.set({
  ILanguageFeaturesService,
  OutlineModel,
  StandaloneServices
})

function App() {
  return (
    <div className="App">
      <DataFlowExample />
    </div>
  )
}

export default App
