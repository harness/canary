import { useState } from 'react'

import { Button } from '@harnessio/ui/components'
import { InputReference } from '@harnessio/ui/views'

const InputReferenceExample: React.FC = () => {
  // Example of how to track changes from InputReference if needed
  const [selectedOption, setSelectedOption] = useState<string | undefined>('Initial Selection')

  return (
    <div className="flex max-w-xl flex-col gap-5 p-5">
      <h2 className="text-lg font-semibold">Input Reference Component Examples</h2>

      <Button onClick={() => setSelectedOption('Changed Selection')}>Change the value</Button>

      {/* Basic example */}
      <div>
        <h3 className="mb-2 text-base font-medium">Basic Example</h3>
        <InputReference<string>
          initialValue="Hello"
          label="Select an option"
          onClick={() => console.log('Clicked on basic example')}
          onEdit={() => console.log('Edit clicked on basic example')}
          onClear={previousValue => console.log('Cleared value:', previousValue)}
          onChange={newValue => console.log('Value changed to:', newValue || 'empty')}
        />
      </div>

      {/* With start icon example */}
      <div>
        <h3 className="mb-2 text-base font-medium">With Start Icon Example</h3>
        <InputReference<string>
          initialValue="Go to selected secret"
          startIcon="key"
          label="With start icon"
          onClick={() => console.log('Clicked on start icon example')}
          onEdit={() => console.log('Edit clicked on start icon example')}
          onClear={() => console.log('Clear clicked on start icon example')}
        />
      </div>

      {/* Example with onChange tracking state */}
      <div>
        <h3 className="mb-2 text-base font-medium">Example with onChange Tracking State</h3>
        <div className="mb-2 text-sm">
          Current selected option: <span className="font-medium">{selectedOption || 'None'}</span>
        </div>
        <InputReference<string>
          initialValue={selectedOption}
          startIcon="key"
          label="Track changes with onChange"
          onClick={() => console.log('Clicked on onChange example')}
          onEdit={() => console.log('Edit clicked on onChange example')}
          onClear={() => {
            console.log('Clear clicked on onChange example')
            setSelectedOption(undefined)
          }}
          onChange={newValue => {
            console.log('Value changed to:', newValue)
            setSelectedOption(newValue)
          }}
        />
      </div>

      {/* Complex object example */}
      <div>
        <h3 className="mb-2 text-base font-medium">Complex Object Example</h3>
        <InputReference<{ id: string; name: string }>
          initialValue={{ id: '123', name: 'Secret Key' }}
          startIcon="key"
          label="Object value example"
          onClick={() => console.log('Clicked on complex object example')}
          onEdit={() => console.log('Edit clicked on complex object example')}
          onClear={prev => console.log('Cleared object with name:', prev?.name || 'unknown')}
          onChange={newValue => console.log('Object changed to:', newValue)}
        />
      </div>

      {/* Disabled example */}
      <div>
        <h3 className="mb-2 text-base font-medium">Disabled Example</h3>
        <InputReference<string> disabled startIcon="key" initialValue="This input is disabled" label="Disabled input" />
      </div>

      {/* Empty state example */}
      <div>
        <h3 className="mb-2 text-base font-medium">Empty State Example</h3>
        <InputReference<string> label="Empty input" onClick={() => console.log('Clicked on empty example')} />
      </div>
    </div>
  )
}

export default InputReferenceExample
