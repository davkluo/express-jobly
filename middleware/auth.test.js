"use strict";

const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureIsAdmin,
  ensureSameUserOrIsAdmin,
} = require("./auth");


const { SECRET_KEY } = require("../config");
const testJwt = jwt.sign({ username: "test", isAdmin: false }, SECRET_KEY);
const badJwt = jwt.sign({ username: "test", isAdmin: false }, "wrong");

function next(err) {
  if (err) throw new Error("Got error from middleware");
}

describe("authenticateJWT", function () {
  test("works: via header", function () {
    const req = { headers: { authorization: `Bearer ${testJwt}` } };
    const res = { locals: {} };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({
      user: {
        iat: expect.any(Number),
        username: "test",
        isAdmin: false,
      },
    });
  });

  test("works: no header", function () {
    const req = {};
    const res = { locals: {} };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });

  test("works: invalid token", function () {
    const req = { headers: { authorization: `Bearer ${badJwt}` } };
    const res = { locals: {} };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });
});


describe("ensureLoggedIn", function () {
  test("works", function () {
    const req = {};
    const res = { locals: { user: { username: "test" } } };
    ensureLoggedIn(req, res, next);
  });

  test("unauth if no login", function () {
    const req = {};
    const res = { locals: {} };
    expect(() => ensureLoggedIn(req, res, next)).toThrowError();
  });
});


describe("ensureIsAdmin", function () {
  test("works", function () {
    const req = {};
    const res = { locals: {user: { isAdmin: true } } };
    ensureIsAdmin(req, res, next);
  });

  test("unauth if no login", function () {
    const req = {};
    const res = { locals: {} };
    expect(() => ensureIsAdmin(req, res, next)).toThrowError();
  });

  test("unauth if not admin", function () {
    const req = {};
    const res = { locals: {user: { isAdmin: false } } };
    expect(() => ensureIsAdmin(req, res, next)).toThrowError();
  });
});

describe("ensureSameUserOrIsAdmin", function () {
  test("works for same user", function () {
    const req = { params: { username: 'test' } };
    const res = { locals: { user: { username: 'test', isAdmin: false } } };
    ensureSameUserOrIsAdmin(req, res, next);
  });

  test("works for admin user", function () {
    const req = { params: { username: 'test' } };
    const res = { locals: { user: { username: 'nottest', isAdmin: true } } };
    ensureSameUserOrIsAdmin(req, res, next);
  });

  test("works for same user and admin", function () {
    const req = { params: { username: 'test' } };
    const res = { locals: { user: { username: 'test', isAdmin: true } } };
    ensureSameUserOrIsAdmin(req, res, next);
  });

  test("unauth if no login", function () {
    const req = { params: { username: 'test' } };
    const res = { locals: {} };
    expect(() => ensureSameUserOrIsAdmin(req, res, next)).toThrowError();
  });

  test("unauth if not admin and not same user", function () {
    const req = { params: { username: 'test' } };
    const res = { locals: {user: { username: 'nottest', isAdmin: false } } };
    expect(() => ensureSameUserOrIsAdmin(req, res, next)).toThrowError();
  });
});