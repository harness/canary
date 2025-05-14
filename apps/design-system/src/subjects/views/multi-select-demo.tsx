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
  const [value, setValue] = useState<MultiSelectOption[]>([])
  return (
    <MultipleSelector
      onChange={options => setValue(options)}
      value={value}
      options={OPTIONS}
      placeholder="Select frameworks you like..."
      //   disallowCreation
      label="Frameworks"
      caption="Separate tags with commas or press Enter. Use the format key:value for object entries."
    />
  )
}
