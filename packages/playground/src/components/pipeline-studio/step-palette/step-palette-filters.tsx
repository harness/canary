import React from 'react'
import { Button, Toggle } from '@harnessio/canary'
import { Xmark, FilterList } from '@harnessio/icons-noir'

const StepPaletteFiltersLayout = {
  Root: function Content({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-row gap-1 mt-3">{children}</div>
  }
}

const StepPaletteFilters = (): JSX.Element => {
  return (
    <StepPaletteFiltersLayout.Root>
      <Button variant={'outline'} className="font-normal">
        <FilterList className="mr-2" />
        Filters
      </Button>
      <Toggle variant={'outline'} className="text-muted-foreground data-[state=on]:text-muted-foreground font-normal">
        Recommended <Xmark className="ml-2" />
      </Toggle>
    </StepPaletteFiltersLayout.Root>
  )
}

export { StepPaletteFilters }
