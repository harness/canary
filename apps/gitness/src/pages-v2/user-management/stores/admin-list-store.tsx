import { create } from 'zustand'

import { IAdminListUsersStore, UsersProps } from '@harnessio/ui/views'

import { PageResponseHeader } from '../../../types'

export const useAdminListUsersStore = create<IAdminListUsersStore>(set => ({
  users: [],
  totalItems: 0,
  pageSize: 10,
  page: 1,
  password: null,
  user: null,
  generatePassword: false,
  setPage: page =>
    set({
      page
    }),
  setUsers: (data: UsersProps[]) => {
    set({
      users: data
    })
  },
  setPaginationFromHeaders: (headers: Headers) => {
    const totalItems = parseInt(headers?.get(PageResponseHeader.xTotal) || '0')
    const pageSize = parseInt(headers?.get(PageResponseHeader.xPerPage) || '10')

    set({
      totalItems,
      pageSize
    })
  },
  setPassword: (password: string) => {
    set({
      password
    })
  },
  setUser: (user: UsersProps) => {
    set({
      user
    })
  },
  setGeneratePassword: (generatePassword: boolean) => {
    set({
      generatePassword
    })
  }
}))
