import { FC } from 'react'

import { Badge } from '@components/badge'
import { Icon, IconProps } from '@components/icon'
import { TabsTrigger } from '@components/tabs'

interface TabTriggerItemProps {
  value: string
  icon: string // Icon name
  label: string
  badgeCount?: number // Optional badge count
}

const TabTriggerItem: FC<TabTriggerItemProps> = ({ value, icon, label, badgeCount }) => {
  return (
    <TabsTrigger value={value} className="gap-x-1.5">
      <div className="flex items-center gap-x-1">
        <Icon size={14} name={icon as IconProps['name']} />
        <span>{label}</span>
      </div>
      {badgeCount !== undefined && (
        <Badge variant="outline" size="xs" borderRadius="base">
          {badgeCount}
        </Badge>
      )}
    </TabsTrigger>
  )
}

export default TabTriggerItem
