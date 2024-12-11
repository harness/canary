import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Icon,
  NoData,
  Select,
  SelectContent,
  SelectItem,
  SkeletonList,
  Spacer
} from '@harnessio/ui/components'
import { ExecutionState, MeterState, PipelineList, SandboxLayout, type IPipeline } from '@harnessio/ui/views'

function mapExecutionStatusToMeterState(status: string): MeterState {
  switch (status) {
    case 'Success':
      return MeterState.Success
    case 'Failed':
      return MeterState.Error
    case 'Running':
      return MeterState.Warning
    default:
      return MeterState.Empty
  }
}

function mapExecutionStatusToExecutionState(status: string): ExecutionState {
  switch (status) {
    case 'Success':
      return ExecutionState.SUCCESS
    case 'Failed':
      return ExecutionState.FAILURE
    case 'Running':
      return ExecutionState.RUNNING
    default:
      return ExecutionState.UNKNOWN
  }
}

export default function Account() {
  const [accountId] = useState(localStorage.getItem('accountId'))
  const orgIdentifier = 'default'

  const [pipelines, setPipelines] = useState([])
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState('abhinavtest3')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!accountId) {
      navigate('/signin')
    }

    setLoading(true)
    fetch(
      `/pipeline/api/pipelines/list?routingId=${accountId}&accountIdentifier=${accountId}&projectIdentifier=${selectedProject}&orgIdentifier=${orgIdentifier}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          filterType: 'PipelineSetup'
        })
      }
    )
      .then(res => res.json())
      .then(res => {
        setPipelines(
          res.data.content.map(pipeline => {
            const lastExecution = pipeline.recentExecutionsInfo?.[0]
            return {
              id: pipeline.identifier,
              name: pipeline.name,
              status: lastExecution ? mapExecutionStatusToExecutionState(lastExecution.status) : undefined,
              timestamp: pipeline.lastUpdatedAt,
              description: lastExecution
                ? `${lastExecution.executorInfo.triggerType} by ${lastExecution.executorInfo.username}`
                : undefined,
              meter: pipeline.recentExecutionsInfo?.map(execution => {
                return {
                  id: execution.identifier,
                  state: mapExecutionStatusToMeterState(execution.status)
                }
              })
            } satisfies IPipeline
          })
        )
        setLoading(false)
      })

    fetch(
      `/ng/api/aggregate/projects?routingId=${accountId}&accountIdentifier=${accountId}&orgIdentifier=${orgIdentifier}&pageIndex=0&pageSize=20&sortOrders=name,ASC&onlyFavorites=false`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
      .then(res => res.json())
      .then(res => {
        setProjects(res.data.content)
      })
  }, [selectedProject])

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Icon name="harness" />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Icon name="harness-logo-text" height={15} width={65} size={65} />
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <Select
                placeholder="Select a Project"
                value={selectedProject}
                onValueChange={value => {
                  setSelectedProject(value)
                }}
              >
                <SelectContent>
                  {projects.map(project => {
                    return (
                      <SelectItem
                        key={project.projectResponse.project.identifier}
                        value={project.projectResponse.project.identifier}
                        // onClick={() => {
                        // setSelectedProject(project.projectResponse.project.identifier)
                        // }}
                      >
                        {project.projectResponse.project.name}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Pipelines</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Spacer size={6} />

        {loading ? <SkeletonList /> : null}
        {!loading && pipelines.length == 0 ? (
          <NoData title="No Pipelines" description={["It seems you don't have any pipelines yet."]} />
        ) : null}
        {!loading && pipelines.length > 0 ? <PipelineList pipelines={pipelines} /> : null}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
