import { Badge, Icon, IconProps, TabsTrigger, Text } from '@harnessio/canary'

import { Layout } from './layout/layout'

interface TabTriggerItemProps {
  value: string
  icon: string // Icon name
  label: string
  badgeCount?: number // Optional badge count
}

const TabTriggerItem: React.FC<TabTriggerItemProps> = ({ value, icon, label, badgeCount }) => {
  return (
    <TabsTrigger value={value}>
      <Layout.Horizontal className="items-center">
        <div>
          <Icon size={16} name={icon as IconProps['name']} />
        </div>
        <Text size={2}>{label}</Text>
        {badgeCount !== undefined && (
          <Badge variant="outline" size="xs">
            {badgeCount}
          </Badge>
        )}
      </Layout.Horizontal>
    </TabsTrigger>
  )
}

export default TabTriggerItem
