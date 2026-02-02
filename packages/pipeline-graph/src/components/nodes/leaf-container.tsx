import { useMemo } from 'react'

import { motion } from 'framer-motion'
import { useContainerNodeContext } from '../../context/container-node-provider'
import { RenderNodeContent } from '../../render/render-node-content'
import { ContainerNodeProps } from '../../types/container-node'
import { LeafNodeInternalType } from '../../types/nodes-internal'
import Port from './port'

const itemVariants = {
  hidden: {
    opacity: 0,
    // scale: 0.8,
    x: 0
  },
  visible: {
    opacity: 1,
    // scale: 1,
    x: 0,
    transition: {
      ease: "easeOut",
      duration: 0.1,
    }
  },
  exit: {
    opacity: 0,
    // scale: 0.9,
    x: -30,
    transition: {
      duration: 0.1,
      ease: "easeOut",
    }
  }
};

export default function LeafNodeContainer(props: ContainerNodeProps<LeafNodeInternalType>) {
  const { node, isFirst, isLast, parentNodeType, mode } = props
  const { portComponent, layout } = useContainerNodeContext()

  const h = node.config?.height ? node.config?.height + 'px' : 'auto'
  const w = node.config?.width ? node.config?.width + 'px' : 'auto'
  const maxW = node.config?.maxWidth ? node.config?.maxWidth + 'px' : 'auto'
  const maxH = node.config?.maxHeight ? node.config?.maxHeight + 'px' : 'auto'
  const minW = node.config?.minWidth ? node.config?.minWidth + 'px' : 'auto'
  const minH = node.config?.minHeight ? node.config?.minHeight + 'px' : 'auto'

  let adjustment = 0
  switch (layout.type) {
    case 'harness':
      adjustment = layout.leafPortPosition ?? 0
      break

    default:
      adjustment = 0
  }

  const customBeforePortComponent = useMemo(() => {
    return typeof portComponent === 'function'
      ? portComponent({ nodeType: node.type, position: 'before' })
      : portComponent
  }, [node.type, portComponent])

  const customAfterPortComponent = useMemo(() => {
    return typeof portComponent === 'function'
      ? portComponent({ nodeType: node.type, position: 'after' })
      : portComponent
  }, [node.type, portComponent])

  return (
    <motion.div
      variants={itemVariants}
      key={props.node.type + '-' + props.node.path}
      className={'PipelineGraph-LeafContainerNode'}
      style={{
        position: 'relative',
        height: h,
        width: w,
        maxWidth: maxW,
        maxHeight: maxH,
        minWidth: minW,
        minHeight: minH,
        flexShrink: 0 // IMPORTANT: do not remove this
      }}
    >
      {!node.config?.hideLeftPort &&
        (customBeforePortComponent ? (
          customBeforePortComponent({ side: 'left', id: `left-port-${node.path}`, layout, adjustment })
        ) : (
          <Port
            side="left"
            id={`left-port-${node.path}`}
            layout={layout}
            adjustment={adjustment}
            hidden={node.config?.isLeftPortHidden}
          />
        ))}

      {!node.config?.hideRightPort &&
        (customAfterPortComponent ? (
          customAfterPortComponent({ side: 'right', id: `right-port-${node.path}`, layout, adjustment })
        ) : (
          <Port
            side="right"
            id={`right-port-${node.path}`}
            layout={layout}
            adjustment={adjustment}
            hidden={node.config?.isRightPortHidden}
          />
        ))}

      <RenderNodeContent
        node={node}
        isFirst={isFirst}
        isLast={isLast}
        parentNodeType={parentNodeType}
        mode={mode}
        portPosition={adjustment}
      />
    </motion.div>
  )
}
