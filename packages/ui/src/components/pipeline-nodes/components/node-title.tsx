import { FC } from 'react'

import { Text } from '@components/text'

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
        className="mx-9 cursor-pointer truncate pt-1 text-2 font-medium leading-snug text-cn-foreground-3"
        onClick={onHeaderClick}
      >
        {name} <Text as="span">({counter})</Text>
      </div>
    </div>
  )
}
