export const isValidCollectionName = (name: string) => {
  // if (name === undefined || name.length === 0) {
  //   return { error: true, message: 'You forgot to enter a collection name!' }
  // }

  // Collection names must begin with a letter, underscore, hyphen or slash, (tested v3.2.4)
  // and can contain only letters, underscores, hyphens, numbers, dots or slashes
  if (!/^[/A-Z_a-z-][\w./-]*$/.test(name)) {
    return false
  }

  return true
}

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

// https://docs.mongodb.com/manual/reference/limits/#naming-restrictions
export const isValidDatabaseNameRegex = (name: string) => {
  return /[ "$*./:<>?|]/.test(name) === false
}

export const isValidDatabaseName = (name: string | undefined) => {
  if (!name || name.length > 63) {
    return false
  }

  return isValidDatabaseNameRegex(name)
}