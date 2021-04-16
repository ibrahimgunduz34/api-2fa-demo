`use strict`;

const test = require('supertest');
const expressApp = require('../../src/app');
const HttpStatusCodes = require('http-status-codes');
const should = require('should');
const RequestBuilder = require('./utils/request-builder');
const uuid = require('uuid');

describe('Security - Authenticate Tests', function () {
  describe('Positive flow', function () {
    describe('When a valid authenticate request received', async function () {
      it('should return a successfull response with an access token and HTTP/200 status code  ', async function () {
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

        should(authenticateResponse.body).have.properties(['shortLifeAccessToken', 'ttl'])
      })
    });

    describe('When a request received targeted to a secured area and with an access token.', function () {

    })
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