import { memo, ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const ShadowRootWrapper = memo(({ children }: { children?: ReactNode }) => {
  const placeholderRef = useRef<HTMLDivElement>(null)
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null)

  useEffect(() => {
    setShadowRoot(
      (placeholderRef.current?.parentNode as Element)?.attachShadow({
        mode: 'open'
      })
    )
  }, [])

  return shadowRoot ? createPortal(children, shadowRoot) : <div ref={placeholderRef}></div>
})

ShadowRootWrapper.displayName = 'ShadowRootWrapper'

export default ShadowRootWrapper
