import { FC } from 'react'

import { Badge } from '@components/badge'
import { Icon, IconProps } from '@components/icon'
import { TabsTrigger } from '@components/tabs'
import { Text } from '@components/text'
import { Layout } from '@views/layouts/layout'

interface TabTriggerItemProps {
  value: string
  icon: string // Icon name
  label: string
  badgeCount?: number // Optional badge count
}

const TabTriggerItem: FC<TabTriggerItemProps> = ({ value, icon, label, badgeCount }) => {
  return (
    <TabsTrigger value={value} className="data-[state=active]:bg-background-1">
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
