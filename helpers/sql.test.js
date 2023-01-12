'use strict';

const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate, sqlForFilter } = require('./sql');
const { COMPANY_FILTER_OPTIONS } = require('../config');

const JS_TO_SQL = {
  firstName: "first_name",
  lastName: "last_name",
  isAdmin: "is_admin"
};

describe('test sqlForPartialUpdate helper function', function() {
  test('should return intended setCols and values', function() {
    const dataToUpdate = {
      firstName: "First",
      lastName: "Last",
      email: "newemail@email.com"
    };

    const { setCols, values } = sqlForPartialUpdate(dataToUpdate, JS_TO_SQL);

    expect(setCols).toEqual('"first_name"=$1, "last_name"=$2, "email"=$3');
    expect(values).toEqual(["First", "Last", "newemail@email.com"]);
  });

  test('should throw BadRequestError if given no data to update', function() {
    expect(() => {
      sqlForPartialUpdate({}, JS_TO_SQL);
    }).toThrow(BadRequestError);
  });

});

describe('test sqlForFilter helper function', function() {
  test('should return intended whereConditions and values', function() {
    const filters = {
      nameLike: "c2",
      minEmployees: 2,
      maxEmployees: 3
    };

    const { whereConditions, values } = sqlForFilter(filters,
                                                    COMPANY_FILTER_OPTIONS);

    expect(whereConditions).toEqual(
      '"name" ILIKE $1 AND "num_employees" >= $2 AND "num_employees" <= $3'
      );
    expect(values).toEqual(["%c2%", 2, 3]);
  });

  test('should throw BadRequestError if given no filter data', function() {
    expect(() => {
      sqlForFilter({}, COMPANY_FILTER_OPTIONS);
    }).toThrow(BadRequestError);
  });

});