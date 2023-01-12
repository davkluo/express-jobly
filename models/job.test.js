"use strict"

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/********************************************create */

describe("create job", function () {
  const newJob = {
    title: "new",
    salary: 60000,
    equity: 0.3,
    companyHandle: 'c1'
    };

  test("works", async function () {
    const job = await Job.create(newJob);
    expect(job).toEqual({
      id: expect.any(Number),
      title: 'new',
      salary: 60000,
      equity: 0.3,
      companyHandle: "c1"
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle
       FROM jobs
       WHERE id = $1`,
       [job.id]
    );
    expect(result.rows).toEqual([
      {
        id: job.id,
        title: 'new',
        salary: 60000,
        equity: 0.3,
        companyHandle: "c1"
      }
    ]);
  });


})