import { Drawer } from '@/components'

import { useUnifiedPipelineStudioContext } from '../context/unified-pipeline-studio-context'
import { RightDrawer } from '../types/right-drawer-types'
import { UnifiedPipelineStudioEntityForm } from './entity-form/unified-pipeline-studio-entity-form'
import { UnifiedPipelineStudioStepPalette } from './palette-drawer/uinfied-pipeline-step-palette-drawer'

export const UnifiedPipelineStepDrawer = () => {
  const { rightDrawer, setRightDrawer, clearRightDrawerData } = useUnifiedPipelineStudioContext()

  return (
    <>
      <Drawer.Root
        direction="right"
        open={rightDrawer === RightDrawer.Collection}
        onOpenChange={open => {
          if (!open) {
            setRightDrawer(RightDrawer.None)
            clearRightDrawerData()
          }
        }}
      >
        <Drawer.Content className="w-lg p-0">
          <UnifiedPipelineStudioStepPalette
            requestClose={() => {
              setRightDrawer(RightDrawer.None)
              clearRightDrawerData()
            }}
            isDrawer
          />
        </Drawer.Content>
      </Drawer.Root>
      {/* TODO: temporary outside to bypass shadow dom issue */}
      <Drawer.Root
        nested={true}
        direction="right"
        open={rightDrawer === RightDrawer.Form}
        onOpenChange={open => {
          if (!open) {
            setRightDrawer(RightDrawer.None)
            clearRightDrawerData()
          }
        }}
      >
        <Drawer.Content className="w-lg p-0">
          <UnifiedPipelineStudioEntityForm
            requestClose={() => {
              setRightDrawer(RightDrawer.None)
              clearRightDrawerData()
            }}
            isDrawer
          />
        </Drawer.Content>
      </Drawer.Root>
    </>
  )
}
