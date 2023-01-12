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
 *  { firstName: "first_name", ...}
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

/**
 * sqlForFilter: Given an object with filters and an object defining the columns
 * and operators for each filter, generate a string for the SQL WHERE clause
 * with placeholders and an array of values corresponding to those placeholders.
 * Return these in an object.
 *
 * filters: Object with filter data
 *
 * Returns object { whereConditions: String, values: Array }
 */

function sqlForFilter(filters, filterOptions) {
  const keys = Object.keys(filters);
  if (keys.length === 0) throw new BadRequestError("No data");

  const conditions = keys.map((filter, idx) => {
    const { column, operator } = filterOptions[filter];

    if (operator === 'ILIKE') {
      filters[filter] = '%' + filters[filter] + '%';
    }

    return `"${column}" ${operator} $${idx + 1}`;
  });

  return {
    whereConditions: conditions.join(' AND '),
    values: Object.values(filters)
  };

  // Previous sqlForFilter implementation for reference

  // const cols = keys.map((colName, idx) => {
  //   if(colName === "nameLike") {
  //     values[idx] = "%"+values[idx]+"%"
  //     return `"name" ILIKE $${idx + 1}`
  //   } else if (colName === "minEmployees") {
  //       return `"num_employees" >= $${idx + 1}`
  //     } else if (colName === "maxEmployees") {
  //       return `"num_employees" <= $${idx + 1}`
  //     }
  // });

  // return {
  //   whereConditions: cols.join(", "),
  //   values
  // };
}

module.exports = { sqlForPartialUpdate, sqlForFilter };
