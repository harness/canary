import React from 'react'

import { DraggableAttributes } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@utils/cn'

interface DraggableItemProps {
  id: string
  children: (props: { attributes: DraggableAttributes; listeners: SyntheticListenerMap }) => React.ReactNode
  tag: 'button' | 'div' | 'li'
  className?: string
}

export const DraggableItem = ({ id, children, tag: Tag = 'div', className }: DraggableItemProps) => {
  const {
    attributes,
    listeners = {},
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }
  return (
    <Tag className={cn('relative', isDragging && 'z-10', className)} ref={setNodeRef} style={style}>
      {children({ attributes, listeners })}
    </Tag>
  )
}
