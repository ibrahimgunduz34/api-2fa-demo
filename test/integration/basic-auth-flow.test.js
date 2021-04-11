const test = require('supertest');
const expressApp = require('../../src/app');
const HttpStatusCodes = require('http-status-codes');
const should = require('should');
const RequestBuilder = require('./utils/request-builder');
const uuid = require('uuid');

describe('authentication flow', function () {
  const context = {};

  describe('Positive flow', function () {
    describe('Register a user', function () {
      it('should create a user and return a response with HTTP/200 status code', async function () {
        const request = RequestBuilder.createRegisterRequest('myuser', 'mypassword');

        const expectedResponseBody = {
          success: true
        };

        await test(expressApp)
          .post(request.url)
          .set(request.headers)
          .send(request.body)
          .expect(HttpStatusCodes.OK, expectedResponseBody)
      })
    });

    describe('Authenticate the user', function () {
      it('should return a response with HTTP/200 status code and a body that contains session token', async function () {
        const request = RequestBuilder.createAuthenticateRequest('myuser', 'mypassword');

        const response = await test(expressApp)
          .post(request.url)
          .set(request.headers)
          .send(request.body)
          .expect(HttpStatusCodes.OK);

        should(response.body).have.properties(['shortLifeAccessToken', 'ttl']);

        context['authenticatedUser'] = response.body.shortLifeAccessToken;
      })
    });

    describe('Access an area in the secured context by access token', function () {
      it('should return a response with HTTP/200', async function () {
        const currentUser = context.authenticatedUser;
        const request = RequestBuilder.createValidRetrieveAdminDashboardRequest(currentUser);
        await test(expressApp)
          .get(request.url)
          .set(request.headers)
          .send()
          .expect(HttpStatusCodes.OK);
      })
    })
  });

  describe('Negative flow', function () {
    describe('Register an existing user', function () {
      it('should return an error response with HTTP/400 status code', async function () {
        const request = RequestBuilder.createRegisterRequest('myuser', 'mypassword');

        const expectedResponseBody = {
          error: "The user already exists."
        };

        await test(expressApp)
          .post(request.url)
          .set(request.headers)
          .send(request.body)
          .expect(HttpStatusCodes.BAD_REQUEST, expectedResponseBody)
      })
    });

    describe('Access a secured context without access token', function () {
      it('should return an error response with HTTP/403 status code', async function () {
        const request = RequestBuilder.createInvalidRetrieveAdminDashboardWithMissingAuthorizationHeader();

        const expectedResponse = {
          error: "You cannot access a secured area without access token"
        };

        await test(expressApp)
          .get(request.url)
          .set(request.headers)
          .send()
          .expect(HttpStatusCodes.FORBIDDEN, expectedResponse)
      })
    });

    describe('Access a secured context with invalid authorization header', function () {
      it('should return an error response with HTTP/400 status code', async function () {
        const request = RequestBuilder.createInvalidRetrieveAdminDashboardWithInvalidAuthorizationHeader();

        const expectedResponse = {
          error: "Invalid authorization header"
        };

        await test(expressApp)
          .get(request.url)
          .set(request.headers)
          .send()
          .expect(HttpStatusCodes.BAD_REQUEST, expectedResponse)
      })
    });

    describe('Access a secured context with invalid authorization type', function () {
      it('should return an error response with HTTP/400 status code', async function () {
        const request = RequestBuilder.createInvalidRetrieveAdminDashboardWithInvalidAuthorizationType();

        const expectedResponse = {
          error: "Invalid authorization type"
        };

        await test(expressApp)
          .get(request.url)
          .set(request.headers)
          .send()
          .expect(HttpStatusCodes.BAD_REQUEST, expectedResponse)
      })
    });

    describe('Access a secured context with invalid token', function () {
      it('should return an error response with HTTP/403 status code', async function () {
        const token = uuid.v4();
        const request = RequestBuilder.createValidRetrieveAdminDashboardRequest(token);

        const expectedResponse = {
          error: "No token found."
        };

        await test(expressApp)
          .get(request.url)
          .set(request.headers)
          .send()
          .expect(HttpStatusCodes.FORBIDDEN, expectedResponse)
      })
    });

    describe('Access a secured context with expired token', function () {

    });
  });
});