`use strict`;

module.exports = class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
  }
};