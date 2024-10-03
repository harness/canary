import cx from 'clsx'
import { PipelineStudioToolbarActions, Topbar, VisualYamlToggle } from '@harnessio/playground'
import { VisualYamlValue } from '../../../types/pipeline'
import { usePipelineDataContext } from '../context/PipelineStudioDataProvider'

export const PipelineStudioToolbar = ({
  view,
  setView
}: {
  view: VisualYamlValue
  setView: (view: VisualYamlValue) => void
}) => {
  const {
    state: { isYamlValid }
  } = usePipelineDataContext()

  return (
    <Topbar.Root className={cx({ ['border-b-0 bg-transparent']: view === 'visual' })}>
      <Topbar.Left>
        <VisualYamlToggle view={view} setView={setView} isYamlValid={isYamlValid} />
      </Topbar.Left>
      {/* <Topbar.Center>AITextEditor placeholder</Topbar.Center> */}
      {view === 'yaml' && (
        <Topbar.Right>
          <PipelineStudioToolbarActions
            onCopyClick={() => undefined}
            onDownloadClick={() => undefined}
            onEditClick={() => undefined}
          />
        </Topbar.Right>
      )}
    </Topbar.Root>
  )
}
