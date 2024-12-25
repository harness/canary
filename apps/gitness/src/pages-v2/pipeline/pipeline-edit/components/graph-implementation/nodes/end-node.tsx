import { LeafNodeInternalType } from '@harnessio/pipeline-graph'

export interface EndNodeDataType {}

export function EndNode(_props: { node: LeafNodeInternalType<EndNodeDataType> }) {
  return (
    <div
      className="flex size-full items-center justify-center rounded-full border border-borders-6 bg-primary-foreground"
      //  TODO
      style={{
        border: '1px solid #454545',
        background: 'linear-gradient(-47deg, rgba(152, 150, 172, 0.05) 0%, rgba(177, 177, 177, 0.15) 100%)'
      }}
    >
      {/* TODO: replace with icon */}
      <div className="size-3 bg-success"></div>
    </div>
  )
}
