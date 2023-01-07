import mongodb from 'mongodb'

import { parseObjectId, toSafeBSON } from './bson.ts'

interface QueryParameter {
  // mongodb
  skip?: string
  sort?: { [key: string]: string }
  projection?: string
  // custom
  key?: string
  value?: string
  type?: string
  query?: string
}
interface QueryOptions {
  limit: number
  projection?: {
    [field: string]: number
  }
  skip?: number
  sort?: {
    [field: string]: number
  }
}
interface StageMatch { $match: MongoDocument }
interface StageSort { $sort: { [field: string]: number } }
interface StageLimit { $limit: number }
interface StageSkip { $skip: number }
interface StageFacet { $facet: { data: Pipeline } }
interface StageProject {
  $project: {
    'metadata.total': { $size: string }
    data: { $slice: [string, number] }
  }
}
type Stage = StageMatch | StageSort | StageLimit | StageSkip | StageFacet | StageProject
type Pipeline = (MongoDocument | Stage)[]

export const getSort = (sort: { [key: string]: string }) => {
  const outSort: { [key: string]: number } = {}
  for (const i in sort) {
    outSort[i] = Number.parseInt(sort[i], 10)
  }
  return outSort
}

export const getQueryOptions = (query: QueryParameter): QueryOptions => {
  const queryOptions: QueryOptions = {
    limit: process.env.config.options.documentsPerPage,
  }
  if (query.sort) {
    const sort = getSort(query.sort)
    if (Object.keys(sort).length > 0) {
      queryOptions.sort = sort
    }
  }
  if (query.skip) {
    const skip = Number.parseInt(query.skip, 10)
    if (skip) {
      queryOptions.skip = skip
    }
  }
  if (query.projection) {
    const projection = toSafeBSON(query.projection)
    if (projection) {
      queryOptions.projection = projection
    }
  }
  return queryOptions
}

const converters = {
  // If type == J, convert value as json document
  J(value: string) {
    return JSON.parse(value)
  },
  // If type == N, convert value to number
  // eslint-disable-next-line unicorn/prefer-native-coercion-functions
  N(value: string) {
    return Number(value)
  },
  // If type == O, convert value to ObjectId
  O(value: string) {
    return parseObjectId(value)
  },
  // If type == R, convert to RegExp
  R(value: string) {
    return new RegExp(value, 'i')
  },
  U(value: string) {
    return new mongodb.Binary(Buffer.from(value.replaceAll('-', ''), 'hex'), mongodb.Binary.SUBTYPE_UUID)
  },
  // if type == S, no conversion done
  S(value: string) {
    return value
  }
}

/*
 * Builds the Mongo query corresponding to the
 * Simple/Advanced parameters input.
 * Returns {} if no query parameters were passed in request.
 */
export const getQuery = (query: QueryParameter): MongoDocument => {
  const { key, value } = query
  if (key && value) {
    // if it is a simple query

    // 1. fist convert value to its actual type
    const { type } = query
    if (type) {
      const realType = type.toUpperCase()
      if (realType in converters) {
        const realValue = converters[realType as keyof typeof converters](value)

        // 2. then set query to it
        return { [key]: realValue }
      }
    }
    throw new Error(`Invalid query type: ${type}`)
  }
  const { query: jsonQuery } = query
  if (jsonQuery) {
    // if it is a complex query, take it as is
    const result = toSafeBSON(jsonQuery)
    if (result === undefined) {
      throw new Error('Query entered is not valid')
    }
    return result
  }
  return {}
}

const getBaseAggregatePipeline = (pipeline: Pipeline, queryOptions: QueryOptions): Pipeline => {
  return [
    ...pipeline,
    ...'sort' in queryOptions ? [{ $sort: queryOptions.sort }] : [],
    ...'projection' in queryOptions ? [{ $project: queryOptions.projection }] : []
  ]
}

export const getSimpleAggregatePipeline = (query: MongoDocument, queryOptions: QueryOptions): Pipeline => {
  const pipeline = Object.keys(query).length > 0 ? [{ $match: query }] : []
  const simpleAggregatePipeline = getBaseAggregatePipeline(pipeline, queryOptions)
  // https://stackoverflow.com/a/24161461/10413113
  const skip = 'skip' in queryOptions ? queryOptions.skip : 0
  if (skip === 0) {
    simpleAggregatePipeline.push({ $limit: queryOptions.limit })
  } else {
    simpleAggregatePipeline.push(
      { $limit: queryOptions.limit + skip },
      { $skip: skip }
    )
  }
  return simpleAggregatePipeline
}

export const getComplexAggregatePipeline = (pipeline: Pipeline, queryOptions: QueryOptions): Pipeline => {
  return [
    { $facet: { data: getBaseAggregatePipeline(pipeline, queryOptions) } },
    {
      $project: {
        'metadata.total': { $size: '$data' },
        data: {
          $slice: [
            '$data',
            'skip' in queryOptions ? queryOptions.skip : 0,
            queryOptions.limit
          ]
        }
      }
    }
  ]
}