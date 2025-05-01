import { ComponentProps, HTMLAttributes, ReactNode } from 'react'

import { ButtonGroup } from '@/components'
import { cn } from '@utils/cn'

const EntityFormLayout = {
  Header: function Header({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn('flex flex-col gap-y-5 mb-4', className)}>{children}</div>
  },

  Title: function Title({ children, className }: { children: ReactNode; className?: string }) {
    return <h2 className={cn('text-base leading-none text-cn-foreground-1 font-medium', className)}>{children}</h2>
  },

  Description: function Description({ children }: { children: ReactNode }) {
    return <div className="text-sm text-cn-foreground-3">{children}</div>
  },

  Form: function Form({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('flex flex-col max-w-xl space-y-7', className)} {...props} />
  },

  Footer: function Footer({ className, ...props }: ComponentProps<typeof ButtonGroup>) {
    return <ButtonGroup className={cn('pt-10', className)} {...props} />
  }
}

export { EntityFormLayout }
