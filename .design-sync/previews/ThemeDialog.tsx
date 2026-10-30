import * as React from 'react'
import { ThemeDialog } from '@harnessio/ui'

export function Default() {
  const [open, setOpen] = React.useState(true)
  const [theme, setTheme] = React.useState<any>('light-std-std')
  return <ThemeDialog open={open} onOpenChange={setOpen} theme={theme} setTheme={setTheme} />
}

export function WithAccessibility() {
  const [open, setOpen] = React.useState(true)
  const [theme, setTheme] = React.useState<any>('dark-std-std')
  return (
    <ThemeDialog
      open={open}
      onOpenChange={setOpen}
      theme={theme}
      setTheme={setTheme}
      showSystemMode
      showAccessibilityThemeOptions
    />
  )
}
