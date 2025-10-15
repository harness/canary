import { FC } from 'react'

import { Text } from '@components/text'

import { SerialGroupNodeProps } from '../serial-group-node'

export interface NodeTitleProps extends Pick<SerialGroupNodeProps, 'name' | 'onHeaderClick'> {
  counter?: number
}

export const NodeTitle: FC<NodeTitleProps> = ({ name, onHeaderClick, counter }) => {
  return (
    <div className="absolute inset-x-0 top-0 h-0 p-sn-sm">
      <div
        role="button"
        tabIndex={0}
        title={name}
        className="mx-cn-3xl cursor-pointer truncate pt-cn-3xs text-2 font-medium leading-snug text-cn-3"
        onClick={onHeaderClick}
      >
        {name} <Text as="span">({counter})</Text>
      </div>
    </div>
  )
}
