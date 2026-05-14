import { ComponentPropsWithoutRef, ElementRef, forwardRef, useCallback, useEffect, useRef } from 'react'

import { usePortal, useRegisterDialog } from '@/context'
import { cn, useMergeRefs } from '@/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { Drawer as DrawerPrimitive } from 'vaul'

import { DEFAULT_MAX_STACK_DEPTH, DRAWER_SIZE_ORDER, useDrawerContext } from './drawer-context'
import { DrawerOverlay } from './DrawerOverlay'

const DRAWER_SCALE_FACTOR = 0.990741
const DRAWER_TRANSLATE_PER_LEVEL = 16

function getDrawerTransform(dir: string, depth: number): string {
  if (depth <= 0) return 'scale(1) translate3d(0px, 0px, 0px)'
  const scale = Math.pow(DRAWER_SCALE_FACTOR, depth)
  const translate = DRAWER_TRANSLATE_PER_LEVEL * depth
  switch (dir) {
    case 'right':
      return `scale(${scale}) translate3d(-${translate}px, 0px, 0px)`
    case 'left':
      return `scale(${scale}) translate3d(${translate}px, 0px, 0px)`
    case 'top':
      return `scale(${scale}) translate3d(0px, ${translate}px, 0px)`
    case 'bottom':
      return `scale(${scale}) translate3d(0px, -${translate}px, 0px)`
    default:
      return `scale(${scale}) translate3d(-${translate}px, 0px, 0px)`
  }
}

const DRAWER_TRANSFORM_DEFAULT = 'scale(1) translate3d(0px, 0px, 0px)'
const DRAWER_EASING = '500ms cubic-bezier(0.32, 0.72, 0, 1)'
const DRAWER_TRANSITION = `transform ${DRAWER_EASING}, min-width ${DRAWER_EASING}`

const DRAWER_EXPAND_DELAY = 64
const DRAWER_COLLAPSE_DELAY = 192

const drawerContentVariants = cva('cn-drawer-content', {
  variants: {
    size: {
      '2xs': 'cn-drawer-content-2xs',
      xs: 'cn-drawer-content-xs',
      sm: 'cn-drawer-content-sm',
      md: 'cn-drawer-content-md',
      lg: 'cn-drawer-content-lg',
      xl: 'cn-drawer-content-xl',
      full: 'cn-drawer-content-full'
    },
    direction: {
      right: 'cn-drawer-content-right',
      left: 'cn-drawer-content-left',
      top: 'cn-drawer-content-top',
      bottom: 'cn-drawer-content-bottom'
    }
  },
  defaultVariants: {
    size: 'sm',
    direction: 'right'
  }
})

export type DrawerContentVariantsSize = VariantProps<typeof drawerContentVariants>['size']
export type DrawerContentVariantsDirection = VariantProps<typeof drawerContentVariants>['direction']

export type DrawerContentProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
  size?: DrawerContentVariantsSize
  overlayClassName?: string
  forceWithOverlay?: boolean
}

