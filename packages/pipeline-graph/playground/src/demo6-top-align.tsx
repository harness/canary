import React, { useState } from 'react'

import { CanvasProvider } from '../../src/context/canvas-provider'
import { PipelineGraph } from '../../src/pipeline-graph'
import { NodeContent } from '../../src/types/node-content'
import { AnyContainerNodeType, ContainerNode } from '../../src/types/nodes'
import { CanvasControls } from './canvas/CanvasControls'
import { taData } from './sample-data/pipeline-top-align'

import './sample-data/pipeline-data'

import { TASimpleParallelGroupNodeContent } from './nodes-simple-top-allign/ta-simple-parallel-group-node'
import { TASimpleStepNode } from './nodes-simple-top-allign/ta-simple-step-node'

const nodes: NodeContent[] = [
  {
    containerType: ContainerNode.leaf,
    type: 'step',
    component: TASimpleStepNode
  },
  {
    containerType: ContainerNode.parallel,
    type: 'parallel',
    component: TASimpleParallelGroupNodeContent
  } as NodeContent
]

function Demo6TopAlign() {
  const [data] = useState<AnyContainerNodeType[]>(taData)

  return (
    <CanvasProvider>
      <PipelineGraph
        data={data}
        nodes={nodes}
        layout={{ type: 'top', portPosition: 80 }}
        parallelContainerConfig={{ paddingBottom: 0, paddingLeft: 0, paddingRight: 0, paddingTop: 0 }}
        portComponent={props => {
          return (
            <div
              id={props.id}
              style={{
                position: 'absolute',
                [props.side === 'left' ? 'left' : 'right']: `-5px`,
                top: props.layout?.portPosition + 'px',
                background: '#121214',
                borderRadius: '50%',
                boxSizing: 'border-box'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-9px',
                  left: '-5px'
                }}
              >
                {props.side === 'left' ? '>' : null}
              </div>
            </div>
          )
        }}
      />
      <CanvasControls />
    </CanvasProvider>
  )
}

export default Demo6TopAlign
