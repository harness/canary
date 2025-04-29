import { FC } from 'react'

import { CounterBadge } from '@components/counter-badge'
import { Icon, IconProps } from '@components/icon'
import { Tabs } from '@components/tabs'

interface TabTriggerItemProps {
  value: string
  icon: string // Icon name
  label: string
  badgeCount?: number // Optional badge count
}

const TabTriggerItem: FC<TabTriggerItemProps> = ({ value, icon, label, badgeCount }) => {
  return (
    <Tabs.Trigger value={value} className="gap-x-1.5">
      <div className="flex items-center gap-x-1">
        <Icon size={14} name={icon as IconProps['name']} />
        <span>{label}</span>
      </div>
      {badgeCount !== undefined && <CounterBadge>{badgeCount}</CounterBadge>}
    </Tabs.Trigger>
  )
}

export default TabTriggerItem
