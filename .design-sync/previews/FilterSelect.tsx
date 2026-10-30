import * as React from 'react'
import { FilterSelect, Button } from '@harnessio/ui'

const options: any[] = [
  { label: 'Status', value: 'status', type: 'checkbox', filterFieldConfig: { label: 'Status' } },
  { label: 'Branch', value: 'branch', type: 'text', filterFieldConfig: {} },
  { label: 'Triggered by', value: 'trigger', type: 'text', filterFieldConfig: {} },
  { label: 'Created', value: 'created', type: 'calendar', filterFieldConfig: {} }
]

const label = <Button variant="outline">Add filter</Button>

function AutoOpen({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const t = setTimeout(() => {
      const btn = ref.current?.querySelector('button')
      if (!btn) return
      const init = { bubbles: true, cancelable: true, button: 0, ctrlKey: false, pointerType: 'mouse' } as any
      btn.dispatchEvent(new PointerEvent('pointerdown', init))
      btn.dispatchEvent(new PointerEvent('pointerup', init))
    }, 50)
    return () => clearTimeout(t)
  }, [])
  return <div ref={ref} style={{ width: 360, height: 320, padding: 16 }}>{children}</div>
}

export function Menu() {
  return (
    <AutoOpen>
      <FilterSelect options={options} displayLabel={label} dropdownAlign="start" inputPlaceholder="Search filters" onChange={() => {}} />
    </AutoOpen>
  )
}

export function WithReset() {
  return (
    <AutoOpen>
      <FilterSelect options={options} displayLabel={label} dropdownAlign="start" inputPlaceholder="Search filters" buttonLabel="Reset filters" onReset={() => {}} onChange={() => {}} />
    </AutoOpen>
  )
}
