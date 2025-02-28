import { HTMLAttributes, PropsWithChildren } from 'react'

export function Footer({ children }: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  return (
    <div className="sticky bottom-0 z-20 grid h-[72px] items-center border-t border-sidebar-border-1 px-4">
      {children}
    </div>
  )
}
