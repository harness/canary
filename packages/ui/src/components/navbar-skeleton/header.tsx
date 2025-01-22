import { PropsWithChildren } from 'react'

export function Header({ children }: PropsWithChildren<unknown>) {
  return <div className="sticky top-0 z-20 grid items-center">{children}</div>
}
