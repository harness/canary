import React, { createContext, useState } from 'react'

import { stageApproval } from '../../configurations/pipeline/stage-approval'

export interface YamlRevision {
  yaml: string
  revisionId?: number
}

interface DataContextProps {
  yamlRevision: YamlRevision
  setYamlRevision: (yamlData: YamlRevision) => void
}

const DataContext = createContext<DataContextProps>({
  yamlRevision: { yaml: '' },
  setYamlRevision: (_yamlRevision: YamlRevision) => undefined
})

const DataProvider: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = ({ children }) => {
  const [yamlRevision, setYamlRevision] = useState<YamlRevision>({ yaml: stageApproval })

  return <DataContext.Provider value={{ yamlRevision, setYamlRevision }}>{children}</DataContext.Provider>
}

export default DataProvider

export const useDataContext = () => {
  return React.useContext(DataContext)
}
