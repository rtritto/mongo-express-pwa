add env var ME_CONFIG_OPTIONS_NO_EXPORT
DELETE many: opRes.result.n -> opRes.deletedCount
value.replace(/-/g, '') -> value.replaceAll('-', '')
toSafeBSON: null to undefined
/"<ObjectId>" to /<ObjectId>
removed options.maxPropSize and options.maxRowSize