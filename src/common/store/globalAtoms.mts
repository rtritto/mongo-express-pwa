import { atom } from 'recoil'

export const selectedDbState = atom({
  key: 'selectedDbState',
  default: ''
})

export const selectedCollectionState = atom({
  key: 'selectedCollectionState',
  default: ''
})