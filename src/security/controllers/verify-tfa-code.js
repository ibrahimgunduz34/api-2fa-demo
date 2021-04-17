'use strict';

const { twoFactorAuthenticationService } = require('../services');
const HttpStatusCodes = require('http-status-codes');

module.exports = (req, res) => {
  const code = req.body.code;
  const authenticatedUserId = req.session_context.userId;
  const token = twoFactorAuthenticationService.verifyTfaCode(authenticatedUserId, code);
  res.status(HttpStatusCodes.OK)
    .json({
      accessToken: token.accessToken,
      ttl: token.ttl,
      accessType: token.accessType,
    })
};