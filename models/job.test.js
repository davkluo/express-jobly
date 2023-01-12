"use strict"

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const { update } = require('./user.js');

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJob
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/******************************************** create */

describe("create job", function () {
  const newJob = {
    title: "new",
    salary: 60000,
    equity: 0.3,
    companyHandle: 'c1'
  };

  const invalidJob = {
    title: "new",
    salary: 60000,
    equity: 0.3,
    companyHandle: 'none'
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
        company_handle: "c1"
      }
    ]);
  });

  test("bad requests with invalid company handle", async function() {
    try {
      await Job.create(invalidJob);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
})

// /******************************************** findAll */

describe('findAll', function() {
  test('works: no filter', async function() {
    const jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: 'accountant',
        salary: 50000,
        equity: 0.2,
        companyHandle: 'c1'
      },
      {
        id: expect.any(Number),
        title: 'clerk',
        salary: 40000,
        equity: 0,
        companyHandle: 'c2'
      }
    ]);
  });

  //filter tests to come later
})

// /******************************************** get */

describe('get', function() {
  test('works', async function() {
    const job = await Job.get(testJob.id);
    expect(job).toEqual({
      id: testJob.id,
      title: 'accountant',
      salary: 50000,
      equity: 0.2,
      companyHandle: 'c1'
    });
  });

  test('NotFoundError if no such job', async function() {
    try {
      await Job.get(99999);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// /******************************************** update */

describe('update', function() {
  const updateData = {
    title: 'New',
    salary: 1,
    equity: .1
  };

  test('works', async function() {
    const job = await Job.update(testJob.id, updateData);
    expect(job).toEqual({
      id: testJob.id,
      companyHandle: 'c1',
      ...updateData
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle
        FROM jobs
        WHERE id = $1`,
      [testJob.id]
    );
    expect(result.rows).toEqual([{
      id: testJob.id,
      company_handle: 'c1',
      ...updateData
    }]);
  });

  test('works: null fields', async function() {
    const updateDataSetNulls = {
      title: 'New',
      salary: null,
      equity: null
    };

    const job = await Job.update(testJob.id, updateDataSetNulls);
    expect(job).toEqual({
      id: testJob.id,
      companyHandle: 'c1',
      ...updateDataSetNulls
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle
        FROM jobs
        WHERE id = $1`,
      [testJob.id]
    );
    expect(result.rows).toEqual([{
      id: testJob.id,
      company_handle: 'c1',
      ...updateDataSetNulls
    }]);
  });

  test('NotFoundError if no such job', async function() {
    try {
      await Job.update(99999, updateData);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test('BadRequestError if no data', async function() {
    try {
      await Job.update(testJob.id, {});
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

// /******************************************** remove */

// describe('remove', function() {
//   test('works', async function() {
//     await Job.remove(testJob.id);
//     const result = await db.query(
//       `SELECT id
//         FROM jobs
//         WHERE id = $1`,
//       [testJob.id]
//     );
//     expect(result.rows.length).toEqual(0);
//   });

//   test('NotFoundError if no such job', async function() {
//     try {
//       await Job.remove(99999);
//       throw new Error("fail test, you shouldn't get here");
//     } catch (err) {
//       expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });
// });