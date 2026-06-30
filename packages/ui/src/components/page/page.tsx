import { ButtonHTMLAttributes, createContext, FC, ReactNode, useContext } from 'react'
import type { LinkProps } from 'react-router-dom'

import { cn } from '../../utils/cn'
import { ButtonLayout } from '../button-layout'
import { Favorite, FavoriteIconProps } from '../favorite'
import { IconPropsV2, IconV2 } from '../icon-v2'
import { Layout } from '../layout'
import { SandboxLayout } from '../layouts/SandboxLayout'
import { Link } from '../link'
import { LogoPropsV2, LogoV2 } from '../logo-v2'
import { Skeleton } from '../skeletons'
import { Text } from '../text'

export interface PageHeaderBackProps {
  linkText: string
  linkProps: LinkProps
}

export interface PageHeaderButtonProps {
  props?: ButtonHTMLAttributes<HTMLButtonElement>
  text: ReactNode
  isDialogTrigger?: boolean
}

export interface PageHeaderProps {
  backLink?: PageHeaderBackProps
  logoName?: LogoPropsV2['name']
  title: ReactNode
  iconName?: IconPropsV2['name']
  iconSize?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  description?: ReactNode
  children?: ReactNode
  favoriteProps?: Omit<FavoriteIconProps, 'className'>
  isLoading?: boolean
  actions?: ReactNode
  headerActions?: ReactNode
}

const Header: FC<PageHeaderProps> = ({
  backLink,
  logoName,
  title,
  iconName,
  iconSize = 'lg',
  description,
  children,
  favoriteProps,
  isLoading = false,
  actions,
  headerActions
}) => {
  const scrollable = usePageScrollable()
  const titleElement =
    typeof title === 'string' ? (
      <Text as="h1" variant="heading-section" truncate>
        {title}
      </Text>
    ) : (
      title
    )

  return (
    <Layout.Vertical
      gap="md"
      className={cn(
        'w-full',
        children ? 'mb-cn-md' : 'mb-cn-2xl',
        // In scrollable mode, Page.Root uses `display: contents` on the wrapper,
        // so this header must own its own padding and sticky positioning.
        scrollable &&
          'sticky top-0 z-10 bg-cn-1 pt-[var(--cn-page-container-spacing-py)] px-[var(--cn-page-container-spacing-px)]'
      )}
    >
      {(!!backLink || !!headerActions) && (
        <Layout.Horizontal className="h-cn-9">
          {!!backLink && (
            <Link prefixIcon {...backLink.linkProps}>
              {backLink.linkText}
            </Link>
          )}
          {!!headerActions && <ButtonLayout className="flex-1">{headerActions}</ButtonLayout>}
        </Layout.Horizontal>
      )}
      <Layout.Horizontal>
        <Layout.Grid gap="xs" flow="column">
          {isLoading ? (
            <>
              <Skeleton.Logo className="mt-cn-4xs" size="md" />
              <Skeleton.Typography className="w-80" variant="heading-section" />
            </>
          ) : (
            <>
              {!!logoName && <LogoV2 className="mt-cn-4xs" name={logoName} size="md" />}
              {iconName ? (
                <Layout.Horizontal gap="xs" align="center">
                  <div className="mt-cn-4xs">
                    <IconV2 name={iconName} size={iconSize} />
                  </div>
                  {titleElement}
                </Layout.Horizontal>
              ) : (
                titleElement
              )}
            </>
          )}
          {!!favoriteProps && !isLoading && <Favorite className="mt-cn-4xs" {...favoriteProps} />}
        </Layout.Grid>
        {!!actions && <ButtonLayout className="flex-1">{actions}</ButtonLayout>}
      </Layout.Horizontal>
      {!!description && <Text>{description}</Text>}
      {children}
    </Layout.Vertical>
  )
}
Header.displayName = 'PageHeader'

const PageScrollableContext = createContext(false)

export const usePageScrollable = () => useContext(PageScrollableContext)

/**
 * When `scrollable` is true, Page.Root enables full-page scroll with a sticky header:
 *
 * - SandboxLayout.Main becomes the scroll container (overflow-auto).
 * - SandboxLayout.Content uses `display: contents` to remove itself from the layout,
 *   allowing Page.Header/Page.HeaderV2 to stick directly within the scroll container.
 *   Without this, sticky is constrained by the Content wrapper's height.
 * - Page.Header/HeaderV2 own top + horizontal padding and sticky positioning.
 * - Page.Content owns horizontal + top padding, plus a bottom spacer element.
 *   The spacer must be a block-flow child (not padding/margin) because padding and margin
 *   on direct flex children of overflow-auto containers don't extend scroll height.
 */
const Root = ({
  children,
  scrollable,
  mainClassName,
  contentClassName
}: {
  children: ReactNode
  scrollable?: boolean
  mainClassName?: string
  contentClassName?: string
}) => {
  return (
    <PageScrollableContext.Provider value={!!scrollable}>
      <SandboxLayout.Main className={cn('min-h-0', scrollable && 'overflow-auto', mainClassName)}>
        {/* `contents` removes this element's box so children participate directly in Main's flex layout.
            `!p-0` overrides the padding from cn-sandbox-layout-content (applied via tailwind plugin). */}
        <SandboxLayout.Content className={cn('min-h-0', { 'contents !p-0': scrollable }, contentClassName)}>
          {children}
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    </PageScrollableContext.Provider>
  )
}

const Content = ({ children, className }: { children: ReactNode; className?: string }) => {
  const scrollable = usePageScrollable()
  // Canvas/fill views pass flex-1 to stretch into available space — they manage
  // their own internal scroll and don't need page-level vertical padding or bottom spacer.
  const isFilledContent = className?.includes('flex-1')
  return (
    <div
      className={cn(
        'min-h-0',
        !scrollable && 'flex-1',
        scrollable && 'cn-page-content',
        scrollable && !isFilledContent && 'cn-page-content-pt',
        className
      )}
    >
      {children}
      {/* Bottom spacer inside content flow. Padding/margin on direct flex children of
          overflow-auto containers don't extend scroll height, but block-flow children do. */}
      {scrollable && !isFilledContent && <div className="h-cn-md" />}
    </div>
  )
}

export const Page = {
  Root,
  Header,
  Content
}
