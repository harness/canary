# Yaml Editor

## Development

Run `pnpm dev` and `pnpm playground`

## Playground

`pnpm playground`

## Production

`pnpm build`

## Setup

```tsx
import { ILanguageFeaturesService } from 'monaco-editor/esm/vs/editor/common/services/languageFeatures.js'
import { OutlineModel } from 'monaco-editor/esm/vs/editor/contrib/documentSymbols/browser/outlineModel.js'
import { StandaloneServices } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices.js'

import { MonacoGlobals } from '@harnessio/yaml-editor'

MonacoGlobals.set({
  ILanguageFeaturesService,
  OutlineModel,
  StandaloneServices
})
```
