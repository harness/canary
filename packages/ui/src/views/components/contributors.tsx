import { Avatar, AvatarTooltipProps, AvatarWithTooltip, Layout, StatusBadge, Text } from '@components/index'

const TooltipContent = ({ contributor }: { contributor: ContributorsProps['contributors'][number] }) => (
  <Layout.Horizontal align="center" justify="between" className="m-cn-3xs">
    <Avatar name={contributor.name || ''} size="lg" rounded />
    <Layout.Vertical gap="2xs">
      <Text>{contributor.name}</Text>
      <Text>{contributor.email}</Text>
    </Layout.Vertical>
  </Layout.Horizontal>
)

export interface ContributorsProps {
  contributors: { name: string; email: string }[]
  maxNames?: number
}

export const Contributors = (props: ContributorsProps) => {
  const { contributors, maxNames = 10 } = props

  if (!contributors || contributors.length === 0) return null

  const contributorsToShow = contributors.length > maxNames ? contributors.slice(0, 10) : contributors

  return (
    <Layout.Horizontal gapX="2xs" align="center">
      <Layout.Flex align="center">
        {contributorsToShow.map(contributor => {
          const tooltipProps: AvatarTooltipProps = {
            side: 'top',
            content: <TooltipContent contributor={contributor} />
          }
          return (
            <AvatarWithTooltip
              key={contributor.email}
              name={contributor.name}
              size="xs"
              rounded
              tooltipProps={tooltipProps}
              className="[&:not(:first-child)]:-ml-cn-3xs"
            />
          )
        })}
      </Layout.Flex>

      <Text variant="body-single-line-normal">Contributors</Text>
      <StatusBadge variant="outline" theme="info" size="sm">
        {contributors.length}
      </StatusBadge>
    </Layout.Horizontal>
  )
}
