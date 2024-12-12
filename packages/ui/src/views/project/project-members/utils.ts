import { lowerFirst } from 'lodash-es'

export function transformValue(role: string): string {
  if (role === 'Owner') return 'space_owner'
  return lowerFirst(role)
}
