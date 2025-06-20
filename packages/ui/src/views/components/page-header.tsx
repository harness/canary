import { ButtonHTMLAttributes, FC, ReactNode } from 'react'
import type { LinkProps } from 'react-router-dom'

import { Button, ButtonLayout, DropdownMenu, IconV2, Layout, Link, LogoPropsV2, LogoV2, Text } from '@/components'

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
}

export const PageHeader: FC<PageHeaderProps> = ({ backLink, logoName, title, description, children, button }) => {
  return (
    <Layout.Flex justify="between" gap="lg">
      <Layout.Vertical gap="lg">
        <Layout.Vertical>
          {!!backLink && (
            <Link prefixIcon {...backLink.linkProps}>
              {backLink.linkText}
            </Link>
          )}
          <Layout.Flex gap="xs">
            {!!logoName && <LogoV2 name={logoName} size="lg" />}
            <Text as="h1" variant="heading-section" color="foreground-1">
              {title}
            </Text>
          </Layout.Flex>
          {!!description && <Text>{description}</Text>}
        </Layout.Vertical>
        {children}
      </Layout.Vertical>
      <ButtonLayout className="self-end">
        {!!button && <Button {...button?.props}>{button.text}</Button>}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger aria-label="More actions" asChild>
            <Button variant="outline" iconOnly>
              <IconV2 name="more-vert" />
            </Button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content align="end">
            <DropdownMenu.Item title="Item 1" />
            <DropdownMenu.Item title="Item 2" />
            <DropdownMenu.Item title="Item 3" />
            <DropdownMenu.Item title="Item 4" />
            <DropdownMenu.Item title="Item 5" />
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </ButtonLayout>
    </Layout.Flex>
  )
}
