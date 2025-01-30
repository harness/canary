import { usePipelineStudioNodeContext } from './graph-implementation/context/PipelineStudioNodeContext'

export const PipelineStudioNodeContextMenu = () => {
  const { contextMenuData } = usePipelineStudioNodeContext()

  return contextMenuData ? contextMenuData.contextMenu() : null
}
