import { useNavigate, useParams } from 'react-router-dom'

const repos = [
  { id: 'uuid', name: 'UUID' },
  { id: 'k8s', name: 'Kubernetes' }
]

function RepoListing() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()

  const handleSelectRepo = (repoId: string) => {
    navigate(`/projects/${projectId}/repos/${repoId}`)
  }

  return (
    <div>
      <h1>Repositories in Project {projectId}</h1>
      <ul>
        {repos.map(repo => (
          <li key={repo.id}>
            <button onClick={() => handleSelectRepo(repo.id)} className="text-blue-500 hover:underline">
              {repo.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RepoListing
