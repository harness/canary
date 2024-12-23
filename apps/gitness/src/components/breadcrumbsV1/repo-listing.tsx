import { useNavigate, useParams } from 'react-router-dom'

import { PathParams } from '../../RouteDefinitions'

const repos = [
  { id: 'uuid', name: 'UUID' },
  { id: 'k8s', name: 'Kubernetes' }
]

function RepoListing() {
  const { spaceId } = useParams<PathParams>()
  const navigate = useNavigate()

  const handleSelectRepo = (repoId: string) => {
    navigate(`/${spaceId}/repos/${repoId}`)
  }

  return (
    <div>
      <h1>Repositories in Project {spaceId}</h1>
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
