`use strict`;

const { BadRequestError } = require('../../common/exceptions');

module.exports = class TfaAlreadyEnabledError extends BadRequestError {
  constructor(message) {
    super(message);
  }
};