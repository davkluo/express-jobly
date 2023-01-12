"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate, sqlForFilter } = require("../helpers/sql");


/** Related functions for jobs. */

class Job {

  /** Create a job (from data), update db, return new job
   *
   * data should be {title, salary, equity, companyHandle}
   *
   * Returns {id, title, salary, equity, companyHandle}
   *
   * Throws BadRequestError if job already in database
   *
   */
  static async create({ title, salary, equity, companyHandle }) {
    const companyHandleCheck = await db.query(
      `SELECT handle
        FROM companies
        WHERE handle = $1`,
      [companyHandle]
    );

    if (companyHandleCheck.rows.length === 0) {
      throw new BadRequestError(`Invalid company handle: ${companyHandle}`);
    }

    const result = await db.query(
      `INSERT INTO jobs(
        title,
        salary,
        equity,
        company_handle
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
      [title, salary, equity, companyHandle]
    );

    const job = result.rows[0];

    return job;
  }

  /**
   * Find all jobs. Optional filters can be applied
   *
   * filters: Object with key-value pairs corresponding to the filter options
   * {title, minSalary, hasEquity}
   *
   * Returns [{id, title, salary, equity, companyHandle}, ...]
   */

  static async findAll(filters) {
    const jobsRes = await db.query(
      `SELECT id,
              title,
              salary,
              equity,
              company_handle AS "companyHandle"
         FROM jobs
         ORDER BY id`,
    );
    return jobsRes.rows;
  }

  /**
   * Given a job id, return data about a job.
   *
   * Returns {id, title, salary, equity, companyHandle}
   *
   * Throws NotFoundError if not found
   */

  static async get(id) {
    const jobRes = await db.query(
      `SELECT id,
              title,
              salary,
              equity,
              company_handle AS "companyHandle"
        FROM jobs
        WHERE id = $1`,
      [id]
    );

    const job = jobRes.rows[0];

    if (!job) throw new NotFoundError(`No job: ${job}`);

    return job;
  }

  /**
   * Update job data with 'data'.
   *
   ** This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {title, salary, equity}
   *
   * Returns {id, title, salary, equity, companyHandle}
   *
   * Throws NotFoundError if not found
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate( data, {} );
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `
      UPDATE jobs
      SET ${setCols}
        WHERE id = ${idVarIdx}
        RETURNING id, title, salary, equity, company_handle AS "companyHandle"`;
    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }

  /**
   * Delete given job from database; returns undefined.
   *
   * Throws NotFoundError if job not found
   *
   */

  static async remove(id) {

  }



}


module.exports = Job;
