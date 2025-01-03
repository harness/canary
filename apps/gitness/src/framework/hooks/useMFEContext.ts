import { useContext } from 'react'

import { MFEContext } from '../context/MFEContext'

export const useMFEContext = () => {
  return useContext(MFEContext)
}
