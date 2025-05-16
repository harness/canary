import { useState } from 'react'

import { MultiSelectV2 } from '@harnessio/ui/components'

const OPTIONS: MultiSelectV2.MultiSelectOption[] = [
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
  const [value, setValue] = useState<MultiSelectV2.MultiSelectOption[]>([OPTIONS[0]])
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  return (
    <>
      <MultiSelectV2.MultiSelect
        onChange={options => setValue(options)}
        value={value}
        options={OPTIONS}
        placeholder="Select frameworks you like..."
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        // isLoading
        // disabled
      />
    </>
  )
}
