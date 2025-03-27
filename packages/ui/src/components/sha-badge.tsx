import { ReactNode } from 'react'

import { Button } from '@/components'
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
  asChild?: boolean
}

function Root({ ...props }: RootProps) {
  const { children } = props

  return <div className="grid-col-[1fr_auto] grid grid-flow-col rounded border">{children}</div>
}

function Content({ children, className, asChild }: ContentProps) {
  return (
<<<<<<< HEAD
    <div className={cn('flex items-center rounded-l px-2.5 py-[3px] hover:bg-cn-background-3', className)}>
      {asChild ? children : <span className="text-14 text-cn-foreground-3">{children}</span>}
=======
    <div className={cn('flex items-center rounded-l px-2.5 py-[3px] hover:bg-cds-background-3', className)}>
      {asChild ? children : <span className="text-14 text-foreground-3">{children}</span>}
>>>>>>> b1385c7b8 (Update bg-background variants to bg-cds-background containing new colors)
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
<<<<<<< HEAD
      className="flex h-full items-center rounded-r border-l px-1.5 py-0.5 hover:bg-cn-background-3"
=======
      className="flex h-full items-center rounded-r border-l px-1.5 py-0.5 hover:bg-cds-background-3"
>>>>>>> b1385c7b8 (Update bg-background variants to bg-cds-background containing new colors)
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
