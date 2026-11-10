import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@harnessio/ui/components'

export function Bad(): JSX.Element {
  const base = 'bg-blue-500 text-white'
  return (
    <div className="p-[13px] bg-cn-1 text-gray-700" style={{ color: '#0066cc', transform: 'scale(1)' }}>
      <button className="border-red-300">Save</button>
      <input />
      <span style={{ background: 'rgb(0, 0, 0)' }}>{base}</span>
      <div className="made-up-class cn-button">x</div>
      <Button>ok</Button>
      <Dialog.Root />
    </div>
  )
}
