`use strict`;

const HttpStatusCodes = require('http-status-codes');
const { authenticationService } = require('../services');

module.exports = (req, res) => {
  const {username, password} = req.body;
  const token = authenticationService.authenticate(username, password);
  res.status(HttpStatusCodes.OK)
    .json({
      shortLifeAuthenticationToken: token.accessToken,
      ttl: token.ttl,
    })
};