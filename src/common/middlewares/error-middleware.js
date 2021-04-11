const { ValidationError } = require('express-json-validator-middleware');
const HttpStatusCodes = require('http-status-codes');

const { UnauthorizedError, BadRequestError } = require('../exceptions')

module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ValidationError) {
    res.status(HttpStatusCodes.BAD_REQUEST)
      .json({
          errors: err.validationErrors,
        });
  } else if (err instanceof BadRequestError) {
    res.status(HttpStatusCodes.BAD_REQUEST)
      .json({
        error: err.message,
      });
  } else if (err instanceof UnauthorizedError ) {
    res.status(HttpStatusCodes.FORBIDDEN)
      .json({
        error: err.message,
      });
  } else {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        error: err.message,
      });
  }
  next()
};