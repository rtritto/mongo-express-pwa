import { atom } from 'recoil'

export const selectedDatabaseState = atom({
  key: 'selectedDatabaseState',
  default: ''
})

export const selectedCollectionState = atom({
  key: 'selectedCollectionState',
  default: ''
})