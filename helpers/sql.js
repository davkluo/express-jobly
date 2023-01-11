'use strict';

const { BadRequestError } = require("../expressError");

/**
 * sqlForPartialUpdate: Given an object with data for an update operation and
 * an object with JS key to SQL column name mappings, generate a string for the
 * SQL SET statement with placeholders and an array of values corresponding to
 * those placeholders. Returns these in an object.
 *
 * dataToUpdate: Object with data to be updated { column: value, ...}
 * jsToSql: Object with JS key to SQL column name mappings
 *  { firstName: "first_name"}
 *
 * Returns object { setCols: String, values: Array }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
