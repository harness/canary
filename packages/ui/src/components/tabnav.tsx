import { createContext, HTMLAttributes, PropsWithChildren, useContext } from 'react'
import { type NavLinkProps } from 'react-router-dom'

import { useRouterContext } from '@/context'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

const tabNavRootVariants = cva('flex items-center', {
  variants: {
    variant: {
      underline: 'h-11 w-full gap-6 border-b border-cn-borders-3 px-6',
      tabs: 'relative w-full before:absolute before:bottom-0 before:left-0 before:w-full before:border-b before:border-cn-borders-2'
    }
  },
  defaultVariants: {
    variant: 'underline'
  }
})

const makeTabNavTriggerVariants = (isActive?: boolean) =>
  cva(
    'relative flex h-9 place-items-center font-normal text-cn-foreground-2 duration-150 ease-in-out hover:text-cn-foreground-1 focus-visible:duration-0',
    {
      variants: {
        variant: {
          underline: [
            'm-0 my-1 whitespace-nowrap px-0 text-2 leading-none',
            // bottom border of active tab
            'after:pointer-events-none after:absolute after:inset-[-0.25rem_0] after:block after:border-b-2 after:border-solid after:border-b-transparent',
            ...(isActive ? ['text-cn-foreground-1 after:border-cn-borders-accent'] : [])
            /*
             * TODO: Active tab Radial background is hidden until it's adjusted to the light theme
             */
            // radial gradient of active tab
            // 'before:pointer-events-none before:absolute before:left-1/2 before:top-1/2 before:-z-10 before:h-[calc(100%+40px)] before:w-[calc(100%+60px)] before:-translate-x-1/2 before:-translate-y-1/2 before:bg-transparent',
            // { 'before:[/* the radial gradient was lost during design system update (PR 1462) */]': isActive },
          ],
          tabs: [
            'gap-x-1.5 rounded-t-md border-x border-t border-transparent px-3.5',
            ...(isActive ? ['border-cn-borders-2 bg-cn-background-1 text-cn-foreground-1'] : [])
          ]
        }
      },
      defaultVariants: {
        variant: 'underline'
      }
    }
  )

const TabNavContext = createContext<
  VariantProps<typeof tabNavRootVariants | ReturnType<typeof makeTabNavTriggerVariants>>
>({
  variant: 'underline'
})

interface TabNavRootProps
  extends PropsWithChildren<HTMLAttributes<HTMLElement>>,
    VariantProps<typeof tabNavRootVariants> {}

const TabNavRoot = ({ className, variant, children, ...props }: TabNavRootProps) => {
  return (
    <nav {...props} className={cn(tabNavRootVariants({ variant }), className)}>
      <TabNavContext.Provider value={{ variant }}>{children}</TabNavContext.Provider>
    </nav>
  )
}

interface TabNavItemProps extends NavLinkProps, VariantProps<ReturnType<typeof makeTabNavTriggerVariants>> {}

const TabNavItem = ({ className, variant, ...props }: TabNavItemProps) => {
  const { NavLink } = useRouterContext()
  const context = useContext(TabNavContext)

  return (
    <NavLink
      role="tab"
      className={({ isActive }) =>
        cn(makeTabNavTriggerVariants(isActive)({ variant: context.variant ?? variant }), className)
      }
      {...props}
    />
  )
}

export const TabNav = { Root: TabNavRoot, Item: TabNavItem }
