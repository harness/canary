import React from 'react'
import ReactDOM from 'react-dom/client'

import Examples from './examples'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Examples />
  </React.StrictMode>
)
