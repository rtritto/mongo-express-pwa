import { atom } from 'recoil'

export const databasesState = atom({
  key: 'databasesState',
  default: [] as Mongo['databases']
})

export const collectionsState = atom({
  key: 'collectionsState',
  default: {} as Mongo['collections']
})

export const selectedDatabaseState = atom({
  key: 'selectedDatabaseState',
  default: '' as string
})

export const selectedCollectionState = atom({
  key: 'selectedCollectionState',
  default: '' as string
})

export const messageSuccessState = atom({
  key: 'messageSuccessState',
  default: undefined as string | undefined
})

export const messageErrorState = atom({
  key: 'messageErrorState',
  default: undefined as string | undefined
})