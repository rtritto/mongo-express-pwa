const SIZES = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
const K = 1000
const LOG = Math.log(K)

// Given some size in bytes, returns it in a converted, friendly size
// credits: http://stackoverflow.com/users/1596799/aliceljm
export const bytesToSize = function bytesToSize(bytes: number) {
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / LOG)
  // eslint-disable-next-line no-restricted-properties
  return (bytes / (K ** i)).toPrecision(3) + ' ' + SIZES[i]
}

const deepmergeArray = (target: Array<object>, src: Array<object>) => {
  const dst = [...(target || [])]
  for (const [i, e] of src.entries()) {
    if (dst[i] === undefined) {
      dst[i] = e
    } else if (typeof e === 'object') {
      dst[i] = deepmerge(target[i], e)
    } else if (!target.includes(e)) {
      dst.push(e)
    }
  }
  return dst
}

interface IObject {
  [key: string]: any
}

const deepmergeObject = (target: IObject, src: IObject) => {
  const dst: IObject = {}
  if (target && typeof target === 'object') {
    for (const key of Object.keys(target)) {
      dst[key as keyof IObject] = target[key]
    }
  }
  for (const key of Object.keys(src)) {
    if (typeof src[key] !== 'object' || !src[key]) {
      dst[key] = src[key]
    } else if (target[key]) {
      dst[key] = deepmerge(target[key], src[key])
    } else {
      dst[key] = src[key]
    }
  }
  return dst
}

export const deepmerge = (target: Array<object> | object, src: Array<object> | object) => {
  if (Array.isArray(src)) {
    return deepmergeArray(target as Array<object>, src as Array<object>)
  }

  return deepmergeObject(target as object, src as object)
}

const recurse = function (value: any, objectList: object[]) {
  let bytes = 0

  if (typeof value === 'boolean') {
    bytes = 4
  } else if (typeof value === 'string') {
    bytes = value.length * 2
  } else if (typeof value === 'number') {
    bytes = 8
  } else if (typeof value === 'object' && !objectList.includes(value)) {
    objectList[objectList.length] = value

    for (const i in value) {
      bytes += 8 // an assumed existence overhead
      bytes += recurse(value[i], objectList)
    }
  }

  return bytes
}

export const roughSizeOfObject = (value: any) => {
  const objectList: object[] = []

  return recurse(value, objectList)
}

export const addHyphensToUUID = function (hex: string) {
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
}