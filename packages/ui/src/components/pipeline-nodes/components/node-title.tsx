import { FC } from 'react'

import { SerialGroupNodeProps } from '../serial-group-node'

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
        className="mx-8 cursor-pointer truncate pt-0.5 text-14 font-medium leading-snug text-foreground-3"
        onClick={onHeaderClick}
      >
        {name} <span className="text-foreground-5">({counter})</span>
      </div>
    </div>
  )
}
