"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate, sqlForFilter } = require("../helpers/sql");


/** Related functions for jobs. */

class Job {

  /**Create a job (from data), update db, return new job
   *
   * data should be {title, salary, equity, companyHandle}
   *
   * Returns {id, title, salary, equity, companyHandle}
   *
   * Throws BadRequestError if job already in database
   *
   */
  static async create({ title, salary, equity, companyHandle}) {

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

  }

  /**
   * Given a job id, return data about a job.
   *
   * Returns {id, title, salary, equity, companyHandle}
   *
   * Throws NotFoundError if not found
   */

  static async get(id) {

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
