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
  actions
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
    <Layout.Horizontal justify="between" gap="xl" className="mb-cn-md">
      <Layout.Vertical gap="md" className="w-full">
        <Layout.Vertical>
          {!!backLink && (
            <Link prefixIcon {...backLink.linkProps}>
              {backLink.linkText}
            </Link>
          )}
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
        </Layout.Vertical>
        {!!description && <Text>{description}</Text>}
        {children}
      </Layout.Vertical>

      {!!actions && <ButtonLayout className="self-end">{actions}</ButtonLayout>}
    </Layout.Horizontal>
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
