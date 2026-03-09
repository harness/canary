import { StrictMode } from 'react'
import { render } from 'react-dom'

import App from './App'

import './styles.css'
import { TooltipProvider } from '@harnessio/ui/components'

render(
  <StrictMode>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </StrictMode>,
  document.getElementById('root')
)
