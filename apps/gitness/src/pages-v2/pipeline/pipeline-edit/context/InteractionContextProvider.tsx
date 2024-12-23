import { useCallback, useEffect, useState } from 'react'

import { InteractionContext } from '@harnessio/unified-pipeline'

import { usePipelineDataContext } from './PipelineStudioDataProvider'
import { StepDrawer, usePipelineViewContext } from './PipelineStudioViewProvider'

export const InteractionContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setAddStepIntention, state } = usePipelineDataContext()
  const { setStepDrawerOpen } = usePipelineViewContext()

  const [selectedNodePath, setSelectedNodePath] = useState<string | undefined>()

  const handleAddClick = useCallback((data: { path: string }) => {
    if (data) {
      setAddStepIntention({ path: data.path, position: 'after' })
      setStepDrawerOpen(StepDrawer.Collection)
    }
  }, [])

  useEffect(() => {
    setSelectedNodePath(state.editStepIntention?.path)
  }, [state.editStepIntention])

  return (
    <InteractionContext.Provider value={{ handleAddClick, selectedNodePath, setSelectedNodePath }}>
      {children}
    </InteractionContext.Provider>
  )
}
