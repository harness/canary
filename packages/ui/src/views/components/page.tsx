import { ButtonHTMLAttributes, FC, MouseEvent, ReactNode, useMemo } from 'react'
import type { LinkProps } from 'react-router-dom'

import {
  Button,
  ButtonLayout,
  Dialog,
  Favorite,
  FavoriteIconProps,
  Layout,
  Link,
  LogoPropsV2,
  LogoV2,
  RbacMoreActionsTooltipActionData,
  Text
} from '@/components'
import { useComponents, useCustomDialogTrigger } from '@/context'
import { SandboxLayout } from '@/views'
import omit from 'lodash-es/omit'

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
  button?: PageHeaderButtonProps
  moreActions?: RbacMoreActionsTooltipActionData[]
  favoriteProps?: Omit<FavoriteIconProps, 'className'>
}

const Header: FC<PageHeaderProps> = ({
  backLink,
  logoName,
  title,
  description,
  children,
  button,
  moreActions,
  favoriteProps
}) => {
  const { RbacMoreActionsTooltip } = useComponents()
  const { triggerRef, registerTrigger } = useCustomDialogTrigger()
  const { triggerRef: buttonTriggerRef, registerTrigger: buttonRegisterTest } = useCustomDialogTrigger()

  const UpdatedMoreActions = useMemo(() => {
    if (!moreActions) return moreActions

    return moreActions.map(action => {
      const onClick = !action?.onClick
        ? undefined
        : () => {
            registerTrigger()
            action.onClick?.()
          }

      return {
        ...action,
        onClick
      }
    })
  }, [moreActions, registerTrigger])

  const buttonClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
    buttonRegisterTest()
    button?.props?.onClick?.(e)
  }

  const getButton = () => {
    if (!button) return null

    const ButtonComp = (
      <Button ref={buttonTriggerRef} {...omit(button?.props, ['onClick'])} onClick={buttonClickHandler}>
        {button.text}
      </Button>
    )

    if (button?.isDialogTrigger) {
      return <Dialog.Trigger>{ButtonComp}</Dialog.Trigger>
    }

    return ButtonComp
  }

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
            {!!logoName && <LogoV2 className="mt-cn-4xs" name={logoName} size="md" />}
            <Text as="h1" variant="heading-section">
              {title}
            </Text>
            {!!favoriteProps && <Favorite className="mt-cn-4xs" {...favoriteProps} />}
          </Layout.Flex>
        </Layout.Vertical>
        {!!description && <Text>{description}</Text>}
        {children}
      </Layout.Vertical>

      {(!!button || !!UpdatedMoreActions) && (
        <ButtonLayout className="self-end">
          {getButton()}
          {!!UpdatedMoreActions && (
            <RbacMoreActionsTooltip ref={triggerRef} actions={UpdatedMoreActions} buttonVariant="outline" />
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
