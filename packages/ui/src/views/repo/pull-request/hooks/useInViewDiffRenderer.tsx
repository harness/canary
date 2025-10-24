import { RefObject, useCallback, useEffect, useRef } from 'react'

import { useResizeObserver } from '@hooks/use-resize-observer'

interface UseInViewDiffRendererOptions {
  rootMargin?: string
}

interface UseInViewDiffRendererResult {
  /** Ref for the container element that intersection observer watches */
  containerRef: RefObject<HTMLDivElement>
  /** Ref for the content element that gets serialized/restored */
  contentRef: RefObject<HTMLDivElement>
  /** Current visibility state from intersection observer */
  inView: boolean
  /** Whether content should be rendered (true when in view OR first time render) */
  shouldRender: boolean
}

// CSS custom property for tracking block height
const BLOCK_HEIGHT = '--block-height'
// CSS class applied to placeholder content
const PLACEHOLDER_CLASS = 'diff-viewer-placeholder'

/**
 * virtualization for diff viewers using intersection observer.
 * - Improves performance by only rendering diff content when visible in viewport
 * - Serializes/deserializes DOM content to maintain scroll position while reducing memory usage
 * - Tracks height changes to maintain layout stability during virtualization
 */
export function useInViewDiffRenderer(options: UseInViewDiffRendererOptions = {}): UseInViewDiffRendererResult {
  const { rootMargin = '1000px 0px 1000px 0px' } = options

  const containerRef = useRef<HTMLDivElement>(null) // Watched by intersection observer
  const contentRef = useRef<HTMLDivElement>(null) // Contains actual diff content
  const contentHTML = useRef<string | null>(null) // Serialized HTML when out of view
  const inViewRef = useRef(false) // Current intersection state
  const observerRef = useRef<IntersectionObserver | null>(null) // Observer instance

  // Track height changes using ResizeObserver for layout stability
  // Sets CSS custom property --block-height for external styling
  useResizeObserver(
    contentRef,
    useCallback((dom: HTMLDivElement) => {
      if (dom) {
        // Store current height as CSS custom property for styling
        dom.style.setProperty(BLOCK_HEIGHT, dom.clientHeight + 'px')
      }
    }, [])
  )

  // Setup intersection observer for viewport detection
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create intersection observer to detect when diff enters/exits viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasInView = inViewRef.current
        const isInView = entry.isIntersecting
        inViewRef.current = isInView

        // Only trigger visibility change when state actually changes
        if (wasInView !== isInView) {
          handleVisibilityChange(isInView)
        }
      },
      {
        // rootMargin allows triggering before element fully enters viewport
        // Useful for preloading content as user scrolls
        rootMargin
      }
    )

    observer.observe(container)
    observerRef.current = observer

    // Cleanup observer on unmount
    return () => {
      observer.disconnect()
      observerRef.current = null
    }
  }, [rootMargin])

  /**
   * Handles content serialization/deserialization when visibility changes
   *
   * **Coming into view (isInView = true):**
   * - Restores serialized HTML content
   * - Removes placeholder styling
   * - Clears serialized state
   *
   * **Going out of view (isInView = false):**
   * - Serializes current innerHTML
   * - Creates lightweight placeholder with same height
   * - Replaces content with placeholder to maintain layout
   *
   * @param isInView Whether the element is currently visible in viewport
   */
  const handleVisibilityChange = useCallback((isInView: boolean) => {
    const content = contentRef.current
    if (!content) return

    if (isInView) {
      // Restore content when coming into view
      if (contentHTML.current) {
        // Restore serialized HTML content
        content.innerHTML = contentHTML.current
        contentHTML.current = null

        // Remove placeholder styling to restore normal appearance
        content.classList.remove(PLACEHOLDER_CLASS)
        content.style.removeProperty('height')
        content.style.removeProperty('overflow')
      }
    } else {
      // Serialize content when going out of view
      if (!contentHTML.current) {
        const { clientHeight, textContent, innerHTML } = content

        // Save current HTML content for later restoration
        contentHTML.current = innerHTML

        // Create placeholder that maintains layout but uses minimal resources
        const placeholder = createPlaceholder(textContent || '', clientHeight)

        // Replace actual content with lightweight placeholder
        content.innerHTML = ''
        content.appendChild(placeholder)
        content.classList.add(PLACEHOLDER_CLASS)
      }
    }
  }, [])

  const createPlaceholder = (textContent: string, height: number): HTMLPreElement => {
    const pre = document.createElement('pre')

    // Set exact height to maintain layout during content swapping
    pre.style.height = `${height}px`
    pre.style.margin = '0'
    pre.style.padding = '0'
    pre.style.overflow = 'hidden'

    // Match original text formatting for consistency
    pre.style.whiteSpace = 'pre-wrap'
    pre.style.fontFamily = 'monospace'
    pre.style.fontSize = 'inherit'
    pre.style.lineHeight = 'inherit'

    // Make content transparent but preserve text for accessibility
    pre.style.color = 'transparent'
    pre.style.background = 'transparent'
    pre.textContent = textContent

    return pre
  }

  return {
    containerRef,
    contentRef,
    inView: inViewRef.current,
    // shouldRender: render content when visible OR on first render (no serialized content)
    shouldRender: inViewRef.current || contentHTML.current === null
  }
}
