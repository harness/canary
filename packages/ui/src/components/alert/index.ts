import { AlertDescription, type AlertDescriptionProps } from './AlertDescription'
import { AlertLink, type AlertLinkProps } from './AlertLink'
import { AlertRoot, type AlertRootProps } from './AlertRoot'
import { AlertTitle, type AlertTitleProps } from './AlertTitle'

export { AlertRootProps, AlertDescriptionProps, AlertTitleProps, AlertLinkProps }

export const Alert = {
  Root: AlertRoot,
  Title: AlertTitle,
  Description: AlertDescription,
  Link: AlertLink
}
