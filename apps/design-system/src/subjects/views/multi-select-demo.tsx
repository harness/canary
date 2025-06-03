import { useState } from 'react'

import { MultiSelect, MultiSelectOption } from '@harnessio/ui/components'

const OPTIONS: MultiSelectOption[] = [
  { key: 'nextjs', id: 'nextjs' },
  { key: 'Vite', id: 'Vite' },
  { key: 'Nuxt', id: 'Nuxt' },
  { key: 'Vue', id: 'Vue' },
  { key: 'Remix', id: 'Remix' },
  { key: 'Svelte', id: 'Svelte' },
  { key: 'Angular', id: 'Angular' },
  { key: 'Ember', id: 'Ember' },
  { key: 'React', id: 'React' },
  { key: 'Gatsby', id: 'Gatsby' },
  { key: 'Astro', id: 'Astro' }
]

export const MultipleSelectorWithDisabledOption = () => {
  const [value, setValue] = useState<MultiSelectOption[]>([OPTIONS[0]])
  return (
    <>
      <MultiSelect
        onChange={options => setValue(options)}
        value={value}
        options={OPTIONS}
        placeholder="Select frameworks you like..."
        // isLoading
        // disabled
      />
    </>
  )
}
