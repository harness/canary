import { ReactNode } from 'react'

import { Text } from '@/components'

interface RootProps {
  children: ReactNode
  className?: string
}

interface IconProps {
  children: ReactNode
  handleClick?: () => void
  className?: string
}

interface ContentProps {
  children: ReactNode
  className?: string
}

function Root({ ...props }: RootProps) {
  const { children } = props

  return (
    <div className="grid-col-[1fr_auto] grid cursor-pointer grid-flow-col overflow-hidden rounded border">
      {children}
    </div>
  )
}

function Content({ ...props }: ContentProps) {
  const { children } = props

  return (
    <div className="flex items-center px-2.5 py-[3px] hover:bg-background-3">
      <Text size={2} className="text-foreground-3">
        {children}
      </Text>
    </div>
  )
}

function Icon({ ...props }: IconProps) {
  const { children, handleClick } = props

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => handleClick?.()}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick?.()
        }
      }}
      className="flex items-center border-l px-1.5 py-0.5 hover:bg-background-3"
    >
      {children}
    </div>
  )
}

export { Root, Content, Icon }
