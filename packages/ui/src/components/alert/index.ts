import { AlertContainer, type AlertContainerProps } from './AlertContainer'
import { AlertTitle, type AlertTitleProps } from './AlertTitle'
import { AlertDescription, type AlertDescriptionProps } from './AlertDescription'

export { AlertContainerProps, AlertDescriptionProps, AlertTitleProps }

export const Alert = {
  Container: AlertContainer,
  Title: AlertTitle,
  Description: AlertDescription
}
