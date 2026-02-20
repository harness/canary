import { Drawer } from '@harnessio/ui/components'

import { useUnifiedPipelineStudioContext } from '../context/unified-pipeline-studio-context'
import { RightDrawer } from '../types/right-drawer-types'
import { UnifiedPipelineStudioPipelineConfigForm } from './pipeline-config/unified-pipeline-studio-pipeline-config-form'

export const UnifiedPipelinePipelineConfigDrawer = () => {
  const { rightDrawer, setRightDrawer, clearRightDrawerData } = useUnifiedPipelineStudioContext()

  return (
    <Drawer.Root
      direction="right"
      open={rightDrawer === RightDrawer.PipelineConfig}
      onOpenChange={open => {
        if (!open) {
          setRightDrawer(RightDrawer.None)
          clearRightDrawerData()
        }
      }}
    >
      <Drawer.Content className="w-lg" style={{ minWidth: '500px' }}>
        <UnifiedPipelineStudioPipelineConfigForm
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
