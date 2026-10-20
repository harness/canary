export type Category = 'Daily workflow' | 'Apps' | 'UI package' | 'Quality' | 'Setup'

export interface Task {
  /** Used on the command line: `pnpm assist -- <id>` */
  id: string
  label: string
  category: Category
  /** One plain-language line shown under the label in the menu */
  description: string
  run: () => Promise<void>
}
