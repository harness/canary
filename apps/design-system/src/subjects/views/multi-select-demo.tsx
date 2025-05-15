import { useState } from 'react'

import { MultiSelectV2 } from '@harnessio/ui/components'

const OPTIONS: MultiSelectV2.MultiSelectOption[] = [
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
  const [value, setValue] = useState<MultiSelectV2.MultiSelectOption[]>([OPTIONS[0]])
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  return (
    <>
      <MultiSelectV2.MultiSelect
        onChange={options => setValue(options)}
        value={value}
        options={OPTIONS}
        placeholder="Select frameworks you like..."
        //   disallowCreation
        label="Frameworks"
        caption="Separate tags with commas or press Enter. Use the format key:value for object entries."
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        //   disabled
      />
    </>
  )
}
