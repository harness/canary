import { PropsWithChildren } from 'react'

import { cn } from '@utils/cn'
import { isSafari } from '@utils/isSafari'

import noiseBg from './noise.png'

export interface RootProps extends PropsWithChildren {
  className?: string
  isSubMenu?: boolean
}

export function Root({ className, children, isSubMenu = false }: RootProps) {
  return (
    <div
      className={cn(
        'relative border-borders-5 bg-background-7 grid h-screen w-[220px] select-none grid-rows-[auto_1fr_auto] overflow-y-auto border-r',
        { 'bg-background-7/70 backdrop-blur-[20px]': isSubMenu },
        className
      )}
    >
      {!isSubMenu && (
        <>
          <div className="pointer-events-none absolute left-1/2 top-[-82px] h-[164px] w-[392px] -translate-x-1/2 rounded-[392px] bg-navbar-gradient-1" />
          <div className="pointer-events-none absolute left-[-132px] top-[-51px] h-[325px] w-[263px] rounded-[325px] bg-navbar-gradient-2" />
          <div className="pointer-events-none absolute right-[-93px] top-[22%] h-[333px] w-[186px] rounded-[333px] bg-navbar-gradient-3" />
          <div className="pointer-events-none absolute bottom-[161px] left-[-139px] h-[362px] w-[297px] rounded-[362px] bg-navbar-gradient-4" />
          <div
            className={cn(
              `absolute left-0 top-0 size-full bg-repeat opacity-20 mix-blend-overlay pointer-events-none`,
              isSafari() ? 'opacity-5' : 'opacity-20'
            )}
            style={{ backgroundImage: `url(${noiseBg})` }}
          />
        </>
      )}
      {children}
    </div>
  )
}
