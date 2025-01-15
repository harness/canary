import { Params } from 'react-router-dom'

export interface RoutingProps {
  routes: {
    toLogout: (params?: Params<string>) => string
    toHome: (params?: Params<string>) => string
  }
}
