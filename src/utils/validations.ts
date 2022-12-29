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