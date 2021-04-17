`use strict`;

const { userRepository, accessTokenRespository } = require('./../repositories');
const config = require('../../config');
const { NoUserExistError, InvalidAccessTokenError } = require('../exceptions');
const cryptoService = require('./crypto-service');
const { ACCESS_TYPE_2FA, ACCESS_TYPE_AUTHORIZED } = require('../access-type');

function authenticate(username, password) {
  const user = userRepository.findOneByName(username);

  if (!user) {
    throw new NoUserExistError('Invalid username or password.');
  }

  if (cryptoService.decrypt(config.SECRET_KEY, user.password) !== password ) {
    throw new NoUserExistError('Invalid username or password.');
  }

  const accessTokenTtl = user.isTfaEnabled ? config.SHORT_LIFE_TOKEN_TTL : config.LONG_LIFE_TOKEN_TTL;
  const accessType = user.isTfaEnabled ? ACCESS_TYPE_2FA : ACCESS_TYPE_AUTHORIZED;

  // TODO: Check if the user is active
  // if (user.isEnabled) {
  //   throw new UserInactiveError('The user is not active');
  // }

  return accessTokenRespository.create(user.id, accessTokenTtl, accessType);
}

function authenticateWithToken(token) {
  const accessToken = accessTokenRespository.findOneByToken(token);

  if (!accessToken) {
    throw new InvalidAccessTokenError('No token found.');
  }

  if (Date.now() - accessToken.createdAt >= accessToken.ttl) {
    throw new InvalidAccessTokenError('The token is not valid anymore');
  }

  const user = userRepository.findOneById(accessToken.userId);
  // TODO: Check if the user is active
  // if (user.isEnabled) {
  //   throw new UserInactiveError('The user is not active');
  // }

  return {
    userId: user.id,
    accessType: accessToken.accessType,
    username: user.username,
  }
}

module.exports = {
  authenticate,
  authenticateWithToken
};