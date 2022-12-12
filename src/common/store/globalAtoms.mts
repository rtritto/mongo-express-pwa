import { atom } from 'recoil'

export const databasesState = atom({
  key: 'databasesState',
  default: []
})

export const selectedDbState = atom({
  key: 'selectedDbState',
  default: 'Databases'
})