import { forwardRef, ReactNode } from 'react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@utils/cn'

import { Card, CardRootProps } from './card'

export interface InfoCardProps extends Omit<CardRootProps, 'children'> {
  /**
   * Unique identifier for the card (required for drag and drop)
   */
  id: string

  /**
   * Title of the card
   */
  title?: string

  /**
   * Description or content of the card
   */
  description?: string

  /**
   * Optional icon to display in the card
   */
  icon?: ReactNode

  /**
   * Optional image source for the card
   */
  imageSrc?: string

  /**
   * Optional image alt text
   */
  imageAlt?: string

  /**
   * Whether the card is draggable
   */
  draggable?: boolean

  /**
   * Optional footer content
   */
  footer?: ReactNode

  /**
   * Optional action buttons or content
   */
  actions?: ReactNode

  /**
   * Optional additional content
   */
  children?: ReactNode
}

/**
 * InfoCard component that can be used with drag and drop functionality
 */
export const InfoCard = forwardRef<HTMLDivElement, InfoCardProps>(
  (
    {
      id,
      className,
      title,
      description,
      icon,
      imageSrc,
      imageAlt,
      draggable = false,
      footer,
      actions,
      children,
      ...cardProps
    },
    ref
  ) => {
    // Always call useSortable to avoid the React Hook conditional call error
    // but only use its values when draggable is true
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

    // Apply drag styles if draggable
    const style =
      draggable && transform
        ? {
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.5 : 1
          }
        : {}

    // Forward the ref to either the sortable node or the card directly
    const cardRef = draggable ? setNodeRef : ref

    return (
      <Card.Root
        ref={cardRef as React.Ref<HTMLDivElement>}
        className={cn('info-card', isDragging && 'z-10', className)}
        style={style}
        {...cardProps}
      >
        {imageSrc && <Card.Image src={imageSrc} alt={imageAlt || ''} />}

        <Card.Content>
          <div className="flex items-center gap-2">
            {draggable && (
              <div className="cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
                <svg className="size-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                </svg>
              </div>
            )}

            {icon && <div className="info-card-icon">{icon}</div>}

            {title && <Card.Title className="info-card-title">{title}</Card.Title>}
          </div>

          {description && <p className="info-card-description mt-2">{description}</p>}

          {children}

          {actions && <div className="info-card-actions mt-4">{actions}</div>}

          {footer && <div className="info-card-footer mt-4 border-t pt-3">{footer}</div>}
        </Card.Content>
      </Card.Root>
    )
  }
)

InfoCard.displayName = 'InfoCard'

/**
 * DraggableInfoCard is a wrapper component that makes InfoCard draggable
 * It's a convenience component that sets the draggable prop to true
 */
export const DraggableInfoCard = forwardRef<HTMLDivElement, InfoCardProps>((props, ref) => (
  <InfoCard {...props} draggable={true} ref={ref} />
))

DraggableInfoCard.displayName = 'DraggableInfoCard'
