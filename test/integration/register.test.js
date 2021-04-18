`use strict`;

const superTest = require('supertest');
const expressApp = require('../../src/app');
const HttpStatusCodes = require('http-status-codes');
const RequestBuilder = require('./utils/request-builder');
const uuid = require('uuid');

describe('Security - Register Tests', function () {
  describe('Positive flow', function () {
    describe('When a valid register request received', function () {
      it('should create a new user successfully', async function () {
        const username = `myuser-${uuid.v4()}`;
        const request = RequestBuilder.createRegisterRequest(username, 'mypassword');

        const expectedResponseBody = { success: true };

        await superTest(expressApp)
          .post(request.url)
          .set(request.headers)
          .send(request.body)
          .expect(HttpStatusCodes.CREATED, expectedResponseBody)
      })
    })
  });

  describe('Negative flow', function () {
    describe('When a invalid register request received with missing username', function () {
      it('should return an error response with HTTP/400 status code', async function () {
        const request = RequestBuilder.createRegisterRequest(undefined, 'mypassword');

        const expectedResponseBody = {
          errors: {
            body: [
              {
                dataPath: "",
                keyword: "required",
                message: "should have required property 'username'",
                params: {
                  missingProperty: "username"
                },
                schemaPath: "#/required"
              }
            ]
          }
        };

        await superTest(expressApp)
          .post(request.url)
          .set(request.headers)
          .send(request.body)
          .expect(HttpStatusCodes.BAD_REQUEST, expectedResponseBody)
      });
    });

    describe('When a invalid register request received with missing password', function () {
      it('should return an error response with HTTP/400 status code', async function () {
        const request = RequestBuilder.createRegisterRequest('myuser', undefined);

        const expectedResponseBody = {
          errors: {
            body: [
              {
                dataPath: "",
                keyword: "required",
                message: "should have required property 'password'",
                params: {
                  missingProperty: "password"
                },
                schemaPath: "#/required"
              }
            ]
          }
        };

        await superTest(expressApp)
          .post(request.url)
          .set(request.headers)
          .send(request.body)
          .expect(HttpStatusCodes.BAD_REQUEST, expectedResponseBody)
      });
    });

    describe('When a valid register request received with an existing username', function () {
      it('should return an error response with HTTP/400 status code', async function () {
        const username = `myuser-${uuid.v4()}`;
        const request = RequestBuilder.createRegisterRequest(username, 'mypassword');

        await superTest(expressApp)
          .post(request.url)
          .set(request.headers)
          .send(request.body)
          .expect(HttpStatusCodes.CREATED);

        const expectedResponseBody = {
          error: "The user already exists."
        };

        await superTest(expressApp)
          .post(request.url)
          .set(request.headers)
          .send(request.body)
          .expect(HttpStatusCodes.BAD_REQUEST, expectedResponseBody)
      });
    });
  });
});