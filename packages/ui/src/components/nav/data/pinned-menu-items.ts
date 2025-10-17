import { NavbarItemType } from '@/components'
import { TFunctionWithFallback } from '@/context'

/**
 * No pinned menu items by default
 */
export const getPinnedMenuItems = (_t: TFunctionWithFallback): NavbarItemType[] => []
