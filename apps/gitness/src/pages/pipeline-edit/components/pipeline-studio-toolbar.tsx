import copy from 'clipboard-copy'
import cx from 'clsx'
import { noop } from 'lodash-es'

import { PipelineStudioToolbarActions, Topbar, VisualYamlToggle } from '@harnessio/views'

import { VisualYamlValue } from '../../../types/pipeline'
import { createAndDownloadBlob } from '../../../utils/common-utils'
import { usePipelineDataContext } from '../context/PipelineStudioDataProvider'

export const PipelineStudioToolbar = ({
  view,
  setView
}: {
  view: VisualYamlValue
  setView: (view: VisualYamlValue) => void
}) => {
  const {
    state: { isYamlValid, yamlRevision, pipelineData }
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
            onCopyClick={() => {
              copy(yamlRevision.yaml).then(() => {
                // TODO: toast
              })
            }}
            onDownloadClick={() => {
              createAndDownloadBlob(yamlRevision.yaml, `${pipelineData?.identifier}.yaml`)
            }}
            copyContent={yamlRevision.yaml}
            onEditClick={noop}
          />
        </Topbar.Right>
      )}
    </Topbar.Root>
  )
}
