import {
  createContext,
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

import { cn } from '@utils/cn'

interface StickyListSectionRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  contained?: boolean
}

interface StickyListSectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

interface StickyListSectionContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

interface StickyListSectionHeaderContextType {
  isStuck: boolean
}

const StickyListSectionHeaderContext = createContext<StickyListSectionHeaderContextType>({
  isStuck: false
})

const StickyListSectionRoot = forwardRef<HTMLDivElement, StickyListSectionRootProps>(
  ({ children, className, contained, ...rest }, ref) => {
    const sentinelRef = useRef<HTMLDivElement>(null)
    const [isStuck, setIsStuck] = useState(false)

    const handleIntersection = useCallback(([entry]: IntersectionObserverEntry[]) => {
      setIsStuck(!entry.isIntersecting)
    }, [])

    useEffect(() => {
      const sentinel = sentinelRef.current
      if (!sentinel) return

      const observer = new IntersectionObserver(handleIntersection, {
        threshold: 0
      })

      observer.observe(sentinel)
      return () => observer.disconnect()
    }, [handleIntersection])

    return (
      <div
        ref={ref}
        className={cn('cn-sticky-list-section', { 'cn-sticky-list-section-contained': contained }, className)}
        data-stuck={isStuck}
        {...rest}
      >
        <div ref={sentinelRef} className="cn-sticky-list-section-sentinel" aria-hidden="true" />
        <StickyListSectionHeaderContext.Provider value={{ isStuck }}>
          {children}
        </StickyListSectionHeaderContext.Provider>
      </div>
    )
  }
)

StickyListSectionRoot.displayName = 'StickyListSection.Root'

const StickyListSectionHeader = forwardRef<HTMLDivElement, StickyListSectionHeaderProps>(
  ({ children, className, ...props }, ref) => {
    const { isStuck } = useContext(StickyListSectionHeaderContext)

    return (
      <div
        ref={ref}
        className={cn('cn-sticky-list-section-header', { 'cn-sticky-list-section-header-stuck': isStuck }, className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

StickyListSectionHeader.displayName = 'StickyListSection.Header'

const StickyListSectionContent = forwardRef<HTMLDivElement, StickyListSectionContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('cn-sticky-list-section-content', className)} {...props}>
        {children}
      </div>
    )
  }
)

StickyListSectionContent.displayName = 'StickyListSection.Content'

const StickyListSection = {
  Root: StickyListSectionRoot,
  Header: StickyListSectionHeader,
  Content: StickyListSectionContent
}

export { StickyListSection }
export type { StickyListSectionRootProps, StickyListSectionHeaderProps, StickyListSectionContentProps }
