import { atom } from 'jotai'

export const databasesState = atom<Mongo['databases']>([])
export const collectionsState = atom<Mongo['collections']>({})
export const columnsState = atom<MongoDocument[]>([])
export const documentsState = atom<MongoDocument[]>([])
export const documentCountState = atom<number>(0)
export const selectedDatabaseState = atom<string>('')
export const selectedCollectionState = atom<string>('')
export const messageSuccessState = atom<string | undefined>(undefined)
export const messageErrorState = atom<string | undefined>(undefined)