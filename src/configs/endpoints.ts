export const EP_DB = '/db'
export const EP_EXPORT_COLLECTION = (db: string, collection: string) => `${EP_DB}/${db}/export/${collection}`
export const EP_EXPORT_ARRAY_COLLECTION = (db: string, collection: string) => `${EP_DB}/${db}/exportArray/${collection}`
export const EP_IMPORT_COLLECTION = (db: string, collection: string) => `${EP_DB}/${db}/import/${collection}`