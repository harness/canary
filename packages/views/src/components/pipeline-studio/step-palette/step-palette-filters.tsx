import { Button, Icon, Toggle } from '@harnessio/canary'

const StepPaletteFiltersLayout = {
  Root: function Content({ children }: { children: React.ReactNode }) {
    return <div className="mt-3 flex flex-row gap-1">{children}</div>
  }
}

const StepPaletteFilters = (): JSX.Element => {
  return (
    <StepPaletteFiltersLayout.Root>
      <Button variant={'outline'} className="font-normal">
        <Icon name="filter-list" className="mr-2" />
        Filters
      </Button>
      <Toggle variant={'outline'} className="text-muted-foreground data-[state=on]:text-muted-foreground font-normal">
        Recommended <Icon name="x-mark" className="ml-2" />
      </Toggle>
    </StepPaletteFiltersLayout.Root>
  )
}

export { StepPaletteFilters }
