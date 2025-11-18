import { FC } from 'react'

import { Tree } from '@/components'

import { ExecutionTreeProps } from './types'
import { renderTree } from './utils'

export const ExecutionTree: FC<ExecutionTreeProps> = props => {
  const { defaultSelectedId, elements } = props
  return (
    <Tree className="-mb-cn-sm overflow-hidden pb-cn-sm" initialSelectedId={defaultSelectedId} elements={elements}>
      {renderTree(elements, props.onSelectNode)}
    </Tree>
  )
}
