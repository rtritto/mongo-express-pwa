import deepEqual from 'fast-deep-equal'
import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

export const databasesState = atom<Mongo['databases']>([])
export const collectionsState = atom<Mongo['collections']>({})
export const columnsState = atomFamily((initialState: MongoDocument[]) => atom(initialState), deepEqual)
export const documentsState = atomFamily((initialState: MongoDocument[]) => atom(initialState), deepEqual)
export const selectedDatabaseState = atom<string>('')
export const selectedCollectionState = atom<string>('')
export const messageSuccessState = atom<string | undefined>(undefined)
export const messageErrorState = atom<string | undefined>(undefined)