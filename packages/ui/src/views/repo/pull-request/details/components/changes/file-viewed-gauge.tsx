import { Layout, Progress, Text } from '@/components'

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

  return (
    <Layout.Vertical justify="center" gap="sm">
      {children}
    </Layout.Vertical>
  )
}

function Content({ ...props }: RootProps) {
  const { children } = props

  return (
    <Text as="p" variant="body-single-line-normal" className="py-cn-3xs">
      {children}
    </Text>
  )
}
function Bar({ total, filled }: BarProps) {
  const percentageFilled = filled / total

  return <Progress value={percentageFilled} size="sm" hideIcon hidePercentage />
}

export { Root, Content, Bar }
