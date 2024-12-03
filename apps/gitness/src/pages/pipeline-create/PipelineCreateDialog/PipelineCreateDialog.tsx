import { useNavigate, useParams } from 'react-router-dom'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Spacer } from '@harnessio/canary'
import { useCreatePipelineMutation } from '@harnessio/code-service-client'

import { useGetRepoRef } from '../../../framework/hooks/useGetRepoPath'
import { useGetSpaceURLParam } from '../../../framework/hooks/useGetSpaceParam'
import { PathParams } from '../../../RouteDefinitions'
import { CreateFormType } from '../../../types'
import { PipelineCreateForm } from './PipelineCreateForm'

interface CreatePipelineDialogProps {
  open: boolean
  onClose: () => void
}

export default function CreatePipelineDialog({ open, onClose }: CreatePipelineDialogProps) {
  const { repoId } = useParams<PathParams>()

  const spaceId = useGetSpaceURLParam()

  const repoRef = useGetRepoRef()

  const { mutateAsync: savePipeline } = useCreatePipelineMutation({})

  const navigate = useNavigate()

  const onSubmit = async (formValues: CreateFormType) => {
    const { branch, name, yamlPath } = formValues

    try {
      await savePipeline({
        repo_ref: repoRef,
        body: { config_path: yamlPath, default_branch: branch, identifier: name }
      })

      navigate(`/spaces/${spaceId}/repos/${repoId}/pipelines/${name}/edit`)
    } catch (e) {
      //🚨 Handle error by showing toast

      // if (e?.message) {
      //   toast({
      //     variant: 'destructive',
      //     description: e?.message
      //   })
      // }
      console.log(e, 'error')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] border-border bg-primary-background">
        <DialogHeader>
          <DialogTitle>Create Pipeline</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Spacer size={6} />
          <PipelineCreateForm onSubmit={onSubmit} onCancel={onClose} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
