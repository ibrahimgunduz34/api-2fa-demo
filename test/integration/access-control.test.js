`use strict`;

const expressApp = require('../../src/app');
const superTest = require('supertest');
const RequestBuilder = require('./utils/request-builder');
const HttpStatusCodes = require('http-status-codes');
const MockDataProvider = require('./utils/mock-data-provider');
const { ACCESS_TYPE_AUTHORIZED, ACCESS_TYPE_2FA } = require('../../src/security/access-type');

describe('Security - Access Control Tests', function () {
  describe('Positive flow', function () {
    describe('When a request received targeted to a secured area and with a valid access token', function () {
      it('should allow access to the secured area', async function () {
        const mockUser = MockDataProvider.createMockUserWithAccessToken(Date.now(), 300, ACCESS_TYPE_AUTHORIZED);

        const retrieveAdminDashboardRequest = RequestBuilder
          .createValidRetrieveAdminDashboardRequest(mockUser.accessToken);

        await superTest(expressApp)
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

        await superTest(expressApp)
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

        await superTest(expressApp)
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

        await superTest(expressApp)
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

        await superTest(expressApp)
          .get(retrieveAdminDashboardRequest.url)
          .set(retrieveAdminDashboardRequest.headers)
          .send(retrieveAdminDashboardRequest.body)
          .expect(HttpStatusCodes.BAD_REQUEST, expectedResponseBody);
      });
    });

    describe('When a request received targeted to a secured area and with expired access token', function () {
      it('show block access to the secured area and return response with HTTP/403 status code ', async function () {
        const mockUser = MockDataProvider.createMockUserWithAccessToken(new Date().setTime(Date.now() - (1000 * 60 * 60)), 300);

        const expectedResponseBody = {
          error: "The token is not valid anymore"
        };

        const retrieveAdminDashboardRequest = RequestBuilder
          .createValidRetrieveAdminDashboardRequest(mockUser.accessToken);

        await superTest(expressApp)
          .get(retrieveAdminDashboardRequest.url)
          .set(retrieveAdminDashboardRequest.headers)
          .send(retrieveAdminDashboardRequest.body)
          .expect(HttpStatusCodes.FORBIDDEN, expectedResponseBody);
      })
    });

    describe('When a request received targeted to a secured area with a token in wrong access type', function () {
      it('show block access to the secured area and return response with HTTP/403 status code ', async function () {
        const mockUser = MockDataProvider.createMockUserThatTfaEnabled(ACCESS_TYPE_2FA);

        const retrieveAdminDashboardRequest = RequestBuilder
          .createValidRetrieveAdminDashboardRequest(mockUser.accessToken);

        const expectedResponseBody = {
          error: "Unauthorized access",
        };

        await superTest(expressApp)
          .get(retrieveAdminDashboardRequest.url)
          .set(retrieveAdminDashboardRequest.headers)
          .send(retrieveAdminDashboardRequest.body)
          .expect(HttpStatusCodes.FORBIDDEN, expectedResponseBody);
      });
    })
  });
});