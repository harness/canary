import { PropsWithChildren } from 'react'

export function Footer({ children }: PropsWithChildren) {
  return (
    <div className="sticky bottom-0 z-20 grid h-[72px] items-center border-t border-borders-5 px-4">{children}</div>
  )
}
