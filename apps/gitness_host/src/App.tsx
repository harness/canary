import { lazy, Suspense } from 'react'

import viteLogo from '/vite.svg'

import reactLogo from './assets/react.svg'

import './App.css'

const Remote = lazy(async () => import('gitness/PipelineList'))

function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Suspense fallback="Loading...">
          <Remote />
        </Suspense>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  )
}

export default App
