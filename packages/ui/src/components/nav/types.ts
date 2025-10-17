import type { Params } from 'react-router-dom'

import { TFunctionWithFallback } from '@/context'
import { ScopeType } from '@/views'
import { MenuGroupType, NavbarItemType } from '@components/app-sidebar'

export interface ScopedNavbarItemType extends NavbarItemType {
  scopes?: ScopeType[]
}

export interface ScopedMenuGroupType extends Omit<MenuGroupType, 'items'> {
  items: ScopedNavbarItemType[]
  scopes?: ScopeType[]
}

export type RouteDefinitions = Record<string, (params: Params) => string>

export type GetNavbarMenuDataParams = {
  t: TFunctionWithFallback
  params: Params
  routes?: RouteDefinitions
}

export enum NavEnum {
  Home = 0,
  Activities = 1,
  Settings = 2
}

export type GetNavbarMenuData = ({ t, routes }: GetNavbarMenuDataParams) => ScopedMenuGroupType[]
