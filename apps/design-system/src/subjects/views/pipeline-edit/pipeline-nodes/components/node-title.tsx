import { FC } from 'react'

import { SerialGroupNodeProps } from '@subjects/views/pipeline-edit/pipeline-nodes/serial-group-node.tsx'

export interface NodeTitleProps extends Pick<SerialGroupNodeProps, 'name' | 'onHeaderClick'> {
  counter?: number
}

export const NodeTitle: FC<NodeTitleProps> = ({ name, onHeaderClick, counter }) => {
  return (
    <div className="absolute inset-x-0 top-0 h-0 px-2.5 pt-2.5">
      <div
        role="button"
        tabIndex={0}
        title={name}
        className="text-foreground-3 text-14 cursor-pointer truncate px-8 pt-0.5 font-medium leading-snug"
        onClick={onHeaderClick}
      >
        {name} <span className="text-foreground-5">({counter})</span>
      </div>
    </div>
  )
}
