export const EP_DB = '/db'
export const EP_DATABASE = (database: string) => `${EP_DB}/${database}`
export const EP_DATABASE_COLLECTION = (database: string, collection: string) => `${EP_DB}/${database}/${collection}`

// API
export const EP_API_DB = `/api${EP_DB}`
export const EP_API_DATABASE = (database: string) => `/api${EP_DB}/${database}`
export const EP_API_DATABASE_COLLECTION = (database: string, collection: string) => `/api${EP_DB}/${database}/${collection}`
export const EP_EXPORT_COLLECTION = (database: string, collection: string) => `/api${EP_DB}/${database}/export/${collection}`
export const EP_EXPORT_ARRAY_COLLECTION = (database: string, collection: string) => `/api${EP_DB}/${database}/exportArray/${collection}`
export const EP_IMPORT_COLLECTION = (database: string, collection: string) => `/api${EP_DB}/${database}/import/${collection}`