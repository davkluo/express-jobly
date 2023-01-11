'use strict';

const { BadRequestError } = require("../expressError");

const FILTER_OPTIONS = {
  nameLike: {
    column: "name",
    operator: "ILIKE"
  },
  minEmployees: {
    column: "num_employees",
    operator: ">="
  },
  maxEmployees: {
    column: "num_employees",
    operator: "<="
  }
};

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
 * sqlForFilter: Given an object with filters, generate a string for the SQL
 * WHERE clause with placeholders and an array of values corresponding to those
 * placeholders. Return these in an object.
 *
 * filters: Object with filter data
 *
 * Returns object { whereConditions: String, values: Array }
 */

function sqlForFilter(filters) {
  // when the filters come in as { nameLike: 'blah', ....}
  // we can iterate through the keys of the filters
  // check if it's nameLike then you add a name ILIKE $1 to the string
  // if it's minEmployees you add a num_employees >= $1 to the string
  // if it's maxEmployees you add a num_employees <= $1 to the string





  // and then using the global FILTER_OPTIONS object,
  // we can obtain information on how to process that type of filter

  // nameLike
  // a = FILTER_OPTIONS['nameLike'] => gives me an object with {column, operator}
  // with the above information, I can make a piece of a string
  // with the format:
  // `${a.column} ${a.operator} $1`
  // `name ILIKE $1` `num_employees >= 2` `num_employees <= 2`

  // nameLike -> ILIKE %text%
  // minEmployee -> num_employees >= ____
  // max.... -> num_employees <= ____
  // `"name" ILIKE $1, "num_employees" >= $2, ....`
  // [values]


}

module.exports = { sqlForPartialUpdate };
