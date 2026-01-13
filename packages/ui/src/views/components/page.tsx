import { ButtonHTMLAttributes, FC, ReactNode } from 'react'
import type { LinkProps } from 'react-router-dom'

import {
  ButtonLayout,
  Favorite,
  FavoriteIconProps,
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
  title: string
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
  description,
  children,
  favoriteProps,
  isLoading = false,
  actions
}) => {
  return (
    <Layout.Horizontal justify="between" gap="xl" className="mb-cn-md">
      <Layout.Vertical gap="xl">
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
                <Text as="h1" variant="heading-section" truncate>
                  {title}
                </Text>
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

const Root = ({ children }: { children: ReactNode }) => {
  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>{children}</SandboxLayout.Content>
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
