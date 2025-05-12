import { Drawer } from '@/components'

import { useUnifiedPipelineStudioContext } from '../context/unified-pipeline-studio-context'
import { RightDrawer } from '../types/right-drawer-types'
import { UnifiedPipelineStudioStageConfigForm } from './stage-config/unified-pipeline-studio-stage-config-form'

export const UnifiedPipelineStageConfigDrawer = () => {
  const { rightDrawer, setRightDrawer, clearRightDrawerData } = useUnifiedPipelineStudioContext()

  return (
    <Drawer.Root
      direction="right"
      open={rightDrawer === RightDrawer.StageConfig}
      onOpenChange={open => {
        if (!open) {
          setRightDrawer(RightDrawer.None)
          clearRightDrawerData()
        }
      }}
    >
      <Drawer.Content className="w-lg" style={{ minWidth: '500px' }}>
        <UnifiedPipelineStudioStageConfigForm
          requestClose={() => {
            setRightDrawer(RightDrawer.None)
            clearRightDrawerData()
          }}
          isDrawer
        />
      </Drawer.Content>
    </Drawer.Root>
  )
}
