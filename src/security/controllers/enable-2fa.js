'use strict';

const HttpStatusCodes = require('http-status-codes');

module.exports = (req, res) => {
  if (!req.session_context || !req.session_context.userId) {
    res.status(HttpStatusCodes.FORBIDDEN).json({
      error: 'Unauthorized request',
    })
  }

};