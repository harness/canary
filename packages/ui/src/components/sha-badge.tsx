import { ReactNode } from 'react'

import { Button, ButtonSizes } from '@/components'

interface RootProps {
  children: ReactNode
  className?: string
}

interface IconProps {
  children: ReactNode
  handleClick?: () => void
  className?: string
  size?: ButtonSizes
}

interface ContentProps {
  children: ReactNode
  className?: string
  asChild?: boolean
}

function Root(props: RootProps) {
  const { children } = props

  return <div className="grid-col-[1fr_auto] grid grid-flow-col items-center rounded border">{children}</div>
}

function Content({ children, className, asChild }: ContentProps) {
  return (
    <div className={className}>
      {asChild ? children : <span className="text-14 text-cn-foreground-3">{children}</span>}
    </div>
  )
}

function Icon(props: IconProps) {
  const { children, handleClick, size } = props

  return (
    <Button variant="ghost" size={size} iconOnly tabIndex={0} onClick={() => handleClick?.()}>
      {children}
    </Button>
  )
}

export { Root, Content, Icon }
