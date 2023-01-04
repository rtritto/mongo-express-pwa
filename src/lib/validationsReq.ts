import Validator from 'fastest-validator'

import { ReqBodyError } from './errors/index.mts'
import { isValidCollectionName, isValidDatabaseName } from './validations.ts'

type Body = object | ''

const customStringSchema = (fieldName: string, validator: (value: string) => { error?: string }) => ({
  [fieldName]: {
    type: 'string',
    optional: false,
    custom: (value, errors) => {
      const validation = validator(value)
      if ('error' in validation) {
        errors.push({ message: validation.error })
      }
      return value
    }
  },
  $$strict: true	// no additional properties allowed
})

const v = new Validator({
  useNewCustomCheckerFunction: true, // using new version
})

const validate = async (body: Body, schema: object) => {
  const checkResult = await v.compile(schema)(body === '' ? {} : body)
  if (checkResult !== true) {
    throw new ReqBodyError(checkResult.map(({ message }) => message).join(' '))
  }
}

const collectionReqBodySchema = customStringSchema('collection', isValidCollectionName)
const databaseReqBodySchema = customStringSchema('database', isValidDatabaseName)

export const validateCollectionReqBody = async (body: Body) => await validate(body, collectionReqBodySchema)

export const validateDatabaseReqBody = async (body: Body) => await validate(body, databaseReqBodySchema)