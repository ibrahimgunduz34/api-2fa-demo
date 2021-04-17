'use strict';

const HttpStatusCodes = require('http-status-codes');
const { twoFactorAuthenticationService } = require('../services');

module.exports = (req, res) => {
  const authenticatedUserId = req.session_context.userId;
  const userSecretKey = twoFactorAuthenticationService.createTfaSecretKey(authenticatedUserId);
  res.status(HttpStatusCodes.OK)
    .json({
      userSecretKey: userSecretKey,
    })
};