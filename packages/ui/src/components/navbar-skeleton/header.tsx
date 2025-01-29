import { PropsWithChildren } from 'react'

export function Header({ children }: PropsWithChildren<React.HTMLAttributes<HTMLElement>>) {
  return <div className="sticky top-0 z-20 grid items-center">{children}</div>
}
