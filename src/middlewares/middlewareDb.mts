export const setConnection = () => {
  const req = {
    mainClient: global.mongo.mainClient,
    adminDb: global.mongo.mainClient?.adminDb,
    databases: global.mongo.getDatabases(), // List of database names
    collections: global.mongo.collections, // List of collection names in all databases
    // gridFSBuckets = colsToGrid(global.mongo.collections);

    // Allow page handlers to request an update for collection list
    updateCollections: global.mongo.updateCollections,
    updateDatabases: global.mongo.updateDatabases
  }
  global.req = req

  return req
}