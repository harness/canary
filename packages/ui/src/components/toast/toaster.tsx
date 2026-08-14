import { useEffect, useState } from 'react'

import { cn } from '@utils/cn'
import { Toaster as SonnerToaster, type ToasterProps as SonnerToasterProps } from 'sonner'

type ToasterProps = Partial<Pick<SonnerToasterProps, 'duration' | 'className'>>

/**
 * Sonner keeps a single module-level toast store and renders every toast into every mounted
 * <Toaster>. Apps that mount several independently-wrapped trees (e.g. module federation exports
 * sharing one remote container) would therefore show each toast once per tree. Ownership is scoped
 * to this module, which is exactly sonner's store scope: a bundle with its own sonner copy also has
 * its own copy of this module and gets its own toaster.
 */
let owner: symbol | null = null
const waiting = new Set<() => void>()

function useIsToasterOwner(): boolean {
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    const token = Symbol('toaster')

    const claim = () => {
      if (owner !== null) return
      owner = token
      waiting.delete(claim)
      setIsOwner(true)
    }

    waiting.add(claim)
    claim()

    return () => {
      waiting.delete(claim)
      if (owner === token) {
        owner = null
        waiting.forEach(next => next())
      }
    }
  }, [])

  return isOwner
}

export function Toaster({ duration = 5000, className }: ToasterProps) {
  const isOwner = useIsToasterOwner()

  if (!isOwner) return null

  return (
    <SonnerToaster
      richColors={false}
      position="bottom-right"
      duration={duration}
      visibleToasts={3}
      className={cn('cn-toast-wrapper', className)}
      toastOptions={{
        style: {
          background: 'transparent',
          border: 'none',
          padding: 0,
          boxShadow: 'none',
          right: 0,
          height: 'auto',
          overflow: 'hidden'
        }
      }}
    />
  )
}
