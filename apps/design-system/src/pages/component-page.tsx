import { FC } from 'react'
import { Route, Routes } from 'react-router-dom'

import { componentPages } from '@subjects/components/componentPages'

const ComponentPage: FC = () => (
  <Routes>
    {componentPages.map(props => (
      <Route key={props.path} {...props} />
    ))}
  </Routes>
)

export default ComponentPage
