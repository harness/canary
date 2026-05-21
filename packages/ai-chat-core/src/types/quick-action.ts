export interface QuickAction {
  id: string
  label: string
  prompt: string
  icon?: string
  description?: string
  priority?: number
  scope?: string
}

export interface QuickActionConfig extends QuickAction {
  condition?: () => boolean | Promise<boolean>
}

export type QuickActionScopeMode = 'replace' | 'append' | 'merge'

export interface QuickActionScopeConfig {
  scope: string
  mode?: QuickActionScopeMode
}

export interface QuickActionFilter {
  scope?: string
  visible?: boolean
}
