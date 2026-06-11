import { ComponentPropsWithoutRef, ElementRef, forwardRef, useCallback, useLayoutEffect, useRef } from 'react'

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

const DRAWER_EASING = 'cubic-bezier(0.32, 0.72, 0, 1)'
const DRAWER_DURATION = 500

/**
 * Animate a single CSS property from its current visual value to a target.
 * Reads the live computed value (including fill from any running animation),
 * cancels the previous animation, then starts a new one.
 * Uses fill:'both' so it holds the first keyframe during delay and last keyframe after finish.
 */
function animateProp(
  el: HTMLElement,
  prev: Animation | null,
  prop: 'width' | 'transform',
  to: string,
  cancelOnFinish: boolean
): Animation | null {
  if (!el.animate) return null
  // Read the current visual value (includes fill from running animation) for a smooth transition start
  const from = getComputedStyle(el)[prop]
  if (prev) {
    prev.cancel()
    // After cancel the fill is gone; the element reverts to its CSS base value.
    // We must always re-apply animation to hold the target, even if `from === to`.
  } else if (from === to) {
    return null
  }
  const anim = el.animate([{ [prop]: from }, { [prop]: to }], {
    duration: DRAWER_DURATION,
    easing: DRAWER_EASING,
    fill: 'both'
  })
  if (cancelOnFinish) {
    anim.onfinish = () => anim.cancel()
  }
  return anim
}

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
    const {
      direction,
      modal,
      hasOpenChild,
      topmostDescendantSize,
      reportContentSize,
      openDescendantCount,
      maxStackDepth
    } = useDrawerContext()
    const maxVisualPush = (maxStackDepth ?? DEFAULT_MAX_STACK_DEPTH) - 1
    const clampedDescendantCount = Math.min(openDescendantCount ?? 0, maxVisualPush)
    const isCoveredByDescendant = (openDescendantCount ?? 0) > maxVisualPush
    const ref = useMergeRefs([_ref, contentRef])

    useLayoutEffect(() => {
      if (size && reportContentSize) {
        reportContentSize(size)
      }
    }, [size, reportContentSize])

    const isHorizontal = direction === 'right' || direction === 'left'

    // Which size token should this drawer display as?
    // Active: match the topmost descendant. Resting: use own size.
    const targetSizeToken = (() => {
      if (!hasOpenChild || !isHorizontal || !topmostDescendantSize || !size || isCoveredByDescendant) return undefined
      const myIdx = DRAWER_SIZE_ORDER.indexOf(size as (typeof DRAWER_SIZE_ORDER)[number])
      const topIdx = DRAWER_SIZE_ORDER.indexOf(topmostDescendantSize as (typeof DRAWER_SIZE_ORDER)[number])
      if (myIdx === -1 || topIdx === -1 || myIdx === topIdx) return undefined
      return topmostDescendantSize
    })()

    const targetTransform = hasOpenChild ? getDrawerTransform(direction ?? 'right', clampedDescendantCount) : undefined

    const widthAnimRef = useRef<Animation | null>(null)
    const transformAnimRef = useRef<Animation | null>(null)
    const isFirstRender = useRef(true)

    useLayoutEffect(() => {
      if (!contentRef.current) return
      const el = contentRef.current

      if (isFirstRender.current) {
        isFirstRender.current = false
        // Skip animation on first render only if in resting state (no child open).
        // If a child opened before this effect could fire (e.g. due to Portal mount
        // timing), we must animate immediately.
        if (!hasOpenChild) return
      }

      // Release fill when returning to resting state so Vaul's exit animations can take over
      const isResting = !hasOpenChild

      // Target width: always resolve from the CSS custom property (px value).
      // Active state → topmost descendant's size token. Resting → own size token.
      const widthToken = targetSizeToken ?? (size as string)
      const toWidth = getComputedStyle(el).getPropertyValue(`--cn-drawer-${widthToken}`).trim()

      widthAnimRef.current = animateProp(el, widthAnimRef.current, 'width', toWidth, isResting)

      // Target transform: stacked position or identity
      const toTransform = targetTransform ?? 'scale(1) translate3d(0px, 0px, 0px)'
      transformAnimRef.current = animateProp(el, transformAnimRef.current, 'transform', toTransform, isResting)
    }, [targetSizeToken, targetTransform, hasOpenChild, size, direction, clampedDescendantCount])

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
        {/* Here's the issue for the scroll bug in Shadow DOM, works same for Vaul - https://github.com/radix-ui/primitives/issues/3353 */}
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
