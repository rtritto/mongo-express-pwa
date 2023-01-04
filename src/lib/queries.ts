import mongodb from 'mongodb'
import * as bson from './bson.ts'

declare interface QueryParameter {
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
declare type Query = ReturnType<typeof getQuery>
declare type QueryOptions = ReturnType<typeof getQueryOptions>
declare type Pipeline = Array<object>

export const getSort = (sort: { [key: string]: string }) => {
  const outSort: { [key: string]: number } = {}
  for (const i in sort) {
    outSort[i] = Number.parseInt(sort[i], 10)
  }
  return outSort
}

export const getQueryOptions = (query: QueryParameter) => {
  return {
    ...query.sort && { sort: getSort(query.sort) },
    limit: process.env.config.options.documentsPerPage,
    ...query.skip && { skip: Number.parseInt(query.skip, 10) || 0 },
    ...query.projection && { projection: bson.toSafeBSON(query.projection) as object || {} }
  }
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
    return bson.parseObjectId(value)
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
export const getQuery = (query: QueryParameter) => {
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
    const result = bson.toSafeBSON(jsonQuery)
    if (result === null) {
      throw new Error('Query entered is not valid')
    }
    return result
  }
  return {}
}

const getBaseAggregatePipeline = (pipeline: Pipeline, queryOptions: QueryOptions) => {
  return [
    ...pipeline,
    ...queryOptions.sort ? [{ $sort: 'sort' in queryOptions }] : [],
    ...queryOptions.projection ? [{ $project: 'projection' in queryOptions }] : []
  ]
}

export const getSimpleAggregatePipeline = (query: Query, queryOptions: QueryOptions) => {
  const pipeline = Object.keys(query).length > 0 ? [{ $match: query }] : []
  return [
    ...getBaseAggregatePipeline(pipeline, queryOptions),
    // https://stackoverflow.com/a/24161461/10413113
    { $limit: queryOptions.limit + 'skip' in queryOptions || 0 },
    ...'skip' in queryOptions ? [{ $skip: queryOptions.skip }] : []
  ]
}

export const getComplexAggregatePipeline = (pipeline: Pipeline, queryOptions: QueryOptions) => {
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