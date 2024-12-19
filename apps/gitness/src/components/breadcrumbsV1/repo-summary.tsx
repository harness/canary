import { useParams } from 'react-router-dom'

function RepoSummary() {
  const { projectId, repoId } = useParams<{ projectId: string; repoId: string }>()

  return (
    <div>
      <h1>Repository Summary</h1>
      <p>Project ID: {projectId}</p>
      <p>Repository ID: {repoId}</p>
    </div>
  )
}

export default RepoSummary
