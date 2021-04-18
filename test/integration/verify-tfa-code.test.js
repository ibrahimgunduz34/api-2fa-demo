`use strict`;

const superTest = require('supertest');
const { authenticator } = require('otplib');
const expressApp = require('../../src/app');
const RequestBuilder = require('./utils/request-builder');
const HttpStatusCodes = require('http-status-codes');
const MockDataProvider = require('./utils/mock-data-provider');
const { ACCESS_TYPE_AUTHORIZED, ACCESS_TYPE_2FA } = require('../../src/security/access-type');
const sinon = require('sinon');
const should = require('should');

describe('Security - Verify Two Factor Authentication Code Tests', function () {
  describe('Positive flow', function () {
    describe('When a tfa verification request received with a valid authorization header', function () {
      it('should return successful response with long time access token', async function () {
        const { accessToken, secretKey } = MockDataProvider.createMockUserThatTfaEnabled(ACCESS_TYPE_2FA);
        const mockVerificationCode = '123456';
        const verificationRequest = RequestBuilder.createVerificationRequest(accessToken, mockVerificationCode);

        sinon.stub(authenticator, 'verify')
          .withArgs({token: mockVerificationCode, secret: secretKey})
          .returns(true);

        const apiResponse = await superTest(expressApp)
          .post(verificationRequest.url)
          .set(verificationRequest.headers)
          .send(verificationRequest.body)
          .expect(HttpStatusCodes.OK);

        should(apiResponse.body).have.properties(['accessToken', 'ttl', 'accessType']);
        should(apiResponse.body.accessType).be.eql(ACCESS_TYPE_AUTHORIZED);

        sinon.restore();
      });
    });
  });

  describe('Negative flow', function () {
    describe('When an invalid TFA verification request received with missing authorization header', function () {
      it('should return an error response with HTTP/400 status code', async function () {
        const verificationRequest = RequestBuilder
          .createInvalidTfaVerificationRequestWithMissingAuthorizationHeader();

        const expectedResponseBody = {
          error: "You cannot access a secured area without access token"
        };

        await superTest(expressApp)
          .post(verificationRequest.url)
          .set(verificationRequest.headers)
          .send(verificationRequest.body)
          .expect(HttpStatusCodes.FORBIDDEN, expectedResponseBody)
      });
    });

    describe('When an invalid TFA verification request received with missing verification code', function () {
      it('should return an error response with HTTP/400 status code', async function () {
        const { accessToken } = MockDataProvider.createMockUserThatTfaEnabled(ACCESS_TYPE_2FA);

        const verificationRequest = RequestBuilder
          .createInvalidTfaVerificationRequestWithMissingVerificationCode(accessToken);

        const expectedResponseBody = {
          errors: {
            body: [
              {
                dataPath: "",
                keyword: "required",
                message: "should have required property 'code'",
                params: {
                  missingProperty: "code"
                },
                schemaPath: "#/required"
              }
            ]
          }
        };

        await superTest(expressApp)
          .post(verificationRequest.url)
          .set(verificationRequest.headers)
          .send(verificationRequest.body)
          .expect(HttpStatusCodes.BAD_REQUEST, expectedResponseBody)
      });
    });

    describe('When the a verification request received with invalid or expired code', function () {
      it('should return an error response with HTTP/403 status code', async function () {
        const { accessToken, secretKey } = MockDataProvider.createMockUserThatTfaEnabled(ACCESS_TYPE_2FA);
        const mockVerificationCode = '123456';
        const verificationRequest = RequestBuilder.createVerificationRequest(accessToken, mockVerificationCode);

        sinon.stub(authenticator, 'verify')
          .withArgs({token: mockVerificationCode, secret: secretKey})
          .returns(false);

        const expectedResponseBody = {
          error: "Invalid verification code"
        };

        await superTest(expressApp)
          .post(verificationRequest.url)
          .set(verificationRequest.headers)
          .send(verificationRequest.body)
          .expect(HttpStatusCodes.FORBIDDEN, expectedResponseBody);

        sinon.restore();
      });
    })
  });
});