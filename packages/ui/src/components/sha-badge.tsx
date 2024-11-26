import { Text } from '@/components'

interface RootProps {
  children: React.ReactNode
  className?: string
}

interface IconProps {
  children: React.ReactNode
  handleClick?: () => void
  className?: string
}

interface ContentProps {
  children: React.ReactNode
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
    <div className="bg-background hover:bg-muted/50 flex items-center px-2 py-0.5">
      <Text size={1} className="text-tertiary-background">
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
      onClick={handleClick && handleClick}
      className="bg-background hover:bg-muted/50 flex items-center border-l px-1.5 py-0.5"
    >
      {children}
    </div>
  )
}

export { Root, Content, Icon }
