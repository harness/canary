// This file is automatically generated. Modifying its content manually is discouraged.
import React from 'react'
import { registerIcon } from '@harnessio/svg-icon'
import type { IconProps } from '@harnessio/svg-icon-react'
import { Icon } from '@harnessio/svg-icon-react'

const name = 'network/noir'

registerIcon(
  name,
  `<svg width="24" height="24" fill="none" stroke-width="1.5" viewBox="0 0 24 24"><rect width="7" height="5" x="3" y="2" stroke="currentColor" rx=".6"/><rect width="7" height="5" x="8.5" y="17" stroke="currentColor" rx=".6"/><rect width="7" height="5" x="14" y="2" stroke="currentColor" rx=".6"/><path stroke="currentColor" d="M6.5 7v3.5a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V7M12 12.5V17"/></svg>`
)

export function Network(props: IconProps) {
  return <Icon name={name} {...props} />
}

Network.prototype.name = name
