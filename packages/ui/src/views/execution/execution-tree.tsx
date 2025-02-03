import { Tree } from '@/components'

import { ExecutionTreeProps } from './types'
import { renderTree } from './utils'

export const ExecutionTree: React.FC<ExecutionTreeProps> = props => {
  const { defaultSelectedId, elements } = props
  return (
    <Tree className="bg-grey-6 overflow-hidden" initialSelectedId={defaultSelectedId} elements={elements}>
      {renderTree(elements, props.onSelectNode)}
    </Tree>
  )
}
