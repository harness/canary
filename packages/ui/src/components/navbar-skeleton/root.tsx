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
        'border-borders-5 bg-background-7 grid h-screen w-[220px] select-none grid-rows-[auto_1fr_auto] overflow-y-auto border-r',
        { 'bg-background-7/70 backdrop-blur-[20px]': isSubMenu },
        className
      )}
    >
      {!isSubMenu && (
        <>
          <div
            className="absolute -top-[82px] left-1/2 z-[-1] h-[164px] w-[392px] -translate-x-1/2 rounded-[392px]"
            // style={{
            //   background: 'radial-gradient(50% 50% at 50% 50%, rgba(48, 48, 54, 0.4) 0%, rgba(48, 48, 54, 0) 100%)'
            // }}
          />
          <div
            className="absolute -left-[132px] -top-[51px] z-[-1] h-[325px] w-[263px] rounded-[325px]"
            // style={{
            //   background:
            //     'radial-gradient(50% 50% at 50% 50%, rgba(73, 73, 73, 0.25) 0%, rgba(73, 73, 73, 0.15) 44.95%, rgba(73, 73, 73, 0) 100%)'
            // }}
          />
          <div
            className="absolute -right-[93px] top-[22%] z-[-1] h-[333px] w-[186px] rounded-[333px]"
            // style={{
            //   background: 'radial-gradient(50% 50% at 50% 50%, rgba(58, 58, 58, 0.2) 0%, rgba(58, 58, 58, 0) 100%)'
            // }}
          />
          <div
            className="absolute -left-[139px] bottom-[161px] z-[-1] h-[362px] w-[297px] rounded-[362px]"
            // style={{
            //   background: 'radial-gradient(50% 50% at 50% 50%, rgba(73, 73, 73, 0.2) 0%, rgba(73, 73, 73, 0) 100%)'
            // }}
          />
          <div
            className={cn(
              `absolute left-0 top-0 z-[-1] size-full bg-repeat opacity-20 mix-blend-overlay`,
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
