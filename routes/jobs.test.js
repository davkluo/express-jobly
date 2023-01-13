"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  uAdminToken,
  testJob
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", function () {
  const newJob = {
    title: "new",
    salary: 60000,
    equity: 0.3,
    companyHandle: 'c1'
  };

  test("works for admin users", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send(newJob)
      .set("authorization", `Bearer ${uAdminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      job: {
        id: expect.any(Number),
        ...newJob
      }
    });

    // const jobId = resp.job.id;

    // const getCheck = await request(app)
    //   .get(`/jobs/${jobId}`);
    // expect(getCheck.body).toEqual({
    //   job: {
    //     id: jobId,
    //     ...newJob
    //   }
    // });
  });

  test("unauth for non-admin users", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send(newJob)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: "new",
        salary: 10
      })
      .set("authorization", `Bearer ${uAdminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: "new",
        salary: '60000',
        equity: 10,
        companyHandle: 'c1',
        extra: 50
      })
      .set("authorization", `Bearer ${uAdminToken}`);
      expect(resp.statusCode).toEqual(400);
    });

    test('bad request with invalid company handle', async function() {
      const resp = await request(app)
      .post('/jobs')
      .send({
        title: "new",
        salary: 60000,
        equity: 0.3,
        companyHandle: 'cNone'
      })
      .set("authorization", `Bearer ${uAdminToken}`);;
    expect(resp.statusCode).toEqual(400);
  })
});

/************************************** GET /jobs */

describe("GET /jobs", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({
      jobs:
        [
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
        ],
    });
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE jobs CASCADE");
    const resp = await request(app)
      .get("/jobs")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
  });

//   test("should filter company name (case insensitive)", async function () {
//     const filterData = { nameLike: "c2" };
//     const resp = await request(app)
//       .get("/companies")
//       .query(filterData);

//     expect(resp.statusCode).toEqual(200);
//     expect(resp.body).toEqual({
//       companies: [
//         {
//           handle: "c2",
//           name: "C2",
//           description: "Desc2",
//           numEmployees: 2,
//           logoUrl: "http://c2.img"
//         }
//       ]
//     });
//   });

//   test("should filter by minimum employees", async function () {
//     const filterData = { minEmployees: 2 };
//     const resp = await request(app)
//       .get("/companies")
//       .query(filterData);

//     expect(resp.statusCode).toEqual(200);
//     expect(resp.body).toEqual({
//       companies: [
//         {
//           handle: "c2",
//           name: "C2",
//           description: "Desc2",
//           numEmployees: 2,
//           logoUrl: "http://c2.img"
//         },
//         {
//           handle: "c3",
//           name: "C3",
//           description: "Desc3",
//           numEmployees: 3,
//           logoUrl: "http://c3.img",
//         }
//       ]
//     });
//   });

//   test("should filter by maximum employees", async function () {
//     const filterData = { maxEmployees: 2 };
//     const resp = await request(app)
//       .get("/companies")
//       .query(filterData);

//     expect(resp.statusCode).toEqual(200);
//     expect(resp.body).toEqual({
//       companies: [
//         {
//           handle: "c1",
//           name: "C1",
//           description: "Desc1",
//           numEmployees: 1,
//           logoUrl: "http://c1.img",
//         },
//         {
//           handle: "c2",
//           name: "C2",
//           description: "Desc2",
//           numEmployees: 2,
//           logoUrl: "http://c2.img"
//         }
//       ]
//     });
//   });

//   test("should filter by minimum and maximum employees", async function () {
//     const filterData = { minEmployees: 2, maxEmployees: 2 };
//     const resp = await request(app)
//       .get("/companies")
//       .query(filterData);

//     expect(resp.statusCode).toEqual(200);
//     expect(resp.body).toEqual({
//       companies: [
//         {
//           handle: "c2",
//           name: "C2",
//           description: "Desc2",
//           numEmployees: 2,
//           logoUrl: "http://c2.img"
//         }
//       ]
//     });
//   });

//   test("BadRequestError if minEmployees > maxEmployees", async function () {
//     const filterData = { minEmployees: 3, maxEmployees: 2 };
//     const resp = await request(app)
//       .get("/companies")
//       .query(filterData);

//     expect(resp.statusCode).toEqual(400);
//   });

//   test("BadRequestError if inappropriate filter", async function () {
//     const filterData = { minEmployees: 3, minRevenue: 2 };
//     const resp = await request(app)
//       .get("/companies")
//       .query(filterData);

//     expect(resp.statusCode).toEqual(400);
//   });

//   test("BadRequestError if data violates schema",
//     async function () {
//       const filterData = { nameLike: 1, minEmployees: 'one', maxEmployees: -1};
//       const resp = await request(app)
//         .get("/companies")
//         .query(filterData);

//       expect(resp.statusCode).toEqual(400);
//     }
//   );

});

// /************************************** GET /jobs/:id */

describe("GET /jobs/:id", function () {
  test("works for anon", async function () {
    const resp = await request(app).get(`/jobs/${testJob.id}`);
    expect(resp.body).toEqual({
      job: {
        id: testJob.id,
        title: 'accountant',
        salary: 50000,
        equity: 0.2,
        companyHandle: 'c1'
      },
    });
  });

  test("not found for no such job", async function () {
    const resp = await request(app).get(`/jobs/9999`);
    expect(resp.statusCode).toEqual(404);
  });
});

// /************************************** PATCH /companies/:handle */

describe("PATCH /jobs/:id", function () {
  test("works for admin users", async function () {
    const resp = await request(app)
      .patch(`/jobs/${testJob.id}`)
      .send({
        salary: 5,
      })
      .set("authorization", `Bearer ${uAdminToken}`);
    expect(resp.body).toEqual({
      job: {
        id: testJob.id,
        title: 'accountant',
        salary: 5,
        equity: 0.2,
        companyHandle: 'c1'
      },
    });
  });

  test("unauth for non-admin users", async function () {
    const resp = await request(app)
      .patch(`/jobs/${testJob.id}`)
      .send({
        equity: 0.5,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .patch(`/jobs/${testJob.id}`)
      .send({
        salary: 20,
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such job", async function () {
    const resp = await request(app)
      .patch(`/jobs/9999`)
      .send({
        salary: 500,
      })
      .set("authorization", `Bearer ${uAdminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on job id change attempt", async function () {
    const resp = await request(app)
      .patch(`/jobs/${testJob.id}`)
      .send({
        id: 9,
      })
      .set("authorization", `Bearer ${uAdminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on company handle change attempt", async function () {
    const resp = await request(app)
      .patch(`/jobs/${testJob.id}`)
      .send({
        companyHandle: "c2",
      })
      .set("authorization", `Bearer ${uAdminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on invalid data", async function () {
    const resp = await request(app)
      .patch(`/jobs/${testJob.id}`)
      .send({
        salary: "none",
      })
      .set("authorization", `Bearer ${uAdminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

// /************************************** DELETE /companies/:handle */

// describe("DELETE /companies/:handle", function () {
//   test("works for admin users", async function () {
//     const resp = await request(app)
//       .delete(`/companies/c1`)
//       .set("authorization", `Bearer ${uAdminToken}`);
//     expect(resp.body).toEqual({ deleted: "c1" });
//   });

//   test("unauth for non-admin users", async function () {
//     const resp = await request(app)
//       .delete(`/companies/c1`)
//       .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//       .delete(`/companies/c1`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found for no such company", async function () {
//     const resp = await request(app)
//       .delete(`/companies/nope`)
//       .set("authorization", `Bearer ${uAdminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });
