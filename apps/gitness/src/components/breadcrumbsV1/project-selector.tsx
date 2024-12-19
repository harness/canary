import { useNavigate } from 'react-router-dom'

const projects = [
  { id: 'devops', name: 'DevOps' },
  { id: 'ci', name: 'CI' },
  { id: 'cd', name: 'CD' }
]

function ProjectSelector() {
  const navigate = useNavigate()

  const handleSelectProject = (projectId: string) => {
    navigate(`/projects/${projectId}/repos`)
  }

  return (
    <div>
      <h1>Select</h1>
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            <button onClick={() => handleSelectProject(project.id)} className="text-blue-500 hover:underline">
              {project.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProjectSelector
