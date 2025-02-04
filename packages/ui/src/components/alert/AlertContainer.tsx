// export interface AlertContainerProps extends PropsWithChildren<VariantProps<typeof alertVariants>> {
//   className?: string
// }

// export const AlertContainer = forwardRef<HTMLDivElement, AlertContainerProps>(
//   ({ className, variant, children }, ref) => (
//     <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)}>
//       {children}
//     </div>
//   )
// )

import { forwardRef, PropsWithChildren, useState } from 'react'

import { Icon } from '@components/icon'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export interface AlertContainerProps extends PropsWithChildren<VariantProps<typeof alertVariants>> {
  className?: string
  closable?: boolean
}

export const AlertContainer = forwardRef<HTMLDivElement, AlertContainerProps>(
  ({ className, variant, children, closable }, ref) => {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
      <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)}>
        {children}
        {closable && (
          <button
            type="button"
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
            onClick={() => setIsVisible(false)}
          >
            <Icon name="close" size={16} />
          </button>
        )}
      </div>
    )
  }
)

AlertContainer.displayName = 'AlertContainer'
