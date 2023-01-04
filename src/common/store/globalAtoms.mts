import { atom } from 'recoil'

export const databasesState = atom({
  key: 'databasesState',
  default: []
})

export const collectionsState = atom({
  key: 'collectionsState',
  default: {}
})

export const selectedDatabaseState = atom({
  key: 'selectedDatabaseState',
  default: ''
})

export const selectedCollectionState = atom({
  key: 'selectedCollectionState',
  default: ''
})

export const messageSuccessState = atom({
  key: 'messageSuccessState',
  default: undefined
})

export const messageErrorState = atom({
  key: 'messageErrorState',
  default: undefined
})