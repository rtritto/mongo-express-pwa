import { Binary } from 'mongodb'

import { parseObjectId, toSafeBSON } from './bson.ts'

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

/** @param sort example: sort=field1:1,field2:0 */
export const getSort = (sort: string) => {
  const outSort: { [key: string]: number } = {}
  const sorts = sort.split(',')
  for (const qp in sorts) {
    const [sortField, sortType] = qp.split(':')
    outSort[sortField] = Number.parseInt(sortType, 10)
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
  if (query.page) {
    // TODO add validation?
    const page = Number.parseInt(query.page, 10)
    if (page) {
      queryOptions.skip = (page - 1) * queryOptions.limit
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
    return new Binary(Buffer.from(value.replaceAll('-', ''), 'hex'), Binary.SUBTYPE_UUID)
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
  const baseAggregatePipeline = [...pipeline]
  const { sort, projection } = queryOptions
  if (sort !== undefined) {
    baseAggregatePipeline.push({ $sort: sort })
  }
  if (projection !== undefined) {
    baseAggregatePipeline.push({ $project: projection })
  }
  return baseAggregatePipeline
}

export const getSimpleAggregatePipeline = (query: MongoDocument, queryOptions: QueryOptions): Pipeline => {
  const pipeline = Object.keys(query).length > 0 ? [{ $match: query }] : []
  const simpleAggregatePipeline = getBaseAggregatePipeline(pipeline, queryOptions)
  // https://stackoverflow.com/a/24161461/10413113
  const { limit, skip = 0 } = queryOptions
  if (skip === 0) {
    simpleAggregatePipeline.push({ $limit: limit })
  } else {
    simpleAggregatePipeline.push(
      { $limit: limit + skip },
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
            queryOptions.skip || 0,
            queryOptions.limit
          ]
        }
      }
    }
  ]
}

export const getLastPage = (pageSize: number, totalCount: number): number => {
  // Float to Integer
  // result is 5 for:
  // - x=5
  // - 5<x<5.5
  // - 5.5<=x<6
  const result = Math.floor(totalCount / pageSize)

  return totalCount % pageSize
    ? result + 1
    : result
}