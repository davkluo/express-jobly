# Jobly Backend
RESTful API backend for job board app.

The accompanying frontend can be found [here](https://github.com/davkluo/jobly-frontend).

## Table of Contents

- [Motivation](#motivation)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Running the App](#running-the-app)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [API](#api)
- [Future Improvements](#future-improvements)

## Motivation

- Create a full-stack job board application
- Develop software using the test-driven development (TDD) paradigm

## Tech Stack

Built with Express and PostgreSQL

## Setup

### Clone the repo

```bash
git clone git@github.com:davkluo/express-jobly.git
cd express-jobly
```

### Install dependencies

You will need `node` and `npm` installed globally on your machine.

```bash
npm install
```

### Set environment variables

```bash
cp .env.example .env
# open .env and modify the secret key environment variable
```

### Create and seed database

```bash
psql -f jobly.sql
```

### Configure NUMERIC field type parser

Include the following line in node_modules/pg-types/lib/textParsers.js:

```js
var init = function(register) {
    ...
    register(1700, parseFloat);
};
```

## Running the App

To start the server:

```bash
node server.js
```

## Testing

To run all tests:

```bash
jest -i
```

## Project Structure
```
\                                   # Root folder
 |--app.js                          # main routes
 |--app.test.js                     # tests for app.js
 |--config.js                       # app config
 |--config.test.js                  # tests for config.js
 |--db.js                           # setup for db
 |--expressError.js                 # custom errors with HTTP status codes
 |--jobly-schema.sql                # database schema script
 |--jobly-seed.sql                  # database seed script
 |--jobly.sql                       # database creation script
 |--package-lock.json               # dependencies and versions
 |--package.json                    # properties, scripts, & dependencies
 |--readme.md                       # project readme
 |--server.js                       # server startup
 
 \helpers                           # helper functions folder
  |--sql.js                         # sql generating helper functions
  |--sql.test.js                    # tests for sql.js
  |--tokens.js                      # token creating helper functions
  |--tokens.test.js                 # tests for token.js

 \middleware                        # middleware functions folder
  |--auth.js                        # middleware for authentication/authorization
  |--auth.test.js                   # tests for auth.js
  
 \models                            # database interaction models folder
  |--_testCommon.js                 # common resources for tests
  |--company.js                     # company model
  |--company.test.js                # tests for company.js
  |--job.js                         # job model
  |--job.test.js                    # tests for job.js
  |--user.js                        # user model
  |--user.test.js                   # tests for user.js
  
 \routes                            # route handlers folder
  |--_testCommon.js                 # common resources for tests
  |--auth.js                        # auth routes
  |--auth.test.js                   # tests for auth.js
  |--companies.js                   # companies routes
  |--companies.test.js              # tests for companies.js
  |--jobs.js                        # jobs routes
  |--jobs.test.js                   # tests for jobs.js
  |--users.js                       # users routes
  |--users.test.js                  # tests for users.js
  
 \schemas                           # jsonschemas for data validation
  |--companyFilter.json             # schema for filtering company results
  |--companyNew.json                # schema for creating new company
  |--companyUpdate.json             # schema for updating company
  |--jobFilter.json                 # schema for filtering job results
  |--jobNew.json                    # schema for creating new job
  |--jobUpdate.json                 # schema for updating job
  |--userAuth.json                  # schema for authenticating user
  |--userNew.json                   # schema for creating new user
  |--userRegister.json              # schema for registering new user
  |--userUpdate.json                # schema for updating user

```
## API
List of available routes:
**Auth routes**:\
`POST /auth/token` - authenticate user and receive a new JSON web token (JWT)\
`POST /auth/register` - register new user and receive a new JSON web token (JWT)

**Companies routes**:\
`GET /companies` - get companies with optional filtering\
`POST /companies` - create a new company (admin only)\
`GET /companies/:handle` - get a company with the company handle\
`PATCH /companies/:handle` - update a company (admin only)\
`DELETE /companies/:handle` - delete a company (admin only)

**Jobs routes**:\
`GET /jobs` - get jobs with optional filtering\
`POST /jobs` - create a new jobs (admin only)\
`GET /jobs/:id` - get a job by id\
`PATCH /jobs/:id` - update a job (admin only)\
`DELETE /jobs/:id` - delete a job (admin only)

**Users routes**:\
`GET /users` - get users (admin only)\
`POST /users` - create a new user (admin only)\
`GET /users/:username` - get a user by username (admin or same user only)\
`PATCH /users/:username` - update a user (admin or same user only)\
`DELETE /users/:username` - delete a user (admin or same user only)\
`POST /users/:username/jobs/:id` - apply user for a job (admin or same user only)

## Future Improvements
- Add technology tags for job postings
- Implement default random password for signup if not provided
