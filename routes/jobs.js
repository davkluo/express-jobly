"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");

const express = require("express");
const Job = require('../models/job');
// const {
//   ensureLoggedIn,
//   ensureIsAdmin,
//   ensureSameUserOrIsAdmin
// } = require("../middleware/auth");
// const { BadRequestError } = require("../expressError");
// const User = require("../models/user");
// const { createToken } = require("../helpers/tokens");

const router = express.Router();

router.get("/", async function (req, res, next) {
  Job.testFloatNumeric();
  return res.send('');
});

module.exports = router;
