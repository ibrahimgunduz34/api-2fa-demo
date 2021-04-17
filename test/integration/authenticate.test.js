`use strict`;

const test = require('supertest');
const expressApp = require('../../src/app');
const HttpStatusCodes = require('http-status-codes');
const should = require('should');
const RequestBuilder = require('./utils/request-builder');
const MockDataProvider = require('./utils/mock-data-provider');
const { ACCESS_TYPE_AUTHORIZED, ACCESS_TYPE_2FA } = require('../../src/security/access-type');

describe('Security - Authenticate Tests', function () {
  describe('Positive flow', function () {
    describe('When a valid authenticate request received', async function () {
      it('should return a successfull response with an access token and HTTP/200 status code  ', async function () {
        const mockUser = MockDataProvider.createMockUserWithAccessToken(Date.now(), 300, ACCESS_TYPE_AUTHORIZED);

        const authenticateRequest = RequestBuilder.createAuthenticateRequest(mockUser.username, 'mypassword');

        const authenticateResponse = await test(expressApp)
          .post(authenticateRequest.url)
          .set(authenticateRequest.headers)
          .send(authenticateRequest.body)
          .expect(HttpStatusCodes.OK);

        should(authenticateResponse.body).have.properties(['accessToken', 'ttl', 'accessType']);
        should(authenticateResponse.body.accessType).be.eql(ACCESS_TYPE_AUTHORIZED);
      })
    });

    describe('When a valid authenticate request received with a user TFA enabled', async function () {
      it('should return a successfull response with an access token and HTTP/200 status code  ', async function () {
        const mockUser = MockDataProvider.createMockUserThatTfaEnabled(ACCESS_TYPE_2FA);

        const authenticateRequest = RequestBuilder.createAuthenticateRequest(mockUser.username, 'mypassword');

        const authenticateResponse = await test(expressApp)
          .post(authenticateRequest.url)
          .set(authenticateRequest.headers)
          .send(authenticateRequest.body)
          .expect(HttpStatusCodes.OK);

        should(authenticateResponse.body).have.properties(['accessToken', 'ttl', 'accessType']);
        should(authenticateResponse.body.accessType).be.eql(ACCESS_TYPE_2FA);
      })
    });
  });

  describe('Negative flow', function () {
    describe('When an invalid authenticate request received with missing username', function () {
      it('should return an error response with HTTP/400 status code', async function () {
        const authenticateRequest = RequestBuilder.createAuthenticateRequest(undefined, 'mypassword');

        const expectedResponseBody = {
          errors: {
            body: [
              {
                dataPath: "",
                keyword: "required",
                message: "should have required property 'username'",
                params: {
                  missingProperty: "username",
                },
                schemaPath: "#/required"
              }
            ]
          }
        };

        await test(expressApp)
          .post(authenticateRequest.url)
          .set(authenticateRequest.headers)
          .send(authenticateRequest.body)
          .expect(HttpStatusCodes.BAD_REQUEST, expectedResponseBody);
      })
    });

    describe('When an invalid authenticate request received with missing password', function () {
      it('should return an error response with HTTP/400 status code', async function () {
        const authenticateRequest = RequestBuilder.createAuthenticateRequest('myuser', undefined);

        const expectedResponseBody = {
          errors: {
            body: [
              {
                dataPath: "",
                keyword: "required",
                message: "should have required property 'password'",
                params: {
                  missingProperty: "password",
                },
                schemaPath: "#/required"
              }
            ]
          }
        };

        await test(expressApp)
          .post(authenticateRequest.url)
          .set(authenticateRequest.headers)
          .send(authenticateRequest.body)
          .expect(HttpStatusCodes.BAD_REQUEST, expectedResponseBody);
      })
    });

    describe('When a valid authenticate request received with non-existed username', function () {
      it('should return an error response with HTTP/403 status code', async function () {
        const authenticateRequest = RequestBuilder.createAuthenticateRequest('non-existed-user', 'mypassword');

        const expectedResponseBody = {
          error: "Invalid username or password."
        };

        await test(expressApp)
          .post(authenticateRequest.url)
          .set(authenticateRequest.headers)
          .send(authenticateRequest.body)
          .expect(HttpStatusCodes.FORBIDDEN, expectedResponseBody);
      })
    });
  });
});