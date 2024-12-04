import { createContext, useContext, useEffect, useState } from 'react'

import { PipelineStudioView } from '../types/types'

export enum StepDrawer {
  None = 'none',
  Collection = 'palette',
  Form = 'stepform'
}

interface PipelineStudioViewContextProps {
  view: PipelineStudioView
  setView: (view: PipelineStudioView) => void
  panelOpen: boolean
  setPanelOpen: (view: boolean) => void
  stepDrawerOpen: StepDrawer
  setStepDrawerOpen: (view: StepDrawer) => void
}

const PipelineStudioViewContext = createContext<PipelineStudioViewContextProps>({
  view: PipelineStudioView.Yaml,
  setView: (_view: PipelineStudioView) => undefined,
  panelOpen: false,
  setPanelOpen: (_panelOpen: boolean) => undefined,
  stepDrawerOpen: StepDrawer.None,
  setStepDrawerOpen: (_stepPaletteOpen: StepDrawer) => undefined
})

const PipelineStudioViewProvider = ({ children }: React.PropsWithChildren) => {
  const [view, setView] = useState(PipelineStudioView.Yaml)
  const isYamlView = view === PipelineStudioView.Yaml
  const [panelVisible, setPanelVisible] = useState(isYamlView)
  const [stepDrawerOpen, setStepDrawerOpen] = useState(StepDrawer.None)

  useEffect(() => {
    setPanelVisible(isYamlView)
  }, [view])

  return (
    <PipelineStudioViewContext.Provider
      value={{
        view,
        setView,
        panelOpen: panelVisible,
        setPanelOpen: setPanelVisible,
        stepDrawerOpen,
        setStepDrawerOpen
      }}
    >
      {children}
    </PipelineStudioViewContext.Provider>
  )
}

export default PipelineStudioViewProvider

export const usePipelineViewContext = () => {
  return useContext(PipelineStudioViewContext)
}
