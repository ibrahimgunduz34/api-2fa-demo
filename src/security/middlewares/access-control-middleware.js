`use strict`;

const { authenticationService } = require('../services');
const { BadRequestError, UnauthorizedError } = require('../../common/exceptions');

const ACCESS_TOKEN_KEY= 'authorization';

module.exports = (req, res, next) => {
  const nonSecuredContext = [
    '/v1/security/authenticate',
    '/v1/security/register',
  ];

  const matched = nonSecuredContext.find(path => req.path === path);
  if (matched) {
    return next();
  }

  if (!req.headers.hasOwnProperty(ACCESS_TOKEN_KEY)) {
    throw new UnauthorizedError('You cannot access a secured area without access token');
  }

  const authorizationHeader = req.headers[ACCESS_TOKEN_KEY].split(' ');

  if (authorizationHeader.length !== 2) {
    throw new BadRequestError('Invalid authorization header');
  }

  const [ authorizationType, accessToken ] = authorizationHeader.map(s => s.trim());

  if (authorizationType.toLowerCase() !== 'bearer') {
    throw new BadRequestError('Invalid authorization type');
  }

  const authenticatedUser = authenticationService.authenticateWithToken(accessToken);

  if (!req.context) {
    req['session_context'] = {};
  }

  req['session_context'] = Object.assign(req['session_context'], {
    userId: authenticatedUser.id,
  });

  next()
};