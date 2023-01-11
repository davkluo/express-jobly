'use strict';

const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate } = require('./sql');

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