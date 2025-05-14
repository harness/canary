import { useState } from 'react'

import { MultipleSelector, MultiSelectOption } from '@harnessio/ui/components'

const OPTIONS: MultiSelectOption[] = [
  { key: 'nextjs' },
  { key: 'Vite' },
  { key: 'Nuxt' },
  { key: 'Vue' },
  { key: 'Remix' },
  { key: 'Svelte' },
  { key: 'Angular' },
  { key: 'Ember' },
  { key: 'React' },
  { key: 'Gatsby' },
  { key: 'Astro' }
]

export const MultipleSelectorWithDisabledOption = () => {
  const [value, setValue] = useState([OPTIONS[0]])
  return (
    <div className="flex w-full flex-col gap-5 px-10 max-w-md mt-2 ml-2">
      <MultipleSelector
        onChange={options => setValue(options)}
        value={value}
        options={OPTIONS}
        placeholder="Select frameworks you like..."
        disallowCreation
      />
    </div>
  )
}
