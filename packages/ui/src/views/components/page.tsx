import {ButtonHTMLAttributes, FC, ReactNode, useMemo} from 'react'
import type { LinkProps } from 'react-router-dom'

import {
  Button,
  ButtonLayout,
  Layout,
  Link,
  LogoPropsV2,
  LogoV2,
  RbacMoreActionsTooltipActionData,
  Text
} from '@/components'
import { SandboxLayout } from '@/views'
import {useComponents, useCustomDialogTrigger} from "@/context";

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
  moreActions?: RbacMoreActionsTooltipActionData[]
}

const Header: FC<PageHeaderProps> = ({ backLink, logoName, title, description, children, button, moreActions }) => {
  const { RbacMoreActionsTooltip } = useComponents()
  const { triggerRef, registerTrigger } = useCustomDialogTrigger()

  const UpdatedMoreActions = useMemo(() => {
    if (!moreActions) return moreActions

    return moreActions.map(action => {
      const onClick = !action?.onClick ? undefined : () => {
        registerTrigger()
        action.onClick?.()
      }

      return {
        ...action,
        onClick
      }
    })
  }, [moreActions, registerTrigger])

  return (
    <Layout.Horizontal justify="between" gap="xl" className="mb-cn-xl">
      <Layout.Vertical gap="xl">
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

      {(!!button || !!UpdatedMoreActions) && (
        <ButtonLayout className="self-end">
          {!!button && <Button {...button?.props}>{button.text}</Button>}
          {!!UpdatedMoreActions && (
            <RbacMoreActionsTooltip
                ref={triggerRef}
                actions={UpdatedMoreActions}
                buttonVariant="outline"
            />
          )}
        </ButtonLayout>
      )}
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
