import React from 'react'
import { Link } from 'react-router-dom'

const mockRepositories = [
  { id: '1', name: 'Repo One', description: 'This is the first repository.' },
  { id: '2', name: 'Repo Two', description: 'This is the second repository.' },
  { id: '3', name: 'Repo Three', description: 'This is the third repository.' }
]

export default function RepoList() {
  return (
    <div>
      <ul>
        {mockRepositories.map(repo => (
          <li key={repo.id}>
            <Link to={`/repos/${repo.id}`}>Repository {repo.id}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
