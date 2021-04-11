`use strict`;

const { BadRequestError } = require('../../common/exceptions');

module.exports = class UserAlreadyExistError extends BadRequestError {
  constructor(message) {
    super(message);
  }
};