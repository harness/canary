import { Params } from 'react-router-dom'

export interface RoutingProps {
  routes?: {
    toCreateRepo?: (params?: Params<string>) => string
    /*
    toLogout?: (params?: Params<string>) => string
    toHome?: (params?: Params<string>) => string
    */
  }
}
