import { Icon } from '@/components'
import { cn } from '@utils/cn'

interface AnimatedHarnessLogoProps {
  theme: 'error' | 'green' | 'blue'
}

const themes = {
  error: {
    shadowBackground: 'bg-[#AD79D2]',
    largeLightBackground: 'bg-[#AD79D2]',
    smallLightBackground: 'bg-[#AD79D2]'
  },
  green: {
    shadowBackground: 'bg-[#70DCD3]',
    largeLightBackground: 'bg-[#70DCD3]',
    smallLightBackground: 'bg-[#70DCD3]'
  },
  blue: {
    shadowBackground: 'bg-[#799ED2]',
    largeLightBackground: 'bg-[#798FD2]',
    smallLightBackground: 'bg-[#7980D2]'
  }
}

export function AnimatedHarnessLogo({ theme }: AnimatedHarnessLogoProps) {
  const { largeLightBackground, smallLightBackground, shadowBackground } = themes[theme]
  const isError = theme === 'error'

  return (
    <div className="relative flex size-16" aria-hidden>
      <div className={cn(isError && 'rotate-90', 'transition-transform duration-700')}>
        <span
          className={cn(
            'absolute size-[68px] -left-2.5 -z-10 -top-2 rounded-[100%] transition-colors duration-700 blur-[10px] opacity-[.12]',
            shadowBackground
          )}
        />
        <div className="relative flex size-16 overflow-hidden rounded-full bg-background-3 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.6)]">
          <span className="border-linear absolute inset-0 mix-blend-overlay [background:linear-gradient(180deg,#fff,transparent)_border-box]" />
          <span className="absolute -right-0.5 bottom-px size-7 translate-y-1/2 rounded-full bg-[#D9D9D9] opacity-5 blur-[10px]" />
          <span
            className={cn(
              'absolute rounded-full size-7 -right-0.5 blur-[10px] bottom-px transition-colors duration-700 mix-blend-plus-lighter bg-[#7980D2] opacity-10 translate-y-1/2',
              smallLightBackground
            )}
          />
          <span
            className={cn(
              'absolute rounded-full size-14 -top-0.5 blur-[10px] transition-colors duration-700 mix-blend-plus-lighter opacity-20 bg-[#798FD2] left-0.5 -translate-x-1/2 -translate-y-1/2',
              largeLightBackground
            )}
          />
          <span className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-xl bg-gradient-to-r from-[#F9F9FA] via-transparent via-60% to-transparent opacity-50 blur-sm" />
        </div>
      </div>
      <Icon className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2" name="harness" size={36} />
    </div>
  )
}
