import { Handle, NodeProps, Position } from 'reactflow'

import { Icon } from '@harnessio/canary'

import { getNodeDiagnostics } from '../../../../../components/Canvas/utils/NodeUtils'
import { useCanvasStore } from '../../../../../framework/CanvasStore/CanvasStoreContext'
import { DefaultNodeProps, ExpandNodeProps } from '../../../types'

export interface RootNodeProps extends Omit<DefaultNodeProps, 'targetPostion'>, ExpandNodeProps {}

export default function RootNode({ data, xPos, yPos, zIndex }: NodeProps<RootNodeProps>) {
  const { enableDiagnostics } = useCanvasStore()
  const { sourcePosition = Position.Right } = data
  return (
    <>
      <div className="flex size-10 items-center justify-center rounded-full bg-studio-1">
        <Icon name="play" className="text-success hover:cursor-pointer" />
      </div>
      <Handle position={sourcePosition} type="source" />
      {enableDiagnostics?.Node && (
        <span className="text-red text-sm">{getNodeDiagnostics({ xPos, yPos, zIndex })}</span>
      )}
    </>
  )
}
