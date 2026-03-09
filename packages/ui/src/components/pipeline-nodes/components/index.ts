import { CollapseButton as PipelineCollapseButton } from './collapse-button'
import { CollapsedGroupNode } from './collapsed-group-node'
import Port from './custom-port'

export { CollapsedGroupNode } from './collapsed-group-node'

export const PipelineNodesComponents = {
  Port,
  CollapsedGroupNode,
  CollapseButton: PipelineCollapseButton
}
