`use strict`;

const storage = require('../../src/storage');
const expressApp = require('../../src/app');
const uuid = require('uuid');
const test = require('supertest');
const RequestBuilder = require('./utils/request-builder');
const HttpStatusCodes = require('http-status-codes');
const sinon = require('sinon');


describe('Security - Access Control Tests', function () {
  const context = {};

  before(async function () {
    const username = `myuser-${uuid.v4()}`;
    const registerRequest = RequestBuilder.createRegisterRequest(username, 'mypassword');

    await test(expressApp)
      .post(registerRequest.url)
      .set(registerRequest.headers)
      .send(registerRequest.body)
      .expect(HttpStatusCodes.CREATED);

    const authenticateRequest = RequestBuilder.createAuthenticateRequest(username, 'mypassword');

    const authenticateResponse = await test(expressApp)
      .post(authenticateRequest.url)
      .set(authenticateRequest.headers)
      .send(authenticateRequest.body)
      .expect(HttpStatusCodes.OK);

    context['accessToken'] = authenticateResponse.body.shortLifeAccessToken;
  });

  describe('Positive flow', function () {
    describe('When a request received targeted to a secured area and with a valid access token', function () {
      it('should allow access to the secured area', async function () {
        const retrieveAdminDashboardRequest = RequestBuilder
          .createValidRetrieveAdminDashboardRequest(context['accessToken']);

        await test(expressApp)
          .get(retrieveAdminDashboardRequest.url)
          .set(retrieveAdminDashboardRequest.headers)
          .send(retrieveAdminDashboardRequest.body)
          .expect(HttpStatusCodes.OK);
      });
    });
  });

  describe('Negative flow', function () {
    describe('When a request received targeted to a secured area and without access token', function () {
      it('show block access to the secured area and return response with HTTP/403 status code ', async function () {
        const retrieveAdminDashboardRequest = RequestBuilder
          .createInvalidRetrieveAdminDashboardWithMissingAuthorizationHeader();

        const expectedResponseBody = {
          error: "You cannot access a secured area without access token"
        };

        await test(expressApp)
          .get(retrieveAdminDashboardRequest.url)
          .set(retrieveAdminDashboardRequest.headers)
          .send(retrieveAdminDashboardRequest.body)
          .expect(HttpStatusCodes.FORBIDDEN, expectedResponseBody);
      });
    });

    describe('When a request received targeted to a secured area and with invalid access token', function () {
      it('show block access to the secured area and return response with HTTP/403 status code ', async function () {
        const retrieveAdminDashboardRequest = RequestBuilder
          .createValidRetrieveAdminDashboardRequest('invalid-access-token');

        const expectedResponseBody = {
          error: "No token found."
        };

        await test(expressApp)
          .get(retrieveAdminDashboardRequest.url)
          .set(retrieveAdminDashboardRequest.headers)
          .send(retrieveAdminDashboardRequest.body)
          .expect(HttpStatusCodes.FORBIDDEN, expectedResponseBody);
      });
    });

    describe('When a request received targeted to a secured area and with invalid authorization header', function () {
      it('show block access to the secured area and return response with HTTP/400 status code ', async function () {
        const retrieveAdminDashboardRequest = RequestBuilder
          .createInvalidRetrieveAdminDashboardWithInvalidAuthorizationHeader();

        const expectedResponseBody = {
          error: "Invalid authorization header"
        };

        await test(expressApp)
          .get(retrieveAdminDashboardRequest.url)
          .set(retrieveAdminDashboardRequest.headers)
          .send(retrieveAdminDashboardRequest.body)
          .expect(HttpStatusCodes.BAD_REQUEST, expectedResponseBody);
      });
    });

    describe('When a request received targeted to a secured area and with invalid authorization type', function () {
      it('show block access to the secured area and return response with HTTP/400 status code ', async function () {
        const retrieveAdminDashboardRequest = RequestBuilder
          .createInvalidRetrieveAdminDashboardWithInvalidAuthorizationType();

        const expectedResponseBody = {
          error: "Invalid authorization type"
        };

        await test(expressApp)
          .get(retrieveAdminDashboardRequest.url)
          .set(retrieveAdminDashboardRequest.headers)
          .send(retrieveAdminDashboardRequest.body)
          .expect(HttpStatusCodes.BAD_REQUEST, expectedResponseBody);
      });
    });

    describe('When a request received targeted to a secured area and with expired access token', function () {
      it('show block access to the secured area and return response with HTTP/403 status code ', async function () {
        const accessToken = 'e8e3c10a-6d49-4452-aea5-c6cc9a8e24ca';

        sinon.stub(storage, 'users').value([
          {
            id: '31c99bdb-fcd4-443e-a404-a267477dd5dd',
            username: 'myuser',
            password: 'WqfIWqQKVYXEwMTo8CbMygdh3gK0p5Sn6p+48JSeS6O1DNjK6xk=',
          }
        ]);

        sinon.stub(storage, 'access_tokens').value([
          {
            userId: '31c99bdb-fcd4-443e-a404-a267477dd5dd',
            accessToken: accessToken,
            createdAt: new Date().setTime(Date.now() - (1000 * 60 * 60)),
            ttl: 300,
          }
        ]);


        const expectedResponseBody = {
          error: "The token is not valid anymore"
        };

        const retrieveAdminDashboardRequest = RequestBuilder
          .createValidRetrieveAdminDashboardRequest(accessToken);

        await test(expressApp)
          .get(retrieveAdminDashboardRequest.url)
          .set(retrieveAdminDashboardRequest.headers)
          .send(retrieveAdminDashboardRequest.body)
          .expect(HttpStatusCodes.FORBIDDEN, expectedResponseBody);
      })
    });
  });
});