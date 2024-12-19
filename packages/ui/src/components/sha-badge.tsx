import { ReactNode } from 'react'

import { Button, Text } from '@/components'
import { cn } from '@utils/cn'

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

  return <div className="grid-col-[1fr_auto] grid grid-flow-col rounded border">{children}</div>
}

function Content({ children, className }: ContentProps) {
  return (
    <div className={cn('flex items-center rounded-l px-2.5 py-[3px] hover:bg-background-3', className)}>
      <Text size={2} className="text-foreground-3">
        {children}
      </Text>
    </div>
  )
}

function Icon({ ...props }: IconProps) {
  const { children, handleClick } = props

  if (!handleClick) {
    return <div className="flex h-full items-center rounded-r border-l px-1.5 py-0.5">{children}</div>
  }

  return (
    <Button
      className="flex h-full items-center rounded-r border-l px-1.5 py-0.5 hover:bg-background-3"
      tabIndex={0}
      onClick={() => handleClick()}
      variant="custom"
      borderRadius="none"
    >
      {children}
    </Button>
  )
}

export { Root, Content, Icon }
