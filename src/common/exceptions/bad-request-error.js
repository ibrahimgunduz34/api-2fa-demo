`use strict`;

module.exports = class BadRequestError extends Error {
  constructor(message) {
    super(message);
  }
};