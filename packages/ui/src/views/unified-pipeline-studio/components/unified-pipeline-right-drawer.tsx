import { Drawer } from '@components/index'

import { useUnifiedPipelineStudioContext } from '../context/unified-pipeline-studio-context'
import { RightDrawer } from '../types/right-drawer-types'
import { UnifiedPipelineStudioEntityForm } from './entity-form/unified-pipeline-studio-entity-form'
import { UnifiedPipelineStudioStepPalette } from './palette-drawer/uinfied-pipeline-step-palette-drawer'

export const UnifiedPipelineRightDrawer = () => {
  const { rightDrawer, setRightDrawer, clearRightDrawerData } = useUnifiedPipelineStudioContext()

  return (
    <Drawer.Root
      direction="right"
      open={rightDrawer !== RightDrawer.None}
      onOpenChange={open => {
        if (!open) {
          setRightDrawer(RightDrawer.None)
          clearRightDrawerData()
        }
      }}
    >
      <Drawer.Content className="w-lg p-0">
        {/** onOpenAutoFocus={e => e.preventDefault()} */}
        <UnifiedPipelineStudioStepPalette
          requestClose={() => {
            setRightDrawer(RightDrawer.None)
            clearRightDrawerData()
          }}
        />
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
            />
          </Drawer.Content>
        </Drawer.Root>
      </Drawer.Content>
    </Drawer.Root>
  )
}
