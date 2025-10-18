import { HTMLAttributes, ReactNode } from 'react'

import { Text } from '@components/text'
import { cn } from '@utils/cn'

const EntityFormLayout = {
  Header: function Header({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn('flex flex-col gap-y-5 mb-cn-md', className)}>{children}</div>
  },

  Title: function Title({ children, className }: { children: ReactNode; className?: string }) {
    return <h2 className={cn('text-base leading-none text-cn-1 font-medium', className)}>{children}</h2>
  },

  Description: function Description({ children }: { children: ReactNode }) {
    return (
      <Text as="div" color="foreground-3">
        {children}
      </Text>
    )
  },

  Form: function Form({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('flex flex-col max-w-xl space-y-7', className)} {...props} />
  },

  Footer: function Footer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('flex flex-col max-w-xl gap-3 pt-cn-3xl', className)} {...props} />
  }
}

export { EntityFormLayout }
