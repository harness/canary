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
    <div className="grid-col-[1fr_auto] grid cursor-pointer grid-flow-col overflow-hidden rounded-md border">
      {children}
    </div>
  )
}

function Content({ ...props }: ContentProps) {
  const { children } = props

  return (
    <div className="flex items-center bg-background px-2 py-0.5 hover:bg-muted/50">
      <Text size={1} className="text-tertiary-background">
        {children}
      </Text>
    </div>
  )
}

function Icon({ ...props }: IconProps) {
  const { children, handleClick } = props

  return (
    <button
      className="flex items-center border-l bg-background px-1.5 py-0.5 hover:bg-muted/50"
      tabIndex={0}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}

export { Root, Content, Icon }
