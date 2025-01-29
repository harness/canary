import { capitalize } from 'lodash-es'

export const generateFriendlyName = (propertyName: string): string => {
  return capitalize(propertyName.split('_').join(' '))
}
