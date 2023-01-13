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
  uAdminToken
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /companies", function () {
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

/************************************** GET /companies */

// describe("GET /companies", function () {
//   test("ok for anon", async function () {
//     const resp = await request(app).get("/companies");
//     expect(resp.body).toEqual({
//       companies:
//         [
//           {
//             handle: "c1",
//             name: "C1",
//             description: "Desc1",
//             numEmployees: 1,
//             logoUrl: "http://c1.img",
//           },
//           {
//             handle: "c2",
//             name: "C2",
//             description: "Desc2",
//             numEmployees: 2,
//             logoUrl: "http://c2.img",
//           },
//           {
//             handle: "c3",
//             name: "C3",
//             description: "Desc3",
//             numEmployees: 3,
//             logoUrl: "http://c3.img",
//           },
//         ],
//     });
//   });

//   test("fails: test next() handler", async function () {
//     // there's no normal failure event which will cause this route to fail ---
//     // thus making it hard to test that the error-handler works with it. This
//     // should cause an error, all right :)
//     await db.query("DROP TABLE companies CASCADE");
//     const resp = await request(app)
//       .get("/companies")
//       .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.statusCode).toEqual(500);
//   });

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

// });

// /************************************** GET /companies/:handle */

// describe("GET /companies/:handle", function () {
//   test("works for anon", async function () {
//     const resp = await request(app).get(`/companies/c1`);
//     expect(resp.body).toEqual({
//       company: {
//         handle: "c1",
//         name: "C1",
//         description: "Desc1",
//         numEmployees: 1,
//         logoUrl: "http://c1.img",
//       },
//     });
//   });

//   test("works for anon: company w/o jobs", async function () {
//     const resp = await request(app).get(`/companies/c2`);
//     expect(resp.body).toEqual({
//       company: {
//         handle: "c2",
//         name: "C2",
//         description: "Desc2",
//         numEmployees: 2,
//         logoUrl: "http://c2.img",
//       },
//     });
//   });

//   test("not found for no such company", async function () {
//     const resp = await request(app).get(`/companies/nope`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });

// /************************************** PATCH /companies/:handle */

// describe("PATCH /companies/:handle", function () {
//   test("works for admin users", async function () {
//     const resp = await request(app)
//       .patch(`/companies/c1`)
//       .send({
//         name: "C1-new",
//       })
//       .set("authorization", `Bearer ${uAdminToken}`);
//     expect(resp.body).toEqual({
//       company: {
//         handle: "c1",
//         name: "C1-new",
//         description: "Desc1",
//         numEmployees: 1,
//         logoUrl: "http://c1.img",
//       },
//     });
//   });

//   test("unauth for non-admin users", async function () {
//     const resp = await request(app)
//       .patch(`/companies/c1`)
//       .send({
//         name: "C1-new",
//       })
//       .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//       .patch(`/companies/c1`)
//       .send({
//         name: "C1-new",
//       });
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found on no such company", async function () {
//     const resp = await request(app)
//       .patch(`/companies/nope`)
//       .send({
//         name: "new nope",
//       })
//       .set("authorization", `Bearer ${uAdminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });

//   test("bad request on handle change attempt", async function () {
//     const resp = await request(app)
//       .patch(`/companies/c1`)
//       .send({
//         handle: "c1-new",
//       })
//       .set("authorization", `Bearer ${uAdminToken}`);
//     expect(resp.statusCode).toEqual(400);
//   });

//   test("bad request on invalid data", async function () {
//     const resp = await request(app)
//       .patch(`/companies/c1`)
//       .send({
//         logoUrl: "not-a-url",
//       })
//       .set("authorization", `Bearer ${uAdminToken}`);
//     expect(resp.statusCode).toEqual(400);
//   });
// });

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
