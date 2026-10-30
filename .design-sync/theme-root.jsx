import * as React from 'react'
import { ThemeProvider } from '../packages/ui/dist/context.js'

export function ThemeRoot({ mode = 'light', children, style, className }) {
  const cls = `${mode} ${mode}-std-std`
  React.useEffect(() => {
    const el = document.documentElement
    const added = cls.split(' ').filter(c => !el.classList.contains(c))
    added.forEach(c => el.classList.add(c))
    return () => added.forEach(c => el.classList.remove(c))
  }, [cls])
  return (
    <ThemeProvider theme={`${mode}-std-std`}>
      <div className={`${cls} cn-root ${className ?? ''}`.trim()} style={style}>
        {children}
      </div>
    </ThemeProvider>
  )
}
