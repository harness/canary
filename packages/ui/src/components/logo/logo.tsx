import React from 'react'

import { Icon } from '@components/icon'

import { LogoNameMap } from './logo-name-map'

interface LogoProps {
  name: keyof typeof LogoNameMap
  size?: number
}

const Logo: React.FC<LogoProps> = ({ name, size = 24 }) => {
  const icon = LogoNameMap[name]

  if (!icon) return <Icon name="connectors" size={size} />

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={icon.path} fill={`#${icon.hex}`} />
    </svg>
  )
}

export { Logo }
