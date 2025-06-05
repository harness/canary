import { Progress, Text } from '@/components'

interface RootProps {
  children: React.ReactNode
  className?: string
}

interface BarProps {
  total: number
  filled: number
  className?: string
}

function Root({ ...props }: RootProps) {
  const { children } = props

  return <div className="flex w-[110px] flex-col justify-center gap-1">{children}</div>
}

function Content({ ...props }: RootProps) {
  const { children } = props

  return (
    <div className="flex justify-center leading-snug">
      <Text truncate className="text-cn-foreground-1/70">
        {children}
      </Text>
    </div>
  )
}
function Bar({ total, filled }: BarProps) {
  const percentageFilled = filled / total

  return <Progress value={percentageFilled} size="sm" hideIcon hidePercentage />
}

export { Root, Content, Bar }
