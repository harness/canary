import React from 'react'
import { Link } from 'react-router-dom'

const mockPullRequests = [
  { id: '1', name: 'Pull Request One', description: 'This is the first pull request.' },
  { id: '2', name: 'Pull Request Two', description: 'This is the second pull request.' },
  { id: '3', name: 'Pull Request Three', description: 'This is the third pull request.' }
]

export default function PullRequestList() {
  return (
    <div>
      <ul>
        {mockPullRequests.map(pr => (
          <li key={pr.id}>
            <Link to={pr.id}>Pull request {pr.id}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
