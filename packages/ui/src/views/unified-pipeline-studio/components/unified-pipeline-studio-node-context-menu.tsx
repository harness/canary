import { usePipelineStudioNodeContext } from './graph-implementation/context/UnifiedPipelineStudioNodeContext'

export const PipelineStudioNodeContextMenu = () => {
  const { contextMenuData } = usePipelineStudioNodeContext()

  return contextMenuData ? <contextMenuData.contextMenu outsidePosition={contextMenuData.outsidePosition} /> : null
}
