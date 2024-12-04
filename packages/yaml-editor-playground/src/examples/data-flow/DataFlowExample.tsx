import React from 'react'

import DataProvider from './DataProvider'
import { YamlEditorWrapper } from './YamlEditorWrapper'

export const DataFlowExample: React.FC = () => {
  return (
    <DataProvider>
      <YamlEditorWrapper />
    </DataProvider>
  )
}
