import { Children, isValidElement, PropsWithChildren, ReactElement } from 'react'

import { Tabs } from '@components/tabs'
import { SandboxLayout } from '@views/layouts/SandboxLayout'

export const PageTabsNavHeader = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
  const validChildren = Children.toArray(children).filter(
    (child): child is ReactElement => isValidElement(child) && child.type === Tabs.Trigger
  )

  return (
    <SandboxLayout.SubHeader className={className}>
      <Tabs.NavRoot>
        <Tabs.List className="border-cn-borders-3 border-b px-6">{validChildren}</Tabs.List>
      </Tabs.NavRoot>
    </SandboxLayout.SubHeader>
  )
}
