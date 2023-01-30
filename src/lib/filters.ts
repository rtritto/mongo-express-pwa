import type { Binary, ObjectId } from 'bson'

import { addHyphensToUUID } from './utils.ts'

const uuid4ToString = (input: Binary) => {
  const hex = input.toString('hex') // same of input.buffer.toString('hex')
  return addHyphensToUUID(hex)
}

type Input = ObjectId | Binary | Date | string | undefined | null | InputObject
type InputObject = ObjectId & Binary & {
  [key: string]: Input
}
type Output = string | undefined | null | OutputObject
type OutputObject = {
  [key: string]: Output
}

const mapObject = async (obj: InputObject): Promise<Output | OutputObject> => {
  const valuesString = await Promise.all(Object.values(obj).map((value) => stringDocIDs(value)))
  const objOut: { [key: string]: Output | OutputObject } = {}
  for (const [index, field] of Object.keys(obj).entries()) {
    objOut[field] = valuesString[index]
  }
  return objOut
}

/**
 * Convert BSON into a plain string:
 * - { _bsontype: 'ObjectID', id: <Buffer> } => <ObjectId>
 * - { _bsontype: 'Binary', __id: undefined, sub_type: 4, position: 16, buffer: <Buffer> } => <UUID>
 * - { _bsontype: 'Binary', __id: undefined, sub_type: <number_not_4>, position: 16, buffer: <Buffer> } => <Binary>
 */
export const stringDocIDs = async (input: Input): Promise<Output | OutputObject> => {
  if (input && typeof input === 'object') {
    if (input instanceof Date) {
      return input.toJSON()
    }
    const { _bsontype } = input
    if (_bsontype) {
      if (_bsontype === 'Binary') {
        if (input.sub_type === 4) {
          return uuid4ToString(input)
        }
        return input.toJSON()
      }
      if (_bsontype === 'ObjectID') {
        return input.toString()
      }
    }
    return mapObject(input)
  }
  return input
}

// eslint-disable-next-line camelcase
export const is_URL = (input: string) => {
  return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[\da-z]+([.-][\da-z]+)*\.[a-z]{2,5}(:\d{1,5})?(\/.*)?$/.test(input)
}