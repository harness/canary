import React from 'react'
import { Link } from 'react-router-dom'

const mockPipelines = [
  { id: '1', name: 'Pipeline One', description: 'This is the first pipeline.' },
  { id: '2', name: 'Pipeline Two', description: 'This is the second pipeline.' },
  { id: '3', name: 'Pipeline Three', description: 'This is the third pipeline.' }
]

const PipelineList: React.FC = () => {
  return (
    <div>
      <ul>
        {mockPipelines.map(pipeline => (
          <li key={pipeline.id}>
            <Link to={pipeline.id}>Pipeline {pipeline.id}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PipelineList
