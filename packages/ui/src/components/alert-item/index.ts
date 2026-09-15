import { AlertItemComp, type AlertItemProps, type AlertItemTheme } from './AlertItem'
import { AlertItemDescription, type AlertItemDescriptionProps } from './AlertItemDescription'
import { AlertItemLink, type AlertItemLinkProps } from './AlertItemLink'
import { AlertItemTitle, type AlertItemTitleProps } from './AlertItemTitle'

export { AlertItemProps, AlertItemTitleProps, AlertItemDescriptionProps, AlertItemLinkProps, AlertItemTheme }

export const AlertItem = Object.assign(AlertItemComp, {
  Title: AlertItemTitle,
  Description: AlertItemDescription,
  Link: AlertItemLink
})
