import { useRef } from 'react'

import { Drawer } from '@/components'
import { useExitConfirm } from '@/views'

import { useUnifiedPipelineStudioContext } from '../context/unified-pipeline-studio-context'
import { RightDrawer } from '../types/right-drawer-types'
import { UnifiedPipelineStudioStageConfigForm } from './stage-config/unified-pipeline-studio-stage-config-form'

export const UnifiedPipelineStageConfigDrawer = () => {
  const { rightDrawer, setRightDrawer, clearRightDrawerData } = useUnifiedPipelineStudioContext()

  const isDirtyRef = useRef<boolean>()

  const { show } = useExitConfirm()

  const handleClose = () => {
    setRightDrawer(RightDrawer.None)
    clearRightDrawerData()
  }

  return (
    <Drawer.Root
      direction="right"
      open={rightDrawer === RightDrawer.StageConfig}
      onOpenChange={open => {
        if (!open) {
          if (isDirtyRef.current) {
            show({
              onConfirm: () => {
                handleClose()
              }
            })
          } else {
            handleClose()
          }
        }
      }}
    >
      <Drawer.Content>
        <UnifiedPipelineStudioStageConfigForm isDirtyRef={isDirtyRef} requestClose={handleClose} isDrawer />
      </Drawer.Content>
    </Drawer.Root>
  )
}
