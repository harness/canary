import { ComponentPropsWithoutRef, ElementRef, forwardRef, ReactNode } from 'react'

import { Informer, InformerProps } from '@/components'
import { NonEmptyReactNode } from '@/types'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@utils/cn'

export type LabelProps = Omit<ComponentPropsWithoutRef<typeof LabelPrimitive.Root>, 'color'> & {
  disabled?: boolean
  optional?: boolean
  informerProps?: InformerProps
  informerContent?: NonEmptyReactNode
  suffix?: ReactNode
}

const Label = forwardRef<ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, children, optional, disabled, informerContent, informerProps, suffix, ...props }, ref) => {
    if (!children) return null

    const LabelComponent = ({ className }: { className?: string }) => (
      <LabelPrimitive.Root
        ref={ref}
        className={cn('cn-label', { 'cn-label-disabled': disabled }, className)}
        {...props}
      >
        <span className="cn-label-text">{children}</span>
        {optional && <span className="cn-label-optional">(optional)</span>}
      </LabelPrimitive.Root>
    )

    if (informerContent || suffix) {
      return (
        <span className={cn('cn-label-container', className)}>
          <LabelComponent />

          {informerContent && (
            <Informer {...informerProps} className="cn-label-informer" disabled={disabled} content={informerContent} />
          )}

          {suffix}
        </span>
      )
    }

    return <LabelComponent className={className} />
  }
)
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
