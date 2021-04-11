`use strict`;

const { UnauthorizedError } = require('../../common/exceptions');

module.exports = class NoUserExistError extends UnauthorizedError {
  constructor(message) {
    super(message);
  }
};