export const DrawerContent = forwardRef<ElementRef<typeof DrawerPrimitive.Content>, DrawerContentProps>(
  (
    {
      className,
      children,
      size = 'sm',
      overlayClassName,
      forceWithOverlay = false,
      onOpenAutoFocus,
      onCloseAutoFocus: _onCloseAutoFocus,
      ...props
    },
    _ref
  ) => {
    const contentRef = useRef<HTMLDivElement>(null)
    const { portalContainer } = usePortal()
    const { direction, modal, hasOpenChild, maxDescendantSize, reportContentSize, openDescendantCount, maxStackDepth } =
      useDrawerContext()
    const maxVisualPush = (maxStackDepth ?? DEFAULT_MAX_STACK_DEPTH) - 1
    const clampedDescendantCount = Math.min(openDescendantCount ?? 0, maxVisualPush)
    const isCoveredByDescendant = (openDescendantCount ?? 0) > maxVisualPush
    const ref = useMergeRefs([_ref, contentRef])

    // Report this drawer's size so ancestors can compute the widest in the stack
    useEffect(() => {
      if (size && reportContentSize) {
        reportContentSize(size)
      }
    }, [size, reportContentSize])

    // Expand to peek behind a wider descendant drawer.
    // The translate offset between adjacent depth levels already creates the visual peek,
    // so min-width just needs to match the widest descendant — no additional offset needed.
    const isHorizontal = direction === 'right' || direction === 'left'
    const peekMinWidth = (() => {
      if (!hasOpenChild || !isHorizontal || !maxDescendantSize || !size || isCoveredByDescendant) return undefined
      const myIdx = DRAWER_SIZE_ORDER.indexOf(size as (typeof DRAWER_SIZE_ORDER)[number])
      const maxIdx = DRAWER_SIZE_ORDER.indexOf(maxDescendantSize as (typeof DRAWER_SIZE_ORDER)[number])
      if (myIdx === -1 || maxIdx === -1 || myIdx >= maxIdx) return undefined
      return `var(--cn-drawer-${maxDescendantSize})`
    })()

    // Use ref to avoid stale closures in MutationObserver
    const hasOpenChildRef = useRef(hasOpenChild)
    const directionRef = useRef(direction)
    const descendantCountRef = useRef(clampedDescendantCount)

    useEffect(() => {
      hasOpenChildRef.current = hasOpenChild
      directionRef.current = direction
      descendantCountRef.current = clampedDescendantCount
    }, [hasOpenChild, direction, clampedDescendantCount])

    // Apply min-width separately from the MutationObserver to avoid infinite loops.
    // CSS can't transition from 'auto' to a length, so we seed a concrete starting
    // value (current width) before enabling the transition on the next frame.
    useEffect(() => {
      if (!contentRef.current) return
      const element = contentRef.current

      if (peekMinWidth) {
        element.style.minWidth = `${element.offsetWidth}px`
        element.style.transition = 'none'

        let rafId: number
        const expandDelay = setTimeout(() => {
          element.style.transition = DRAWER_TRANSITION
          rafId = requestAnimationFrame(() => {
            element.style.minWidth = peekMinWidth
          })
        }, DRAWER_EXPAND_DELAY)

        return () => {
          clearTimeout(expandDelay)
          cancelAnimationFrame(rafId)
        }
      } else if (element.style.minWidth) {
        element.style.minWidth = `${element.offsetWidth}px`
        element.style.transition = 'none'

        let rafId: number
        const collapseDelay = setTimeout(() => {
          element.style.transition = DRAWER_TRANSITION
          rafId = requestAnimationFrame(() => {
            element.style.minWidth = '0px'
          })
        }, DRAWER_COLLAPSE_DELAY)

        const onEnd = (e: TransitionEvent) => {
          if (e.propertyName === 'min-width') {
            element.style.minWidth = ''
            element.removeEventListener('transitionend', onEnd)
          }
        }
        element.addEventListener('transitionend', onEnd)

        return () => {
          clearTimeout(collapseDelay)
          cancelAnimationFrame(rafId)
          element.removeEventListener('transitionend', onEnd)
        }
      }
    }, [peekMinWidth])

    useEffect(() => {
      if (!contentRef.current) return

      const element = contentRef.current

      const applyTransform = () => {
        const dir = directionRef.current
        const depth = descendantCountRef.current ?? 0
        element.style.transform = getDrawerTransform(dir ?? 'right', depth)
        element.style.transition = DRAWER_TRANSITION
      }

      if (hasOpenChild) {
        applyTransform()

        const observer = new MutationObserver(() => {
          applyTransform()
        })

        observer.observe(element, {
          attributes: true,
          attributeFilter: ['style']
        })

        return () => {
          observer.disconnect()
        }
      } else {
        const resetDelay = setTimeout(() => {
          element.style.transition = DRAWER_TRANSITION
          element.style.transform = DRAWER_TRANSFORM_DEFAULT
        }, DRAWER_COLLAPSE_DELAY)

        return () => {
          clearTimeout(resetDelay)
        }
      }
    }, [hasOpenChild, clampedDescendantCount])

    const { handleCloseAutoFocus } = useRegisterDialog()

    const onCloseAutoFocus = useCallback(
      (e: Event) => {
        handleCloseAutoFocus()
        _onCloseAutoFocus?.(e)
      },
      [_onCloseAutoFocus, handleCloseAutoFocus]
    )

    const withCustomOverlay = forceWithOverlay && modal === false

    const Content = (
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          drawerContentVariants({ size, direction: direction as DrawerContentVariantsDirection }),
          className
        )}
        {...props}
        onCloseAutoFocus={onCloseAutoFocus}
        onOpenAutoFocus={e => {
          e.preventDefault()
          onOpenAutoFocus?.(e)
          if (!contentRef.current || onOpenAutoFocus) return
          contentRef.current.focus()
        }}
      >
        {children}
      </DrawerPrimitive.Content>
    )

    return (
      <DrawerPrimitive.Portal container={portalContainer}>
        {/* !!! */}
        {/* For the scroll to work when using the Drawer with modal === true in Shadow DOM, the Overlay needs to wrap the Content */}
        {/* Here’s the issue for the scroll bug in Shadow DOM, works same for Vaul - https://github.com/radix-ui/primitives/issues/3353 */}
        {modal ? (
          <DrawerOverlay className={overlayClassName} withCustomOverlay={withCustomOverlay}>
            {Content}
          </DrawerOverlay>
        ) : (
          <>
            <DrawerOverlay className={overlayClassName} withCustomOverlay={withCustomOverlay} />
            {Content}
          </>
        )}
      </DrawerPrimitive.Portal>
    )
  }
)
DrawerContent.displayName = 'DrawerContent'
