import { ButtonHTMLAttributes, FC, ReactNode } from 'react'
import type { LinkProps } from 'react-router-dom'

import {
  Button,
  ButtonLayout,
  DropdownMenu,
  DropdownMenuItemProps,
  IconV2,
  Layout,
  Link,
  LogoPropsV2,
  LogoV2,
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
}

export interface PageHeaderProps {
  backLink?: PageHeaderBackProps
  logoName?: LogoPropsV2['name']
  title: string
  description?: ReactNode
  children?: ReactNode
  button?: PageHeaderButtonProps
  moreActions?: DropdownMenuItemProps[]
}

const Header: FC<PageHeaderProps> = ({ backLink, logoName, title, description, children, button, moreActions }) => {
  return (
    <Layout.Flex justify="between" gap="lg" className="mb-10">
      <Layout.Vertical className="gap-[var(--cn-spacing-5)]">
        <Layout.Vertical>
          {!!backLink && (
            <Link prefixIcon {...backLink.linkProps}>
              {backLink.linkText}
            </Link>
          )}
          <Layout.Flex gap="xs">
            {!!logoName && <LogoV2 name={logoName} size="lg" />}
            <Text as="h1" variant="heading-section">
              {title}
            </Text>
          </Layout.Flex>
        </Layout.Vertical>
        {!!description && <Text>{description}</Text>}
        {children}
      </Layout.Vertical>

      {(!!button || !!moreActions) && (
        <ButtonLayout className="self-end">
          {!!button && <Button {...button?.props}>{button.text}</Button>}
          {!!moreActions && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger aria-label="More actions" asChild>
                <Button variant="outline" iconOnly>
                  <IconV2 name="more-vert" />
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content align="end">
                {moreActions.map((action, index) => (
                  <DropdownMenu.Item key={index} {...action} />
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
        </ButtonLayout>
      )}
    </Layout.Flex>
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
