import { AlertContainer, type AlertContainerProps } from './AlertContainer'
import { AlertDescription, type AlertDescriptionProps } from './AlertDescription'
import { AlertTitle, type AlertTitleProps } from './AlertTitle'

export { AlertContainerProps, AlertDescriptionProps, AlertTitleProps }

export const Alert = {
  Container: AlertContainer,
  Title: AlertTitle,
  Description: AlertDescription
}
