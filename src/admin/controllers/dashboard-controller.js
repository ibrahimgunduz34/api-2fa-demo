`use strict`;

const HttpStatusCodes = require('http-status-codes');

module.exports = (req, res) => {
  res.status(HttpStatusCodes.OK)
    .json({
      success: true,
      dashboard: {},
    })
};