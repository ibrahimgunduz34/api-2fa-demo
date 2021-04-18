`use strict`;

const superTest = require('supertest');
const expressApp = require('../../src/app');
const HttpStatusCodes = require('http-status-codes');
const should = require('should');
const RequestBuilder = require('./utils/request-builder');
const MockDataProvider = require('./utils/mock-data-provider');
const { ACCESS_TYPE_AUTHORIZED } = require('../../src/security/access-type');

describe('Security - Enable Two Factor Authentication Tests', function () {
  describe('Positive flow', function () {
    describe('When an enable tfa request received with a valid access token in the request headers', function () {
      it('should return a successful response with a user specific secret key to be used in an authenticator app.', async function () {
        const mockUser = MockDataProvider.createMockUserWithAccessToken(Date.now(), 300, ACCESS_TYPE_AUTHORIZED);
        const enableTfaRequest = RequestBuilder.createEnableTfaRequest(mockUser.accessToken);

        const apiResponse = await superTest(expressApp)
          .post(enableTfaRequest.url)
          .set(enableTfaRequest.headers)
          .send()
          .expect(HttpStatusCodes.OK);

        // TODO: It will return a QR code image url at the second phase.
        should(apiResponse.body).have.properties(['userSecretKey']);
        should(apiResponse.body.userSecretKey).not.be.null();
        should(apiResponse.body.userSecretKey).not.be.empty()
      })
    });
  });

  describe('Negative flow', function () {
    describe('When an enable tfa request received without authorization header', function () {
      it('should return an error response with HTTP/403 status code', async function () {
        const enableTfaRequest = RequestBuilder.createInvalidEnableTfaRequestWithMissingAuthorizationHeader();

        const expectedResponseBody = {
          error: "You cannot access a secured area without access token"
        };

        await superTest(expressApp)
          .post(enableTfaRequest.url)
          .set(enableTfaRequest.headers)
          .send()
          .expect(HttpStatusCodes.FORBIDDEN, expectedResponseBody);
      });
    });

    describe('When an enable tfa request received for a user that is already enabled tfa', function () {
      it('should return an error response with HTTP/400 status code', async function () {
        const mockUser = MockDataProvider.createMockUserThatTfaEnabled(ACCESS_TYPE_AUTHORIZED);
        const enableTfaRequest = RequestBuilder.createEnableTfaRequest(mockUser.accessToken);

        const expectedResponseBody = {
          error: 'Two factor authentication is already enabled for the user'
        };

        await superTest(expressApp)
          .post(enableTfaRequest.url)
          .set(enableTfaRequest.headers)
          .send()
          .expect(HttpStatusCodes.BAD_REQUEST, expectedResponseBody);
      });
    });
  });
});