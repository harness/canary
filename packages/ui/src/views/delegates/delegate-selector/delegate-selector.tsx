import { useState } from 'react'

import { Drawer, Icon, StyledLink } from '@/components'

import { DelegateItem, TranslationStore } from '@/views'
import { DelegateSelectorForm, DelegateSelectorFormFields, DelegateSelectionTypes } from './delegate-selector-form';
import { DelegateSelectorInput } from './delegate-selector-input';

const renderSelectedValue = (type: DelegateSelectionTypes | null, tags: string[]) =>
  type === DelegateSelectionTypes.TAGS ? tags.join(', ') : type === DelegateSelectionTypes.ANY ? 'any delegate' : null

interface UseTranslationStoreProps {
  useTranslationStore: () => TranslationStore
}

interface DelegatesSelectorProps {
  delegates: DelegateItem[]
  isDelegateSelected: (selectors: string[], tags: string[]) => boolean
  getMatchedDelegatesCount: (delegates: DelegateItem[], tags: string[]) => number
  tagsList: string[]
}

/* ----------  DRAWER COMPONENT  -------------- */
interface DrawerProps extends UseTranslationStoreProps, DelegatesSelectorProps {
  open: boolean
  delegates: DelegateItem[]
  setOpen: (open: boolean) => void
  preSelectedTags: string[]
  onSubmit: (data: DelegateSelectorFormFields) => void
  disableAnyDelegate?: boolean
  isDelegateSelected: (selectors: string[], tags: string[]) => boolean
  getMatchedDelegatesCount: (delegates: DelegateItem[], tags: string[]) => number
  tagsList: string[]
}

const DelegateSelectorDrawer = ({
  open,
  setOpen,
  delegates,
  tagsList,
  preSelectedTags,
  onSubmit,
  disableAnyDelegate,
  isDelegateSelected,
  getMatchedDelegatesCount,
  useTranslationStore
}: DrawerProps) => (
  <Drawer.Root open={open} onOpenChange={setOpen} direction="right">
    <Drawer.Content className="w-1/2 overflow-y-auto overflow-x-hidden p-0">
      <Drawer.Header className="z-1 bg-cn-background-2 sticky top-0 -ml-5 w-[calc(100%+theme('spacing.10'))] gap-0 border-b px-5">
        <Drawer.Title className="text-cn-foreground-1 p-5 text-xl">Delegate selector</Drawer.Title>
        <Drawer.Close onClick={() => setOpen(false)} />
      </Drawer.Header>

      <div className="flex p-5 pb-0">
        Haven&apos;t installed a delegate yet?
        <StyledLink className="ml-1 flex flex-row items-center" variant="accent" to="#">
          Install delegate <Icon name="attachment-link" className="ml-1" size={12} />
        </StyledLink>
      </div>

      <DelegateSelectorForm
        delegates={delegates}
        tagsList={tagsList}
        useTranslationStore={useTranslationStore}
        isLoading={false}
        onFormSubmit={onSubmit}
        onBack={() => setOpen(false)}
        isDelegateSelected={isDelegateSelected}
        getMatchedDelegatesCount={getMatchedDelegatesCount}
        preSelectedTags={preSelectedTags}
        disableAnyDelegate={disableAnyDelegate}
      />
    </Drawer.Content>
  </Drawer.Root>
)

interface DelegateSelectorProps extends UseTranslationStoreProps, DelegatesSelectorProps {}

/* ----------  MAIN COMPONENT  -------------------------- */
export const DelegateSelector = ({
   delegates,
   isDelegateSelected,
   getMatchedDelegatesCount,
   tagsList,
   useTranslationStore
}: DelegateSelectorProps) => {
  /* ---- FIRST (ANY allowed) ---- */
  const [openA, setOpenA] = useState(false)
  const [typeA, setTypeA] = useState<DelegateSelectionTypes | null>(null)
  const [tagsA, setTagsA] = useState<string[]>([])

  /* ---- SECOND (ANY disabled) --- */
  const [openB, setOpenB] = useState(false)
  const [typeB, setTypeB] = useState<DelegateSelectionTypes | null>(null)
  const [tagsB, setTagsB] = useState<string[]>([])

  const handleSubmitA = ({ type, tags }: DelegateSelectorFormFields) => {
    setTypeA(type === DelegateSelectionTypes.ANY ? DelegateSelectionTypes.ANY : DelegateSelectionTypes.TAGS)
    setTagsA(type === DelegateSelectionTypes.TAGS ? tags.map(t => t.id) : [])
    setOpenA(false)
  }

  const handleSubmitB = ({ tags }: DelegateSelectorFormFields) => {
    setTypeB(DelegateSelectionTypes.TAGS)
    setTagsB(tags.map(t => t.id))
    setOpenB(false)
  }

  return (
    <div className="p-5">
      <DelegateSelectorInput
        placeholder={<StyledLink to="#">select a delegate</StyledLink>}
        value={renderSelectedValue(typeA, tagsA)}
        label="Delegate selector"
        onClick={() => setOpenA(true)}
        onEdit={() => setOpenA(true)}
        onClear={() => setTagsA([])}
        renderValue={tag => tag}
        className="mb-8 max-w-xs"
      />

      <DelegateSelectorDrawer
        open={openA}
        setOpen={setOpenA}
        preSelectedTags={tagsA}
        onSubmit={handleSubmitA}
        useTranslationStore={useTranslationStore}
        delegates={delegates}
        isDelegateSelected={isDelegateSelected}
        getMatchedDelegatesCount={getMatchedDelegatesCount}
        tagsList={tagsList}
      />

      <div className="pt-10">
        <DelegateSelectorInput
          placeholder={<StyledLink to="#">select a delegate (any disabled)</StyledLink>}
          value={renderSelectedValue(typeB, tagsB)}
          label="Delegate selector"
          onClick={() => setOpenB(true)}
          onEdit={() => setOpenB(true)}
          onClear={() => setTagsB([])}
          renderValue={tag => tag}
          className="mb-8 max-w-xs"
        />

        <DelegateSelectorDrawer
          open={openB}
          setOpen={setOpenB}
          preSelectedTags={tagsB}
          onSubmit={handleSubmitB}
          useTranslationStore={useTranslationStore}
          disableAnyDelegate
          delegates={delegates}
          isDelegateSelected={isDelegateSelected}
          getMatchedDelegatesCount={getMatchedDelegatesCount}
          tagsList={tagsList}
        />
      </div>
    </div>
  )
}
