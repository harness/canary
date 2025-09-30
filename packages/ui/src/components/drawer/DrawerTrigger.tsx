import { forwardRef, HTMLAttributes } from 'react'

import { TriggerBase } from '@/context'
import { Drawer as DrawerPrimitive } from 'vaul'

export const DrawerTrigger = forwardRef<HTMLButtonElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => {
    return (
      <TriggerBase ref={ref} {...props} TriggerComponent={DrawerPrimitive.Trigger}>
        {children}
      </TriggerBase>
    )
  }
)
DrawerTrigger.displayName = 'Dialog.Trigger'
