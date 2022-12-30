export const colsToGrid = function (cols) {
  // Generate list of GridFS buckets
  // takes databases, filters by having suffix of '.files' and also a corresponding '.chunks' in the DB list, then returns just the prefix name.

  // cols comes in an object of all databases and all their collections
  // return an object of all databases and all potential GridFS x.files & x.chunks

  const rets = _.clone(cols);

  _.each(rets, (val, key) => {
    rets[key] = _.map(
      _.filter(rets[key], (col) => col.toString().slice(-6) === '.files' && _.intersection(rets[key], [col.toString().slice(0, -6) + '.chunks'])),
      (col) => col.toString().slice(0, -6),
    ).sort();
  });

  return rets;
};