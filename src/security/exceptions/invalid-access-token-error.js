`use strict`;

const { UnauthorizedError } = require('../../common/exceptions');

module.exports = class InvalidAccessTokenError extends UnauthorizedError {
  constructor(message) {
    super(message);
  }
};