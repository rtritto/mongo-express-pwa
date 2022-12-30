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

export const roughSizeOfObject = function (value: any) {
  const objectList: object[] = []

  return recurse(value, objectList)
}