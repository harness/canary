import { forwardRef, HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/utils'

/**
 * Legacy composition API — pass any content (e.g. `ButtonLayout`) as children.
 */
export type DrawerFooterLegacyProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode
}

/**
 * Structured API — a single standardized footer action bar driven by props. Every button is
 * optional; the layout (ghost button pinned left, secondary + primary right-aligned) and spacing
 * stay fixed regardless of which buttons are present. Prefer this for new usage.
 */
export interface DrawerFooterStructuredProps {
  /** Primary action — right-aligned, rendered last (rightmost). */
  primaryButton?: ReactNode
  /** Secondary action — right-aligned, rendered to the left of the primary button. */
  secondaryButton?: ReactNode
  /**
   * Ghost button pinned to the far left of the action bar — reserved for a backward action
   * (e.g. a ghost `Back`) or a cancel/close when the secondary slot isn't already one.
   */
  ghostButton?: ReactNode
  /** Optional custom content rendered above the action bar (the footer "slot"). */
  children?: ReactNode
  className?: string
}

export type DrawerFooterProps = DrawerFooterLegacyProps | DrawerFooterStructuredProps

/** Structured mode is selected when any footer button prop is provided; otherwise children compose the footer. */
const isStructured = (props: DrawerFooterProps): props is DrawerFooterStructuredProps =>
  'primaryButton' in props || 'secondaryButton' in props || 'ghostButton' in props

export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>((props, ref) => {
  if (isStructured(props)) {
    const { primaryButton, secondaryButton, ghostButton, children, className } = props
    const hasActions = !!ghostButton || !!secondaryButton || !!primaryButton

    return (
      <div className={cn('cn-drawer-footer', className)} ref={ref}>
        {children}
        {hasActions && (
          <div className="cn-drawer-footer-action-bar">
            {ghostButton}
            <div className="cn-drawer-footer-actions">
              {secondaryButton}
              {primaryButton}
            </div>
          </div>
        )}
      </div>
    )
  }

  const { className, ...rest } = props
  return <div className={cn('cn-drawer-footer', className)} ref={ref} {...rest} />
})
DrawerFooter.displayName = 'DrawerFooter'
