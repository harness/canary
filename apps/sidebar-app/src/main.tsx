import { StrictMode } from 'react'
import { render } from 'react-dom'

import { AppRoot } from './app-root'

render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
  document.getElementById('root')
)
