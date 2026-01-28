import { ButtonHTMLAttributes, FC, ReactNode } from 'react'
import type { LinkProps } from 'react-router-dom'

import {
  ButtonLayout,
  Favorite,
  FavoriteIconProps,
  IconPropsV2,
  IconV2,
  Layout,
  Link,
  LogoPropsV2,
  LogoV2,
  Skeleton,
  Text
} from '@/components'
import { SandboxLayout } from '@/views'
import { cn } from '@utils/cn'

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
  const titleElement =
    typeof title === 'string' ? (
      <Text as="h1" variant="heading-section" truncate>
        {title}
      </Text>
    ) : (
      title
    )

  return (
    <Layout.Vertical gap="md" className={cn('w-full', children ? 'mb-cn-md' : 'mb-cn-2xl')}>
      <Layout.Horizontal className="h-cn-9">
        {!!backLink && (
          <Link prefixIcon {...backLink.linkProps}>
            {backLink.linkText}
          </Link>
        )}
        {!!headerActions && <ButtonLayout className="flex-1">{headerActions}</ButtonLayout>}
      </Layout.Horizontal>
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

const Root = ({
  children,
  mainClassName,
  contentClassName
}: {
  children: ReactNode
  mainClassName?: string
  contentClassName?: string
}) => {
  return (
    <SandboxLayout.Main className={mainClassName}>
      <SandboxLayout.Content className={contentClassName}>{children}</SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

const Content = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
)

export const Page = {
  Root,
  Header,
  Content
}
