import { useCallback } from 'react'

import { Sheet } from '@components/sheet'

import { useUnifiedPipelineStudioContext } from '../context/unified-pipeline-studio-context'
import { RightDrawer } from '../types/right-drawer-types'
import { UnifiedPipelineStudioEntityForm } from './entity-form/unified-pipeline-studio-entity-form'
import { UnifiedPipelineStudioStepPalette } from './palette-drawer/uinfied-pipeline-step-palette-drawer'

export const UnifiedPipelineRightDrawer = () => {
  const { rightDrawer, setRightDrawer, clearRightDrawerData } = useUnifiedPipelineStudioContext()

  const renderSheetContent = useCallback(() => {
    switch (rightDrawer) {
      case RightDrawer.Collection:
        return (
          <UnifiedPipelineStudioStepPalette
            requestClose={() => {
              setRightDrawer(RightDrawer.None)
              clearRightDrawerData()
            }}
          />
        )
      case RightDrawer.Form:
        return (
          <UnifiedPipelineStudioEntityForm
            requestClose={() => {
              setRightDrawer(RightDrawer.None)
              clearRightDrawerData()
            }}
          />
        )
      default:
        return null
    }
  }, [rightDrawer])

  return (
    <Sheet.Root
      open={rightDrawer !== RightDrawer.None}
      onOpenChange={open => {
        if (!open) {
          setRightDrawer(RightDrawer.None)
          clearRightDrawerData()
        }
      }}
    >
      <Sheet.Content
        onOpenAutoFocus={e => e.preventDefault()}
        hideCloseButton={true}
        className="max-w-lg p-0 sm:max-w-lg"
      >
        {renderSheetContent()}
      </Sheet.Content>
    </Sheet.Root>
  )
}
