"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureIsAdmin } = require("../middleware/auth");
const Job = require('../models/job');

const jobNewSchema = require('../schemas/jobNew.json');
const jobUpdateSchema = require('../schemas/jobUpdate.json');
const jobFilterSchema = require('../schemas/jobFilter.json');

const router = express.Router();

/** POST / { job } =>  { job }
 *
 * job should be { title, salary, equity, companyHandle }
 *
 * Returns { id, title, salary, equity, companyHandle }
 *
 * Authorization required: admin only
 */

router.post("/", ensureIsAdmin, async function (req, res, next) {
  const validator = jsonschema.validate(
    req.body,
    jobNewSchema,
    {required: true}
  );
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const job = await Job.create(req.body);
  return res.status(201).json({ job });
});

/** GET /  =>
 *   { jobs: [ { id, title, salary, equity, companyHandle }, ...] }
 *
 * Can filter on provided search filters:
 * - hasEquity
 * - minSalary
 * - title (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  // let filters;
  // if (Object.keys(req.query).length !== 0) {
  //   let queryFilters = req.query;

  //   if (queryFilters.minEmployees !== undefined) {
  //     queryFilters.minEmployees = Number(queryFilters.minEmployees);
  //   }

  //   if (queryFilters.maxEmployees !== undefined) {
  //     queryFilters.maxEmployees = Number(queryFilters.maxEmployees);
  //   }

    // const validator = jsonschema.validate(
    //   queryFilters,
    //   companyFilterSchema,
    //   {required: true}
    // );

  //   if (!validator.valid) {
  //     console.log('invalid!');
  //     const errs = validator.errors.map(e => e.stack);
  //     throw new BadRequestError(errs);
  //   }

  //   if (queryFilters.minEmployees !== undefined &&
  //     queryFilters.maxEmployees !== undefined &&
  //     queryFilters.minEmployees > queryFilters.maxEmployees) {
  //       throw new BadRequestError('minEmployees must be <= maxEmployees.')
  //     }

  //   filters = queryFilters;
  // }

  const jobs = await Job.findAll();

  return res.json({ jobs });
});

/** GET /[id]  =>  { job }
 *
 *  Job is { id, title, salary, equity, companyHandle }
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  const job = await Job.get(req.params.id);
  return res.json({ job });
});

/** PATCH /[id] { fld1, fld2, ... } => { job }
 *
 * Patches job data.
 *
 * fields can be: { title, salary, equity }
 *
 * Returns { id, title, salary, equity, companyHandle }
 *
 * Authorization required: admin only
 */

router.patch("/:id", ensureIsAdmin, async function (req, res, next) {
  const validator = jsonschema.validate(
    req.body,
    jobUpdateSchema,
    {required:true}
  );
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const job = await Job.update(req.params.id, req.body);
  return res.json({ job });
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin only
 */

router.delete("/:id", ensureIsAdmin, async function (req, res, next) {
  // await Company.remove(req.params.handle);
  // return res.json({ deleted: req.params.handle });
});

module.exports = router;
