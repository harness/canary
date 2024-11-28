import { IconType } from './types'

export const getPrState = (
  is_draft?: boolean,
  merged?: number | null,
  state?: string
): { icon: IconType; text: string; theme: string } => {
  if (state === 'open' && is_draft) {
    return { icon: 'pr-draft', text: 'Draft', theme: 'warning' }
  } else if (merged) {
    return { icon: 'pr-merge', text: 'Merged', theme: 'emphasis' }
  } else if (state === 'closed') {
    return { icon: 'pr-closed', text: 'Closed', theme: 'muted' }
  } else {
    return { icon: 'pr-open', text: 'Open', theme: 'success' }
  }
}
