import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { PipelineStudioView } from '../types/types'

const HIGHLIGHT_DURATION = 2000

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
  highlightInYamlPath: string | undefined
  setHighlightInYamlPath: (path: string | undefined) => void
}

const PipelineStudioViewContext = createContext<PipelineStudioViewContextProps>({
  view: PipelineStudioView.Yaml,
  setView: (_view: PipelineStudioView) => undefined,
  panelOpen: false,
  setPanelOpen: (_panelOpen: boolean) => undefined,
  stepDrawerOpen: StepDrawer.None,
  setStepDrawerOpen: (_stepPaletteOpen: StepDrawer) => undefined,
  highlightInYamlPath: undefined,
  setHighlightInYamlPath: (_path: string | undefined) => undefined
})

const PipelineStudioViewProvider = ({ children }: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) => {
  const [view, setView] = useState(PipelineStudioView.Yaml)
  const isYamlView = view === PipelineStudioView.Yaml
  const [panelVisible, setPanelVisible] = useState(isYamlView)
  const [stepDrawerOpen, setStepDrawerOpen] = useState(StepDrawer.None)

  const [highlightInYamlPath, setHighlightInYamlPath] = useState<string | undefined>(undefined)

  const setHighlightInYamlPathInternal = useCallback(
    (path: string | undefined) => {
      setHighlightInYamlPath(path)

      setTimeout(() => {
        setHighlightInYamlPath(undefined)
      }, HIGHLIGHT_DURATION)
    },
    [setHighlightInYamlPath]
  )

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
        setStepDrawerOpen,
        highlightInYamlPath,
        setHighlightInYamlPath: setHighlightInYamlPathInternal
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
