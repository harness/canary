import { useState } from 'react'

import { StyledLink } from '@harnessio/ui/components'
import { InputReference } from '@harnessio/ui/views'

const InputReferenceExample: React.FC = () => {
  const [value1, setValue1] = useState('Hello')

  return (
    <div className="flex max-w-xl flex-col gap-5 p-5">
      <h2 className="text-lg font-semibold">Input Reference Component Examples</h2>

      {/* Basic example */}
      <div>
        <h3 className="mb-2 text-base font-medium">Basic Example</h3>
        <InputReference
          defaultValue="Click to select option"
          value={value1}
          label="Select an option"
          onClick={() => console.log('Clicked on basic example')}
          onEdit={() => console.log('Edit clicked on basic example')}
          onClear={() => setValue1('')}
        />
      </div>

      {/* With start icon example */}
      <div>
        <h3 className="mb-2 text-base font-medium">With Start Icon Example</h3>
        <InputReference
          defaultValue="Click to select option"
          value={<StyledLink to="/">Go to slected secret</StyledLink>}
          startIcon="key"
          label="With start icon"
          onClick={() => console.log('Clicked on start icon example')}
          onEdit={() => console.log('Edit clicked on start icon example')}
          onClear={() => console.log('Clear clicked on start icon example')}
        />
      </div>

      {/* Disabled example */}
      <div>
        <h3 className="mb-2 text-base font-medium">Disabled Example</h3>
        <InputReference
          disabled
          startIcon="key"
          value="This input is disabled"
          label="Disabled input"
          defaultValue="Click to select option"
        />
      </div>

      {/* Empty state example */}
      <div>
        <h3 className="mb-2 text-base font-medium">Empty State Example</h3>
        <InputReference
          defaultValue="Click to select option"
          value=""
          label="Empty input"
          onClick={() => console.log('Clicked on empty example')}
        />
      </div>
    </div>
  )
}

export default InputReferenceExample
