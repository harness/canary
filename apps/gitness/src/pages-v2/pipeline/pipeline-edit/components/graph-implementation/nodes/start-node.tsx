import { Icon } from '@harnessio/canary'
import { LeafNodeInternalType } from '@harnessio/pipeline-graph'

export interface StartNodeDataType {}

export function StartNode(_props: { node: LeafNodeInternalType<StartNodeDataType> }) {
  return (
    <div
      className="flex size-full items-center justify-center rounded-full border border-borders-6 bg-primary-foreground"
      //  TODO
      style={{
        border: '1px solid #454545',
        background: 'linear-gradient(-47deg, rgba(152, 150, 172, 0.05) 0%, rgba(177, 177, 177, 0.15) 100%)'
      }}
    >
      <Icon name="play" className="text-success" />
    </div>
  )
}
