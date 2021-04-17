`use strict`;

const { UnauthorizedError } = require('../../common/exceptions');

module.exports = class TfaCodeVerificationError extends UnauthorizedError {
  constructor(message) {
    super(message);
  }
};