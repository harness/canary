import { Avatar, AvatarTooltipProps, AvatarWithTooltip, Layout, Tag, Text } from '@components/index'

export interface ContributorsProps {
  contributors: { name: string; email: string }[]
  maxNames?: number
}

export const Contributors = (props: ContributorsProps) => {
  const { contributors, maxNames = 10 } = props

  if (!contributors || contributors.length === 0) return null

  const contributorsToShow = contributors.length > maxNames ? contributors.slice(0, 10) : contributors

  return (
    <Layout.Horizontal gapX="2xs" align={'center'}>
      {contributorsToShow.map((contributor, idx) => {
        const tooltipProps: AvatarTooltipProps = {
          side: 'top',
          content: (
            <Layout.Horizontal align="center" justify="between" className="m-1">
              <Avatar name={contributor.name || ''} size="lg" rounded />
              <Layout.Vertical gap="2xs">
                <Text>{contributor.name}</Text>
                <Text>{contributor.email}</Text>
              </Layout.Vertical>
            </Layout.Horizontal>
          )
        }
        return (
          <AvatarWithTooltip
            key={contributor.email}
            name={contributor.name}
            size="md"
            rounded
            tooltipProps={tooltipProps}
            className={idx !== 0 ? '-ml-3' : undefined}
          />
        )
      })}
      <Text>Contributors</Text>
      <Tag value={`${contributors.length}`} theme={'blue'} className="px-1" />
    </Layout.Horizontal>
  )
}
