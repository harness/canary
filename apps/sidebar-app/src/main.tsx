import { StrictMode } from 'react'
import { render } from 'react-dom'

import { AppRoot } from './components/app-root'

render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
  document.getElementById('root')
)
