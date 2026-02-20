import { useRef } from 'react'

import { Drawer } from '@harnessio/ui/components'
import { useExitConfirm } from '@views'

import { useUnifiedPipelineStudioContext } from '../context/unified-pipeline-studio-context'
import { RightDrawer } from '../types/right-drawer-types'
import { UnifiedPipelineStudioEntityForm } from './entity-form/unified-pipeline-studio-entity-form'
import { UnifiedPipelineStudioStepPalette } from './palette-drawer/unified-pipeline-step-palette-drawer'

export const UnifiedPipelineStepDrawer = () => {
  const { rightDrawer, setRightDrawer, clearRightDrawerData } = useUnifiedPipelineStudioContext()

  const isDirtyRef = useRef<boolean>()

  useExitConfirm()

  const handleClose = () => {
    setRightDrawer(RightDrawer.None)
    clearRightDrawerData()
  }

  return (
    <>
      <Drawer.Root
        open={rightDrawer === RightDrawer.Collection}
        onOpenChange={open => {
          if (!open) {
            handleClose()
          }
        }}
      >
        <Drawer.Content>
          <UnifiedPipelineStudioStepPalette
            requestClose={() => {
              handleClose()
            }}
            isDrawer
          />
        </Drawer.Content>
      </Drawer.Root>
      {/* TODO: temporary outside to bypass shadow dom issue */}
      <Drawer.Root
        open={rightDrawer === RightDrawer.Form}
        onOpenChange={open => {
          if (!open) {
            /**
             * @todo: This currently triggers even when closing the drawer without any unsaved changes. Needs a proper fix.
             */
            // if (isDirtyRef.current) {
            //   show({
            //     onConfirm: () => {
            //       handleClose()
            //     }
            //   })
            // }
            // else
            // {
            handleClose()
            // }
          }
        }}
      >
        <Drawer.Content>
          <UnifiedPipelineStudioEntityForm
            isDirtyRef={isDirtyRef}
            requestClose={() => {
              handleClose()
            }}
            isDrawer
          />
        </Drawer.Content>
      </Drawer.Root>
    </>
  )
}
